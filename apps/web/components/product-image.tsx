import { imageBounds } from '../lib/product-image-bounds';
import { cutoutBounds } from '../lib/product-cutout-bounds';
import { assetUrl } from '../lib/assets';

export function ProductImage({ src, alt }: { src: string; alt: string }) {
  const originalPath = src.split('?')[0];
  const cutoutPath = originalPath.replace(/\.png$/, '-cutout.png');
  const path = cutoutBounds[cutoutPath] ? cutoutPath : originalPath;
  const bounds = cutoutBounds[path] || imageBounds[path];
  if (!bounds) return <img src={assetUrl(src)} alt={alt} />;
  const [width, height, x, y, cropWidth, cropHeight] = bounds;
  return <span className="product-image-stage" role="img" aria-label={alt}>
    <svg viewBox={`${x} ${y} ${cropWidth} ${cropHeight}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <image href={assetUrl(`${path}?v=6`)} width={width} height={height} />
    </svg>
  </span>;
}
