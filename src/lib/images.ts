/**
 * Photo handling for the upload → print pipeline.
 *
 * Two different jobs, two different sizes:
 *
 *  - compressForPrint() makes the file that actually reaches the print shop.
 *    Phone cameras produce 4–10MB JPEGs; on a Pakistani mobile connection that
 *    is the difference between an order going through and a customer giving up
 *    at checkout. Re-encoding drops most of that weight, but the result still
 *    has to print well, so the cap is generous: 3600px on the long edge is a
 *    12-inch print at 300 DPI, larger than anything in the catalog.
 *
 *  - makePreviewDataUrl() makes the thumbnail the browser shows and the local
 *    order store keeps. That store is localStorage, which holds ~5MB total, so
 *    a full-resolution data URL (base64 is ~33% bigger than the file) silently
 *    blows the quota and the order never persists. A 480px preview does not.
 *
 * Nothing here is allowed to lose a customer's photo. Browsers that cannot
 * decode the format (Chrome still cannot read HEIC, which iPhones shoot by
 * default) fall back to the original file untouched — a slow upload beats a
 * failed one.
 */

/** 12 inches at 300 DPI — bigger than any print size in the catalog. */
const PRINT_MAX_EDGE = 3600;
const PRINT_QUALITY = 0.9;

const PREVIEW_MAX_EDGE = 480;
const PREVIEW_QUALITY = 0.7;

/** Only keep a re-encode that actually saves something worth the quality loss. */
const WORTH_IT_RATIO = 0.9;

/** Give up on an <img> that never loads rather than hanging the upload. */
const DECODE_TIMEOUT_MS = 15_000;

interface Decoded {
  width: number;
  height: number;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  release: () => void;
}

/**
 * Decodes an image file into something drawable, or null when the browser
 * cannot read it. createImageBitmap is the fast path; the <img> fallback
 * covers older Safari.
 */
async function decode(file: File): Promise<Decoded | null> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      return {
        width: bitmap.width,
        height: bitmap.height,
        draw: (ctx, w, h) => ctx.drawImage(bitmap, 0, 0, w, h),
        release: () => bitmap.close?.(),
      };
    } catch {
      /* fall through to the <img> path */
    }
  }

  if (typeof URL?.createObjectURL !== "function") return null;

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      // A decode that neither loads nor errors would leave the customer
      // watching a spinner forever, so it is bounded and then given up on.
      const timer = setTimeout(() => reject(new Error("decode timed out")), DECODE_TIMEOUT_MS);
      el.onload = () => { clearTimeout(timer); resolve(el); };
      el.onerror = () => { clearTimeout(timer); reject(new Error("decode failed")); };
      el.src = url;
    });
    return {
      width: img.naturalWidth,
      height: img.naturalHeight,
      draw: (ctx, w, h) => ctx.drawImage(img, 0, 0, w, h),
      release: () => URL.revokeObjectURL(url),
    };
  } catch {
    URL.revokeObjectURL(url);
    return null;
  }
}

/** Scales (never up) so the long edge fits within maxEdge. */
function fit(width: number, height: number, maxEdge: number): { w: number; h: number } {
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  return { w: Math.max(1, Math.round(width * scale)), h: Math.max(1, Math.round(height * scale)) };
}

/**
 * Draws the decoded image at the given size. Returns null when the canvas is
 * unavailable or tainted — callers treat that as "keep the original".
 */
function render(image: Decoded, w: number, h: number): HTMLCanvasElement | null {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  // JPEG has no alpha; without this, transparent PNGs re-encode to black.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  image.draw(ctx, w, h);
  return canvas;
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    if (typeof canvas.toBlob !== "function") {
      resolve(null);
      return;
    }
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
  });
}

function withJpegExtension(name: string): string {
  const base = name.replace(/\.[^./\\]+$/, "");
  return `${base || "photo"}.jpg`;
}

/**
 * Shrinks a photo to something a phone can upload, without dropping below
 * print quality. Returns the original file whenever compressing would not
 * help or is not possible — this never throws and never returns nothing.
 */
export async function compressForPrint(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  const image = await decode(file);
  if (!image) return file;

  try {
    const { w, h } = fit(image.width, image.height, PRINT_MAX_EDGE);
    const canvas = render(image, w, h);
    if (!canvas) return file;

    const blob = await toBlob(canvas, PRINT_QUALITY);
    if (!blob || blob.size >= file.size * WORTH_IT_RATIO) return file;

    return new File([blob], withJpegExtension(file.name), {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  } finally {
    image.release();
  }
}

/**
 * A small data URL for the cart thumbnail and the local order store. Falls
 * back to reading the file as-is when the image cannot be decoded, so the
 * customer still sees something.
 */
export async function makePreviewDataUrl(file: File): Promise<string> {
  const image = await decode(file);

  if (image) {
    try {
      const { w, h } = fit(image.width, image.height, PREVIEW_MAX_EDGE);
      const canvas = render(image, w, h);
      if (canvas && typeof canvas.toDataURL === "function") {
        return canvas.toDataURL("image/jpeg", PREVIEW_QUALITY);
      }
    } catch {
      /* fall through to the raw read */
    } finally {
      image.release();
    }
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(file);
  });
}
