import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { compressForPrint, makePreviewDataUrl } from "@/lib/images";

/**
 * The rule these cover: a browser that cannot decode or re-encode an image
 * must still hand the customer's original photo to checkout. Losing it — or
 * throwing — would drop the order.
 *
 * jsdom ships no canvas backend, so it stands in for exactly that browser.
 */

function photo(name = "memory.jpg", type = "image/jpeg", bytes = 4_000_000): File {
  const file = new File([new Uint8Array(8)], name, { type });
  // Real files are far larger than anything jsdom will hold in memory.
  Object.defineProperty(file, "size", { value: bytes });
  return file;
}

describe("compressForPrint", () => {
  beforeEach(() => {
    vi.stubGlobal("createImageBitmap", undefined);
    // No object URLs means the <img> fallback cannot run either, which is
    // exactly the "browser cannot decode this" case these cover.
    URL.createObjectURL = undefined as unknown as typeof URL.createObjectURL;
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns the original file when the browser cannot decode it", async () => {
    const original = photo();
    const result = await compressForPrint(original);
    expect(result).toBe(original);
  });

  it("leaves non-image files alone", async () => {
    const notAPhoto = photo("notes.pdf", "application/pdf", 1000);
    expect(await compressForPrint(notAPhoto)).toBe(notAPhoto);
  });

  it("keeps the original when re-encoding would not save enough to be worth it", async () => {
    const original = photo("big.jpg", "image/jpeg", 100);
    vi.stubGlobal("createImageBitmap", async () => ({ width: 400, height: 300, close: () => {} }));
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      drawImage: () => {},
      fillRect: () => {},
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
      fillStyle: "",
    } as unknown as CanvasRenderingContext2D);
    // Same size as the original: no saving, so it is not worth the quality loss.
    vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation((cb) => {
      (cb as BlobCallback)(new Blob([new Uint8Array(100)], { type: "image/jpeg" }));
    });

    const result = await compressForPrint(original);
    expect(result).toBe(original);
  });

  it("replaces the file when re-encoding is a real saving, and names it .jpg", async () => {
    const original = photo("IMG_0042.HEIC", "image/heic", 8_000_000);
    vi.stubGlobal("createImageBitmap", async () => ({ width: 6000, height: 4000, close: () => {} }));
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      drawImage: () => {},
      fillRect: () => {},
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
      fillStyle: "",
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation((cb) => {
      (cb as BlobCallback)(new Blob([new Uint8Array(64)], { type: "image/jpeg" }));
    });

    const result = await compressForPrint(original);
    expect(result).not.toBe(original);
    expect(result.name).toBe("IMG_0042.jpg");
    expect(result.type).toBe("image/jpeg");
    expect(result.size).toBeLessThan(original.size);
  });

  it("never rejects, even when decoding throws", async () => {
    vi.stubGlobal("createImageBitmap", async () => {
      throw new Error("boom");
    });
    const original = photo();
    await expect(compressForPrint(original)).resolves.toBe(original);
  });
});

describe("makePreviewDataUrl", () => {
  beforeEach(() => {
    vi.stubGlobal("createImageBitmap", undefined);
    // No object URLs means the <img> fallback cannot run either, which is
    // exactly the "browser cannot decode this" case these cover.
    URL.createObjectURL = undefined as unknown as typeof URL.createObjectURL;
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("falls back to reading the file when the image cannot be drawn", async () => {
    const url = await makePreviewDataUrl(photo("memory.jpg", "image/jpeg", 8));
    expect(url.startsWith("data:")).toBe(true);
  });
});
