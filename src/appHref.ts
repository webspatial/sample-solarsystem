/** In-app path like `scene/overview` (no leading slash). Respects Vite `base` / AVP output path. */
export function appHref(path: string): string {
  const base = import.meta.env.BASE_URL
  const clean = path.replace(/^\/+/, '')
  return `${base}${clean}`
}

export function appOriginUrl(path: string): string {
  return `${window.location.origin}${appHref(path)}`
}
