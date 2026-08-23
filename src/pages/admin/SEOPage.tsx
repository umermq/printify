import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Pencil, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Product, ProductSEO } from "@/data/products";

const isOptimized = (p: Product) =>
  !!(p.seo?.metaTitle && p.seo?.metaDescription);

// The seo-generate edge function needs a configured AI provider key that
// isn't set up on this project yet. Manual editing still works either way.
const AI_GENERATION_ENABLED = false;

const SEOPage = () => {
  const { products, updateProduct } = useProducts();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "missing">("all");
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductSEO>({});
  const [regenLoading, setRegenLoading] = useState<string | null>(null);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0 });

  const stats = useMemo(() => {
    const total = products.length;
    const optimized = products.filter(isOptimized).length;
    return { total, optimized, missing: total - optimized, coverage: total ? Math.round((optimized / total) * 100) : 0 };
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filter === "missing" && isOptimized(p)) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [products, filter, search]);

  const generateFor = async (p: Product): Promise<ProductSEO | null> => {
    const { data, error } = await supabase.functions.invoke("seo-generate", {
      body: {
        product: {
          name: p.name,
          category: p.category,
          description: p.description,
          basePrice: p.basePrice,
          geoTarget: p.seo?.geoTarget || "Pakistan",
          focusKeyword: p.seo?.focusKeyword,
        },
      },
    });
    if (error) {
      toast({ title: "AI error", description: error.message, variant: "destructive" });
      return null;
    }
    return data?.seo ?? null;
  };

  const handleRegenerate = async (p: Product) => {
    setRegenLoading(p.id);
    const seo = await generateFor(p);
    if (seo) {
      try {
        await updateProduct(p.id, { seo });
        toast({ title: "Optimized", description: p.name });
      } catch (err) {
        toast({ title: "Save failed", description: (err as Error).message, variant: "destructive" });
      }
    }
    setRegenLoading(null);
  };

  const handleOptimizeAllMissing = async () => {
    const missing = products.filter((p) => !isOptimized(p));
    if (missing.length === 0) {
      toast({ title: "All optimized", description: "No missing meta to generate." });
      return;
    }
    setBulkRunning(true);
    setBulkProgress({ done: 0, total: missing.length });
    for (let i = 0; i < missing.length; i++) {
      const p = missing[i];
      const seo = await generateFor(p);
      if (seo) {
        try {
          await updateProduct(p.id, { seo });
        } catch (err) {
          toast({ title: "Save failed", description: `${p.name}: ${(err as Error).message}`, variant: "destructive" });
        }
      }
      setBulkProgress({ done: i + 1, total: missing.length });
      await new Promise((r) => setTimeout(r, 600));
    }
    setBulkRunning(false);
    toast({ title: "Bulk optimization complete" });
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      metaTitle: p.seo?.metaTitle || "",
      metaDescription: p.seo?.metaDescription || "",
      focusKeyword: p.seo?.focusKeyword || "",
      geoTarget: p.seo?.geoTarget || "Pakistan",
      aeoSnippet: p.seo?.aeoSnippet || "",
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await updateProduct(editing.id, { seo: { ...form, updatedAt: new Date().toISOString() } });
      toast({ title: "SEO saved", description: editing.name });
      setEditing(null);
    } catch (err) {
      toast({ title: "Save failed", description: (err as Error).message, variant: "destructive" });
    }
  };

  const regenInDialog = async () => {
    if (!editing) return;
    setRegenLoading(editing.id);
    const seo = await generateFor(editing);
    setRegenLoading(null);
    if (seo) setForm(seo);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SEO / AEO / GEO</h1>
          <p className="text-muted-foreground">AI-powered meta optimization for search engines and AI answer engines.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total products", value: stats.total },
          { label: "Optimized", value: stats.optimized },
          { label: "Missing", value: stats.missing },
          { label: "Coverage", value: `${stats.coverage}%` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Bulk action */}
      <div className="mt-6">
        <Button
          onClick={handleOptimizeAllMissing}
          disabled={!AI_GENERATION_ENABLED || bulkRunning || stats.missing === 0}
          size="lg"
          className="gap-2"
        >
          {bulkRunning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Optimizing {bulkProgress.done}/{bulkProgress.total}…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Optimize all missing ({stats.missing})
            </>
          )}
        </Button>
        {!AI_GENERATION_ENABLED && (
          <p className="mt-2 text-xs text-muted-foreground">
            AI generation isn't set up on this project yet — you can still edit meta fields manually below.
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="mt-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>All</Button>
        <Button variant={filter === "missing" ? "default" : "outline"} size="sm" onClick={() => setFilter("missing")}>Missing only</Button>
      </div>

      {/* Table */}
      <div className="mt-6 rounded-xl border border-border bg-card shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Meta title</th>
              <th className="px-4 py-3 font-medium">Meta description</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const optimized = isOptimized(p);
              return (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium max-w-[200px] truncate">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[260px] truncate">{p.seo?.metaTitle || <span className="italic opacity-60">— missing —</span>}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[320px] truncate">{p.seo?.metaDescription || <span className="italic opacity-60">— missing —</span>}</td>
                  <td className="px-4 py-3">
                    {optimized ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Optimized</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Missing</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(p)} className="gap-1">
                        <Pencil className="h-3 w-3" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleRegenerate(p)}
                        disabled={!AI_GENERATION_ENABLED || regenLoading === p.id || bulkRunning}
                        title={!AI_GENERATION_ENABLED ? "AI generation isn't set up on this project yet" : undefined}
                        className="gap-1"
                      >
                        {regenLoading === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                        Regenerate
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">No products.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit SEO — {editing?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-2">
            <div>
              <Label>Meta title <span className="text-xs text-muted-foreground">({(form.metaTitle || "").length}/60)</span></Label>
              <Input value={form.metaTitle || ""} maxLength={80} onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))} />
            </div>
            <div>
              <Label>Meta description <span className="text-xs text-muted-foreground">({(form.metaDescription || "").length}/160)</span></Label>
              <Textarea rows={3} value={form.metaDescription || ""} maxLength={200} onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Focus keyword (SEO)</Label>
                <Input value={form.focusKeyword || ""} onChange={(e) => setForm((f) => ({ ...f, focusKeyword: e.target.value }))} />
              </div>
              <div>
                <Label>Geo target (GEO)</Label>
                <Input placeholder="e.g. Lahore, Pakistan" value={form.geoTarget || ""} onChange={(e) => setForm((f) => ({ ...f, geoTarget: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>AEO snippet <span className="text-xs text-muted-foreground">(direct answer for ChatGPT / Perplexity / Google AI Overview)</span></Label>
              <Textarea rows={3} value={form.aeoSnippet || ""} onChange={(e) => setForm((f) => ({ ...f, aeoSnippet: e.target.value }))} />
            </div>
            <Button
              variant="outline"
              onClick={regenInDialog}
              disabled={!AI_GENERATION_ENABLED || regenLoading === editing?.id}
              title={!AI_GENERATION_ENABLED ? "AI generation isn't set up on this project yet" : undefined}
              className="gap-2 w-fit"
            >
              {regenLoading === editing?.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Regenerate with AI
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default SEOPage;
