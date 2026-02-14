/**
 * Get the full path to a sprite image, accounting for Vite's base URL
 * (necessary for GitHub Pages deployment)
 */
export function getSpritePath(filename: string): string {
  return `${import.meta.env.BASE_URL}sprites/${filename}`;
}
