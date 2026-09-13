/**
 * Prefix a file served from public/ with the deployment basePath.
 *
 * Next rewrites its own `_next/*` URLs for us, but `images.unoptimized` (which
 * a static export requires) makes next/image emit the raw `src` - so on GitHub
 * Pages, where the site lives under /erik-oldre/, `/erik.jpg` 404s. Route every
 * public/ asset through here instead of hardcoding a root-relative path.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string): string {
  return `${BASE_PATH}${path}`;
}
