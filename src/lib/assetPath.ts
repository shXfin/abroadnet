/**
 * Resolves a public-folder path against Vite's configured base, so it works
 * both in dev (base "/") and on GitHub Pages (base "/abroadnet/").
 * Usage: assetPath("photos/foo.jpg") instead of a hardcoded "/photos/foo.jpg".
 */
export function assetPath(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
