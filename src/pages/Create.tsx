import { useState, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, Trash2, Copy, Minus, Plus, AlertTriangle, Check, Wand2, ArrowLeft } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/SEOHead";
import { compressForPrint, makePreviewDataUrl, readImageSize } from "@/lib/images";
import { assessPrintQuality, parseSizeInches, largestGoodSize, type PrintQuality } from "@/lib/printQuality";

const MAX_PHOTO_MB = 25;
const MAX_PHOTO_BYTES = MAX_PHOTO_MB * 1024 * 1024;

interface WizardPhoto {
  id: string;
  /** Compressed, print-ready. */
  file: File;
  preview: string;
  /** Null when the browser could not decode it — quality is then unknown, not bad. */
  pixels: { width: number; height: number } | null;
  sizeLabel: string;
  quantity: number;
}

const STEPS = ["Add photos", "Options", "Finish"] as const;

let photoCounter = 0;

const Create = () => {
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const { addItem } = useCart();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<WizardPhoto[]>([]);
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [themeIndex, setThemeIndex] = useState(0);

  // The wizard is the photo-printing path; other categories keep their own
  // product pages, where size and finish belong to the product not the photo.
  const product = useMemo(
    () => products.find((p) => p.categorySlug === "photo-prints"),
    [products]
  );

  const sizeLabels = useMemo(() => product?.sizes.map((s) => s.label) ?? [], [product]);
  const priceOf = useCallback(
    (label: string) => product?.sizes.find((s) => s.label === label)?.price ?? 0,
    [product]
  );
  const themeModifier = product?.themes[themeIndex]?.priceModifier ?? 0;

  const qualityOf = useCallback((photo: WizardPhoto): PrintQuality | null => {
    if (!photo.pixels) return null;
    const inches = parseSizeInches(photo.sizeLabel);
    if (!inches) return null;
    return assessPrintQuality(photo.pixels, inches);
  }, []);

  const total = photos.reduce((sum, p) => sum + (priceOf(p.sizeLabel) + themeModifier) * p.quantity, 0);
  const printCount = photos.reduce((sum, p) => sum + p.quantity, 0);
  const lowResCount = photos.filter((p) => qualityOf(p)?.warn).length;

  const acceptFiles = async (incoming: File[]) => {
    if (!sizeLabels.length) return;

    const images = incoming.filter((f) => f.type.startsWith("image/"));
    if (incoming.length && !images.length) {
      toast({ title: "Not an image", description: "Please choose photo files (JPG, PNG, HEIC).", variant: "destructive" });
      return;
    }
    const valid = images.filter((f) => {
      if (f.size > MAX_PHOTO_BYTES) {
        toast({ title: "File too large", description: `${f.name} is over ${MAX_PHOTO_MB}MB.`, variant: "destructive" });
        return false;
      }
      return true;
    });
    if (!valid.length) return;

    setProcessing(true);
    try {
      const prepared = await Promise.all(
        valid.map(async (original) => {
          // Measure the original: compression caps the long edge, so judging
          // the compressed copy would understate what the customer gave us.
          const pixels = await readImageSize(original);
          return {
            id: `photo-${(photoCounter += 1)}`,
            file: await compressForPrint(original),
            preview: await makePreviewDataUrl(original),
            pixels,
            // Start each photo at the biggest size it prints well at, rather
            // than at a default it may not have the pixels for.
            sizeLabel: (pixels && largestGoodSize(pixels, sizeLabels)) ?? sizeLabels[0],
            quantity: 1,
          };
        })
      );
      setPhotos((prev) => [...prev, ...prepared]);
      toast({ title: `${prepared.length} photo${prepared.length > 1 ? "s" : ""} added`, description: "Sizes picked to match each photo's resolution." });
    } catch {
      toast({ title: "Could not read those photos", description: "Please try again.", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const update = (id: string, patch: Partial<WizardPhoto>) =>
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const remove = (id: string) => setPhotos((prev) => prev.filter((p) => p.id !== id));

  const duplicate = (id: string) =>
    setPhotos((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index < 0) return prev;
      const copy = { ...prev[index], id: `photo-${(photoCounter += 1)}` };
      return [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)];
    });

  const applySizeToAll = (label: string) => {
    setPhotos((prev) => prev.map((p) => ({ ...p, sizeLabel: label })));
    toast({ title: `All photos set to ${label}` });
  };

  /** One click to move every warned photo to a size it can actually carry. */
  const fixLowRes = () => {
    let fixed = 0;
    setPhotos((prev) =>
      prev.map((p) => {
        const q = qualityOf(p);
        if (!q?.warn || !p.pixels) return p;
        const better = largestGoodSize(p.pixels, sizeLabels);
        if (!better || better === p.sizeLabel) return p;
        fixed += 1;
        return { ...p, sizeLabel: better };
      })
    );
    toast(
      fixed
        ? { title: `${fixed} photo${fixed > 1 ? "s" : ""} moved to a better size` }
        : { title: "Nothing to fix", description: "These photos need a bigger original to print larger." }
    );
  };

  const checkout = () => {
    if (!product) return;
    const theme = product.themes[themeIndex];

    for (const p of photos) {
      const variant = product.sizes.find((s) => s.label === p.sizeLabel);
      addItem({
        id: product.id,
        name: product.name,
        category: product.category,
        size: p.sizeLabel,
        theme: theme?.name ?? "",
        quantity: p.quantity,
        price: priceOf(p.sizeLabel) + themeModifier,
        image: p.preview,
        uploadedImages: [p.preview],
        photoFiles: [p.file],
        productDbId: product.dbId,
        variantId: variant?.id,
        themeId: theme?.id,
      });
    }
    toast({ title: "Added to your basket", description: `${printCount} print${printCount > 1 ? "s" : ""} ready to order.` });
    navigate("/cart");
  };

  // ---- Guards -------------------------------------------------------------
  if (loading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }
  if (error || !product) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-3xl font-bold text-foreground">Photo printing is unavailable right now</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error ?? "The photo prints product could not be found in the catalog."}</p>
        <button className="btn-luxury mt-8" onClick={() => navigate("/products")}>Browse other products</button>
      </div>
    );
  }

  const canLeaveStep0 = photos.length > 0 && !processing;

  return (
    <div className="min-h-screen bg-cream">
      <SEOHead
        title="Print your photos – upload, size and order | PixelCraft"
        description="Upload your photos, pick a size for each one, and we'll print and deliver them across Pakistan. Cash on Delivery available."
      />

      <div className="container max-w-5xl py-10">
        {/* ─── Stepper ─── */}
        <div className="mb-8 flex items-center gap-2 rounded-full bg-white p-1.5 shadow-luxury">
          {STEPS.map((label, i) => (
            <button
              key={label}
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              className={`flex-1 rounded-full px-3 py-2.5 text-[11px] font-semibold tracking-widest uppercase transition-all duration-300 sm:text-xs ${
                i === step
                  ? "bg-gradient-to-r from-primary to-amber-warm text-white shadow-md"
                  : i < step
                    ? "text-foreground hover:bg-cream"
                    : "text-muted-foreground/50"
              }`}
            >
              <span className="hidden sm:inline">{i + 1}. </span>
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ─── STEP 1 — ADD PHOTOS ─── */}
          {step === 0 && (
            <motion.div key="add" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Upload your photos</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We compress each one for a fast upload and keep full print quality. Nothing leaves your phone until you order.
              </p>

              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                onChange={async (e) => { await acceptFiles(Array.from(e.target.files ?? [])); e.target.value = ""; }} />

              <button
                onClick={() => fileRef.current?.click()}
                disabled={processing}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={async (e) => { e.preventDefault(); setDragging(false); if (!processing) await acceptFiles(Array.from(e.dataTransfer.files ?? [])); }}
                className={`mt-6 flex w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed bg-white py-14 transition-all duration-300 disabled:cursor-wait ${
                  dragging ? "border-gold bg-gold/5" : "border-border hover:border-gold"
                }`}
              >
                {processing ? <Loader2 className="h-7 w-7 animate-spin text-gold" /> : <Upload className="h-7 w-7 text-gold" strokeWidth={1.5} />}
                <span className="text-sm font-semibold text-foreground">
                  {processing ? "Optimising…" : dragging ? "Drop to add" : "Choose photos"}
                </span>
                <span className="text-xs text-muted-foreground">
                  or drag &amp; drop — JPG, PNG, HEIC up to {MAX_PHOTO_MB}MB each
                </span>
              </button>

              {photos.length > 0 && (
                <>
                  <div className="mt-8 flex items-baseline justify-between">
                    <h2 className="text-sm font-semibold tracking-widest uppercase text-foreground">Your photos</h2>
                    <span className="text-xs text-muted-foreground">{photos.length} added</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-6">
                    {photos.map((p) => (
                      <div key={p.id} className="group relative aspect-square overflow-hidden rounded-xl bg-white shadow-luxury">
                        <img src={p.preview} alt="" className="h-full w-full object-cover" />
                        <button
                          onClick={() => remove(p.id)}
                          aria-label="Remove photo"
                          className="absolute right-1.5 top-1.5 rounded-lg bg-white/90 p-1.5 text-foreground shadow-sm transition-colors hover:bg-destructive hover:text-white"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="mt-10 flex justify-end">
                <button className="btn-luxury disabled:opacity-50 disabled:cursor-not-allowed" disabled={!canLeaveStep0} onClick={() => setStep(1)}>
                  Choose sizes
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 2 — OPTIONS ─── */}
          {step === 1 && (
            <motion.div key="options" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Size each photo</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Every photo is checked against the size you pick, so nothing prints blurry.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Apply to all:</span>
                {sizeLabels.map((label) => (
                  <button key={label} onClick={() => applySizeToAll(label)}
                    className="rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium transition-colors hover:border-gold hover:text-gold">
                    {label}
                  </button>
                ))}
                {lowResCount > 0 && (
                  <button onClick={fixLowRes}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-amber-warm px-3.5 py-1.5 text-xs font-semibold text-white shadow-md">
                    <Wand2 className="h-3.5 w-3.5" strokeWidth={2} />
                    Fix {lowResCount} low-res
                  </button>
                )}
              </div>

              <div className="mt-5 space-y-3">
                {photos.map((p) => {
                  const q = qualityOf(p);
                  const line = (priceOf(p.sizeLabel) + themeModifier) * p.quantity;
                  return (
                    <div key={p.id} className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-3.5 shadow-luxury sm:flex-nowrap">
                      <img src={p.preview} alt="" className="h-16 w-16 flex-shrink-0 rounded-lg object-cover" />

                      <div className="min-w-[8.5rem] flex-1">
                        <label className="sr-only" htmlFor={`size-${p.id}`}>Print size</label>
                        <select
                          id={`size-${p.id}`}
                          value={p.sizeLabel}
                          onChange={(e) => update(p.id, { sizeLabel: e.target.value })}
                          className="w-full rounded-lg border border-border bg-cream px-2.5 py-2 text-sm font-medium focus:border-gold focus:outline-none"
                        >
                          {product.sizes.map((s) => (
                            <option key={s.label} value={s.label}>{s.label} — Rs {s.price}</option>
                          ))}
                        </select>

                        {q ? (
                          <span className={`mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium ${
                            q.warn ? "text-destructive" : "text-emerald-600"
                          }`}>
                            {q.warn ? <AlertTriangle className="h-3 w-3" strokeWidth={2} /> : <Check className="h-3 w-3" strokeWidth={2.5} />}
                            {q.label}
                          </span>
                        ) : (
                          <span className="mt-1.5 block text-[11px] text-muted-foreground">Resolution not checked</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 rounded-lg border border-border px-1">
                        <button onClick={() => update(p.id, { quantity: Math.max(1, p.quantity - 1) })} aria-label="Fewer copies"
                          className="flex h-8 w-8 items-center justify-center transition-colors hover:text-gold">
                          <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{p.quantity}</span>
                        <button onClick={() => update(p.id, { quantity: p.quantity + 1 })} aria-label="More copies"
                          className="flex h-8 w-8 items-center justify-center transition-colors hover:text-gold">
                          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      </div>

                      <span className="w-20 text-right text-sm font-semibold tabular-nums">Rs {line.toLocaleString()}</span>

                      <div className="flex items-center gap-1">
                        <button onClick={() => duplicate(p.id)} aria-label="Duplicate"
                          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-cream hover:text-foreground">
                          <Copy className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                        <button onClick={() => remove(p.id)} aria-label="Remove"
                          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {photos.length === 0 && (
                <p className="mt-6 rounded-2xl bg-white p-6 text-center text-sm text-muted-foreground shadow-luxury">
                  You removed every photo. Go back to add some.
                </p>
              )}

              <div className="mt-10 flex items-center justify-between gap-4">
                <button onClick={() => setStep(0)} className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-muted-foreground transition-colors hover:text-foreground">
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} /> Add more
                </button>
                <button className="btn-luxury disabled:opacity-50 disabled:cursor-not-allowed" disabled={!photos.length} onClick={() => setStep(2)}>
                  Choose finish
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 3 — FINISH & REVIEW ─── */}
          {step === 2 && (
            <motion.div key="finish" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Finish &amp; review</h1>

              <h2 className="mt-7 text-sm font-semibold tracking-widest uppercase text-foreground">Paper finish</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {product.themes.map((theme, i) => (
                  <button key={theme.id} onClick={() => setThemeIndex(i)}
                    className={`flex items-center gap-3 rounded-2xl border-2 bg-white p-4 text-left transition-all duration-300 ${
                      i === themeIndex ? "border-gold shadow-luxury-hover" : "border-transparent shadow-luxury hover:border-gold/40"
                    }`}>
                    {theme.image
                      ? <img src={theme.image} alt="" className="h-12 w-12 flex-shrink-0 rounded-lg object-cover" />
                      : <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-cream text-xl">{theme.preview}</span>}
                    <span className="flex-1">
                      <span className="block text-sm font-semibold">{theme.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {theme.priceModifier ? `+ Rs ${theme.priceModifier} per print` : "No extra charge"}
                      </span>
                    </span>
                    {i === themeIndex && <Check className="h-4 w-4 text-gold" strokeWidth={2.5} />}
                  </button>
                ))}
              </div>

              <h2 className="mt-9 text-sm font-semibold tracking-widest uppercase text-foreground">Your order</h2>
              <div className="mt-3 overflow-hidden rounded-2xl bg-white shadow-luxury">
                {sizeLabels.map((label) => {
                  const group = photos.filter((p) => p.sizeLabel === label);
                  if (!group.length) return null;
                  const prints = group.reduce((sum, p) => sum + p.quantity, 0);
                  const unit = priceOf(label) + themeModifier;
                  return (
                    <div key={label} className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5 last:border-b-0">
                      <span className="text-sm">
                        <span className="font-medium">{label}</span>
                        <span className="ml-2 text-muted-foreground">{prints} print{prints > 1 ? "s" : ""} × Rs {unit.toLocaleString()}</span>
                      </span>
                      <span className="text-sm font-semibold tabular-nums">Rs {(prints * unit).toLocaleString()}</span>
                    </div>
                  );
                })}
                <div className="flex items-center justify-between gap-4 bg-cream px-5 py-4">
                  <span className="text-sm font-semibold tracking-widest uppercase">Total</span>
                  <span className="text-lg font-bold tabular-nums">Rs {total.toLocaleString()}</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Shipping is added at checkout. Cash on Delivery available nationwide.</p>

              {lowResCount > 0 && (
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" strokeWidth={2} />
                  <div className="text-sm">
                    <p className="font-semibold text-destructive">
                      {lowResCount} photo{lowResCount > 1 ? "s" : ""} may print soft at the size chosen.
                    </p>
                    <button onClick={() => setStep(1)} className="mt-1 text-xs font-semibold underline underline-offset-2">
                      Go back and change {lowResCount > 1 ? "them" : "it"}
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-10 flex items-center justify-between gap-4">
                <button onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-muted-foreground transition-colors hover:text-foreground">
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} /> Sizes
                </button>
                <button className="btn-luxury disabled:opacity-50" disabled={!photos.length} onClick={checkout}>
                  Order {printCount} print{printCount > 1 ? "s" : ""} — Rs {total.toLocaleString()}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Create;
