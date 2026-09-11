import { describe, it, expect } from "vitest";
import {
  parseSizeInches,
  effectiveDpi,
  assessPrintQuality,
  largestGoodSize,
} from "@/lib/printQuality";

describe("parseSizeInches", () => {
  it("reads the shapes the catalog actually uses", () => {
    expect(parseSizeInches("4x6 inches")).toEqual({ width: 4, height: 6 });
    expect(parseSizeInches('5"x7"')).toEqual({ width: 5, height: 7 });
    expect(parseSizeInches("8x8 (20 pages)")).toEqual({ width: 8, height: 8 });
    expect(parseSizeInches("12 × 18")).toEqual({ width: 12, height: 18 });
  });

  it("returns null for labels that name no size, so quality is skipped not guessed", () => {
    expect(parseSizeInches("11oz Standard")).toBeNull();
    expect(parseSizeInches("Large")).toBeNull();
  });
});

describe("effectiveDpi", () => {
  it("is limited by the axis that runs out first when cropping to fill", () => {
    // 1200x1200 on a 4x6: the 6-inch side only has 1200px → 200 DPI.
    expect(effectiveDpi({ width: 1200, height: 1200 }, { width: 4, height: 6 })).toBe(200);
  });

  it("rotates the print to suit the photo rather than penalising orientation", () => {
    const landscape = { width: 1800, height: 1200 };
    // Same photo, same print, either way round — the print turns to fit.
    expect(effectiveDpi(landscape, { width: 4, height: 6 })).toBe(
      effectiveDpi(landscape, { width: 6, height: 4 })
    );
    expect(effectiveDpi(landscape, { width: 4, height: 6 })).toBe(300);
  });

  it("reports 0 rather than Infinity for a degenerate input", () => {
    expect(effectiveDpi({ width: 0, height: 0 }, { width: 4, height: 6 })).toBe(0);
    expect(effectiveDpi({ width: 1200, height: 1200 }, { width: 0, height: 0 })).toBe(0);
  });
});

describe("assessPrintQuality", () => {
  it("grades a 12MP phone photo as excellent at 4x6", () => {
    const q = assessPrintQuality({ width: 4032, height: 3024 }, { width: 4, height: 6 });
    expect(q.tier).toBe("excellent");
    expect(q.warn).toBe(false);
    expect(q.label).toMatch(/^Excellent — \d+ DPI$/);
  });

  it("warns on a screenshot-sized image at 5x7", () => {
    const q = assessPrintQuality({ width: 800, height: 600 }, { width: 5, height: 7 });
    expect(q.tier).toBe("low");
    expect(q.warn).toBe(true);
  });

  it("treats the 150 and 300 DPI boundaries as inclusive", () => {
    // 600x900 on 4x6 = exactly 150 DPI.
    expect(assessPrintQuality({ width: 600, height: 900 }, { width: 4, height: 6 }).tier).toBe("acceptable");
    // 1200x1800 on 4x6 = exactly 300 DPI.
    expect(assessPrintQuality({ width: 1200, height: 1800 }, { width: 4, height: 6 }).tier).toBe("excellent");
  });
});

describe("largestGoodSize", () => {
  const sizes = ["4x6 inches", "5x7 inches"];

  it("steers a photo to the biggest size it can still carry", () => {
    // 216 DPI at 4x6 (good) but only 180 at 5x7 (acceptable), so 4x6 wins.
    expect(largestGoodSize({ width: 900, height: 1300 }, sizes)).toBe("4x6 inches");
  });

  it("picks the larger print when the photo has the pixels for it", () => {
    expect(largestGoodSize({ width: 4032, height: 3024 }, sizes)).toBe("5x7 inches");
  });

  it("returns null when nothing qualifies, rather than recommending a bad print", () => {
    expect(largestGoodSize({ width: 320, height: 240 }, sizes)).toBeNull();
  });

  it("ignores variants whose label names no size", () => {
    expect(largestGoodSize({ width: 4032, height: 3024 }, ["11oz Standard"])).toBeNull();
  });
});
