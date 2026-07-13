#!/usr/bin/env node
// A friendly wrapper around `next dev` that:
//   1. Auto-picks a free port (so it never collides with other things you run).
//   2. Keeps the preview up — if the dev server crashes, it restarts it.
//   3. Shuts down cleanly on Ctrl+C — kills the whole process tree, frees the
//      port, and never leaves an orphaned node process behind.
//
// Used by `npm run dev` / `pnpm dev`. Override the starting port with PORT=4000.

import { spawn } from "node:child_process";
import net from "node:net";

const BASE_PORT = Number(process.env.PORT) || 3000;
const NEXT_BIN = process.platform === "win32" ? "next.cmd" : "next";

/** Resolve a free port, starting at `start` and walking upward. */
function findFreePort(start, attempt = 0) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.once("error", (err) => {
      if (err.code === "EADDRINUSE" && attempt < 100) {
        resolve(findFreePort(start + 1, attempt + 1));
      } else if (err.code === "EADDRINUSE") {
        // Everything nearby is taken — let the OS hand us any free port.
        const os = net.createServer();
        os.listen(0, () => {
          const { port } = os.address();
          os.close(() => resolve(port));
        });
      } else {
        reject(err);
      }
    });
    server.once("listening", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.listen(start, "0.0.0.0");
  });
}

let child = null;
let shuttingDown = false;
let recentRestarts = 0;
let startedAt = 0;

async function startServer() {
  const port = await findFreePort(BASE_PORT);
  startedAt = Date.now();

  console.log(`\n\x1b[36m▲ Next.js dev\x1b[0m  →  \x1b[1mhttp://localhost:${port}\x1b[0m`);
  console.log(`\x1b[2m  (auto-selected free port · Ctrl+C to stop cleanly)\x1b[0m\n`);

  // detached: true → the child leads its own process group, so on shutdown we
  // can signal the entire tree (next + its workers) in one shot.
  child = spawn(NEXT_BIN, ["dev", "-p", String(port)], {
    stdio: "inherit",
    detached: true,
    env: { ...process.env, PORT: String(port) },
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
