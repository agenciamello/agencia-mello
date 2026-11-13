// Keep a short-lived review link usable when navigating the preview.
// The token stays only in runtime memory; it is never persisted or embedded in assets.
const reviewSearch = typeof window === 'undefined' ? '' : (() => {
  const current = new URL(window.location.href);
  const token = current.searchParams.get('_vercel_share');
  return token ? `?_vercel_share=${encodeURIComponent(token)}` : '';
})();

export function blogHref(path: string) {
  return `${path}${reviewSearch}`;
}

export function blogShareUrl(path: string) {
  const current = new URL(window.location.href);
  const url = new URL(blogHref(path), current.origin);
  const token = current.searchParams.get('_vercel_share');
  if (token) url.searchParams.set('_vercel_share', token);
  return url.href;
}
