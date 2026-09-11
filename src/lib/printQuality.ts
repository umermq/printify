/**
 * How well a photo will actually print at a given size.
 *
 * A 2MP phone screenshot looks perfect on screen and prints as mush at 5x7.
 * The customer cannot see that coming, and by the time they can, the money is
 * spent and the reprint is ours. So every size a photo can be ordered at is
 * measured before checkout, not after.
 *
 * The measure is effective DPI after cropping to fill: the print has to be
 * covered edge to edge, so the limiting dimension is the one that decides.
 * Prints are rotated to whichever orientation suits the photo, so a portrait
 * photo is judged against a portrait print.
 */

export type PrintQualityTier = "excellent" | "good" | "acceptable" | "low";

export interface PrintQuality {
  /** Effective dots per inch once the photo is cropped to fill the print. */
  dpi: number;
  tier: PrintQualityTier;
  /** Short label for the badge, e.g. "Excellent — 412 DPI". */
  label: string;
  /** True for the tiers a customer should be warned about before ordering. */
  warn: boolean;
}

/** Industry floor for photographic printing is 300; below 150 is visibly soft. */
const TIERS: { min: number; tier: PrintQualityTier; text: string }[] = [
  { min: 300, tier: "excellent", text: "Excellent" },
  { min: 200, tier: "good", text: "Good" },
  { min: 150, tier: "acceptable", text: "Acceptable" },
  { min: 0, tier: "low", text: "Too low" },
];

/**
 * Pulls print dimensions out of a variant label. Handles the shapes the
 * catalog actually uses — "4x6 inches", "5x7", "8x8 (20 pages)", "12 × 18" —
 * and returns null for labels that name no size at all ("Small", "Large"),
 * which simply means quality cannot be judged for that variant.
 */
export function parseSizeInches(label: string): { width: number; height: number } | null {
  // The inch mark is optional and comes in several flavours, because admins
  // type sizes by hand: 4x6, 4"x6", 4” x 6”, 4in x 6in.
  const unit = `(?:\\s*(?:["”″]|in\\b|inch(?:es)?\\b))?`;
  const m = label.match(new RegExp(`(\\d+(?:\\.\\d+)?)${unit}\\s*[x×]\\s*(\\d+(?:\\.\\d+)?)`, "i"));
  if (!m) return null;
  const width = Number(m[1]);
  const height = Number(m[2]);
  if (!width || !height) return null;
  return { width, height };
}

/**
 * Effective DPI of `pixels` printed at `inches`, cropped to fill, in whichever
 * orientation flatters the photo.
 */
export function effectiveDpi(
  pixels: { width: number; height: number },
  inches: { width: number; height: number }
): number {
  if (!pixels.width || !pixels.height || !inches.width || !inches.height) return 0;

  // Cropping to fill means the print is covered when BOTH axes are covered,
  // so the smaller of the two ratios is the one that limits sharpness.
  const fill = (w: number, h: number) => Math.min(pixels.width / w, pixels.height / h);

  return Math.max(
    fill(inches.width, inches.height),
    fill(inches.height, inches.width) // the print, rotated
  );
}

export function assessPrintQuality(
  pixels: { width: number; height: number },
  inches: { width: number; height: number }
): PrintQuality {
  const dpi = Math.round(effectiveDpi(pixels, inches));
  const match = TIERS.find((t) => dpi >= t.min) ?? TIERS[TIERS.length - 1];
  return {
    dpi,
    tier: match.tier,
    label: `${match.text} — ${dpi} DPI`,
    warn: match.tier === "acceptable" || match.tier === "low",
  };
}

/**
 * The largest size in `labels` that still prints at `minTier` or better, so a
 * photo can be steered to a size that works instead of only being told off for
 * the one it cannot do. Returns null when none qualify.
 */
export function largestGoodSize(
  pixels: { width: number; height: number },
  labels: string[],
  minTier: PrintQualityTier = "good"
): string | null {
  const rank: Record<PrintQualityTier, number> = { low: 0, acceptable: 1, good: 2, excellent: 3 };

  const usable = labels
    .map((label) => ({ label, inches: parseSizeInches(label) }))
    .filter((entry): entry is { label: string; inches: { width: number; height: number } } => entry.inches !== null)
    .map((entry) => ({
      label: entry.label,
      area: entry.inches.width * entry.inches.height,
      quality: assessPrintQuality(pixels, entry.inches),
    }))
    .filter((entry) => rank[entry.quality.tier] >= rank[minTier]);

  if (!usable.length) return null;
  return usable.reduce((best, entry) => (entry.area > best.area ? entry : best)).label;
}
