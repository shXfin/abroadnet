/**
 * Flickr/Google-Photos-style row justification: packs items into rows so
 * every row's total width exactly fills the container, by uniformly scaling
 * each row to a shared height. Nothing is ever cropped or stretched out of
 * its own aspect ratio — only scaled — so there's never a ragged gap at the
 * bottom of a column the way CSS multi-column masonry produces.
 */
export function computeJustifiedRows<T extends { aspect: number }>(
  items: T[],
  containerWidth: number,
  targetHeight: number,
  gap: number
): { items: T[]; height: number }[] {
  if (!containerWidth || items.length === 0) return [];

  const rows: { items: T[]; height: number }[] = [];
  let current: T[] = [];
  let aspectSum = 0;

  for (const item of items) {
    current.push(item);
    aspectSum += item.aspect;
    const widthAtTarget = aspectSum * targetHeight + (current.length - 1) * gap;
    if (widthAtTarget >= containerWidth) {
      const rowHeight = (containerWidth - (current.length - 1) * gap) / aspectSum;
      rows.push({ items: current, height: rowHeight });
      current = [];
      aspectSum = 0;
    }
  }

  if (current.length) {
    const rawHeight = (containerWidth - (current.length - 1) * gap) / aspectSum;
    // Clamp so a small leftover row (e.g. one lone image) doesn't get
    // stretched to an absurd height just to fill the container width.
    rows.push({ items: current, height: Math.min(rawHeight, targetHeight * 1.6) });
  }

  return rows;
}
