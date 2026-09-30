export function assetUrl(src: string) {
  if (!src || !src.startsWith('/')) return src;
  const baseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL?.replace(/\/$/, '');
  return baseUrl ? `${baseUrl}${src}` : src;
}
