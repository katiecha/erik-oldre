#!/usr/bin/env node
// A friendly wrapper around `next dev` that:
//   1. Always runs on a fixed port (3002) so the local URL never changes.
//   2. Keeps the preview up — if the dev server crashes, it restarts it.
//   3. Shuts down cleanly on Ctrl+C — kills the whole process tree, frees the
//      port, and never leaves an orphaned node process behind.
//
// If the port is held by a *stale copy of this project*, it reclaims it. If
// it's held by a *different* project, it refuses to stomp on it and tells you.
//
// Used by `npm run dev` / `pnpm dev`. Override the port with PORT=3003.

import { spawn, execSync } from "node:child_process";
import net from "node:net";
import path from "node:path";

const PORT = Number(process.env.PORT) || 3002;
const PROJECT_ROOT = process.cwd();
const NEXT_BIN = process.platform === "win32" ? "next.cmd" : "next";
// Local binaries live here whether or not a package manager put them on PATH.
const BIN_DIR = path.join(PROJECT_ROOT, "node_modules", ".bin");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Resolve true if `port` is currently accepting no new listeners (in use). */
function portInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", (err) => resolve(err.code === "EADDRINUSE"));
    server.once("listening", () => server.close(() => resolve(false)));
    server.listen(port, "0.0.0.0");
  });
}

/** PIDs listening on `port` (best-effort; macOS/Linux via lsof). */
function pidsOnPort(port) {
  try {
    return execSync(`lsof -ti tcp:${port} -sTCP:LISTEN`, {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim()
      .split("\n")
      .filter(Boolean)
      .map(Number);
  } catch {
    return [];
  }
}

/** Working directory of a pid (so we only reclaim *our* stale servers). */
function cwdOfPid(pid) {
  try {
    const out = execSync(`lsof -a -p ${pid} -d cwd -Fn`, {
      stdio: ["ignore", "pipe", "ignore"],
    }).toString();
    const line = out.split("\n").find((l) => l.startsWith("n"));
    return line ? line.slice(1) : null;
  } catch {
    return null;
  }
}

/** Make sure PORT is free. Returns true if usable, false if we must bail. */
async function ensurePortFree() {
  if (!(await portInUse(PORT))) return true;

  const ours = pidsOnPort(PORT).filter((pid) => cwdOfPid(pid) === PROJECT_ROOT);
  if (ours.length) {
    console.log(
      `\x1b[2m  Port ${PORT} was held by a stale dev server for this project — reclaiming it.\x1b[0m`,
    );
    for (const pid of ours) {
      try {
        process.kill(pid, "SIGTERM");
      } catch {
        /* already gone */
      }
    }
    for (let i = 0; i < 25; i++) {
      if (!(await portInUse(PORT))) return true;
      await sleep(200);
    }
    for (const pid of ours) {
      try {
        process.kill(pid, "SIGKILL");
      } catch {
        /* already gone */
      }
    }
    for (let i = 0; i < 10; i++) {
      if (!(await portInUse(PORT))) return true;
      await sleep(200);
    }
  }

  console.error(
    `\n\x1b[31m✖ Port ${PORT} is in use by another process (not this project).\x1b[0m\n` +
      `  Free it with:  \x1b[1mlsof -ti tcp:${PORT} | xargs kill\x1b[0m\n` +
      `  or run on a different port:  \x1b[1mPORT=3003 npm run dev\x1b[0m\n`,
  );
  return false;
}

let child = null;
let shuttingDown = false;
let recentRestarts = 0;
let startedAt = 0;

async function startServer() {
  if (!(await ensurePortFree())) {
    process.exit(1);
  }

  startedAt = Date.now();
  console.log(`\n\x1b[36m▲ Next.js dev\x1b[0m  →  \x1b[1mhttp://localhost:${PORT}\x1b[0m`);
  console.log(`\x1b[2m  (fixed port · Ctrl+C to stop cleanly)\x1b[0m\n`);

  // detached: true → the child leads its own process group, so on shutdown we
  // can signal the entire tree (next + its workers) in one shot.
  child = spawn(NEXT_BIN, ["dev", "-p", String(PORT)], {
    stdio: "inherit",
    detached: true,
    env: {
      ...process.env,
      PORT: String(PORT),
      PATH: `${BIN_DIR}${path.delimiter}${process.env.PATH ?? ""}`,
    },
  });

  child.on("error", (err) => {
    console.error(`\n\x1b[31m✖ Failed to launch next: ${err.message}\x1b[0m\n`);
    shuttingDown = true; // don't trigger the restart loop
    process.exit(1);
  });

  child.on("exit", (code, signal) => {
    child = null;
    if (shuttingDown) return;

    // Unexpected exit → keep the preview alive by restarting, but back off if
    // it's crash-looping so we don't spin forever on a fatal error.
    if (Date.now() - startedAt < 3000) recentRestarts += 1;
    else recentRestarts = 0;

    if (recentRestarts > 5) {
      console.error(
        `\n\x1b[31m✖ Dev server keeps crashing on startup — stopping.\x1b[0m ` +
          `Fix the error above, then run \`npm run dev\` again.\n`,
      );
      process.exit(code ?? 1);
    }

    console.log(
      `\n\x1b[33m⟳ Dev server stopped (${signal || `code ${code}`}). Restarting…\x1b[0m\n`,
    );
    setTimeout(startServer, 600);
  });
}

/** Kill the child's whole process group; SIGKILL fallback if it lingers. */
function killTree(signal) {
  if (!child?.pid) return;
  try {
    process.kill(-child.pid, signal);
  } catch {
    try {
      child.kill(signal);
    } catch {
      /* already gone */
    }
  }
}

function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;

  if (!child) {
    process.exit(0);
    return;
  }

  console.log("\n\x1b[36m⏻ Stopping dev server…\x1b[0m");
  child.once("exit", () => {
    console.log("\x1b[32m✓ Cleaned up. See you soon!\x1b[0m");
    process.exit(0);
  });

  killTree("SIGTERM");
  // If it hasn't exited within a few seconds, force it and bail.
  setTimeout(() => {
    killTree("SIGKILL");
    process.exit(0);
  }, 4000).unref();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("SIGHUP", shutdown);
// Best-effort safety net so we never orphan the tree if the wrapper itself dies.
process.on("exit", () => killTree("SIGKILL"));

startServer().catch((err) => {
  console.error("Failed to start dev server:", err);
  process.exit(1);
});
