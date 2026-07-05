import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { type Product } from "@/data/products";
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/hooks/use-toast";

const emptyProduct: Omit<Product, "id"> = {
  name: "", category: "", categorySlug: "", description: "", basePrice: 0,
  sizes: [{ label: "", price: 0 }], themes: [{ id: "", name: "", preview: "", image: "" }],
  deliveryDays: "3-5 days", image: "", featured: false,
};

const ProductsPage = () => {
  const { products: productList, categories, addProduct, updateProduct, deleteProduct: removeProduct } = useProducts();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(emptyProduct);
  const { toast } = useToast();

  const filtered = productList.filter(p => {
    const matchCat = catFilter === "all" || p.categorySlug === catFilter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openAdd = () => { setEditingProduct(null); setForm(emptyProduct); setDialogOpen(true); };
  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({ name: p.name, category: p.category, categorySlug: p.categorySlug, description: p.description, basePrice: p.basePrice, sizes: [...p.sizes], themes: [...p.themes], deliveryDays: p.deliveryDays, image: p.image, featured: p.featured });
    setDialogOpen(true);
  };

  const save = () => {
    if (!form.name || !form.categorySlug) return;
    const cat = categories.find(c => c.slug === form.categorySlug);
    const updated = { ...form, category: cat?.name || form.category };
    if (editingProduct) {
      updateProduct(editingProduct.id, updated);
      toast({ title: "Product updated", description: `${form.name} saved.` });
    } else {
      const newP: Product = { ...updated, id: `prod-${Date.now()}` };
      addProduct(newP);
      toast({ title: "Product added", description: `${form.name} created.` });
    }
    setDialogOpen(false);
  };

  const deleteProduct = (id: string) => {
    removeProduct(id);
    toast({ title: "Product deleted" });
  };

  const updateSize = (idx: number, key: "label" | "price", val: string | number) => {
    const sizes = [...form.sizes];
    sizes[idx] = { ...sizes[idx], [key]: val };
    setForm(f => ({ ...f, sizes }));
  };

  const updateTheme = (idx: number, key: "id" | "name" | "preview" | "priceModifier", val: string | number) => {
    const themes = [...form.themes];
    themes[idx] = { ...themes[idx], [key]: val };
    setForm(f => ({ ...f, themes }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog.</p>
        </div>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Add Product</Button>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Base Price</th>
              <th className="px-4 py-3 font-medium">Sizes</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3"><Badge variant="outline">{p.category}</Badge></td>
                <td className="px-4 py-3">Rs. {p.basePrice.toLocaleString()}</td>
                <td className="px-4 py-3">{p.sizes.length}</td>
                <td className="px-4 py-3">{p.featured ? <Badge className="bg-primary/10 text-primary">Yes</Badge> : <span className="text-muted-foreground">No</span>}</td>
                <td className="px-4 py-3 flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Delete {p.name}?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteProduct(p.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={form.categorySlug} onValueChange={v => setForm(f => ({ ...f, categorySlug: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Base Price (Rs.)</Label><Input type="number" value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: Number(e.target.value) }))} /></div>
              <div><Label>Delivery Days</Label><Input value={form.deliveryDays} onChange={e => setForm(f => ({ ...f, deliveryDays: e.target.value }))} /></div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.featured} onCheckedChange={v => setForm(f => ({ ...f, featured: v }))} />
              <Label>Featured Product</Label>
            </div>

            {/* Sizes */}
            <div>
              <div className="flex items-center justify-between"><Label>Sizes</Label><Button variant="outline" size="sm" onClick={() => setForm(f => ({ ...f, sizes: [...f.sizes, { label: "", price: 0 }] }))}>+ Add Size</Button></div>
              {form.sizes.map((s, i) => (
                <div key={i} className="flex gap-2 mt-2 items-center">
                  <Input placeholder="Label" value={s.label} onChange={e => updateSize(i, "label", e.target.value)} className="flex-1" />
                  <Input type="number" placeholder="Price" value={s.price} onChange={e => updateSize(i, "price", Number(e.target.value))} className="w-28" />
                  {form.sizes.length > 1 && <Button variant="ghost" size="icon" onClick={() => setForm(f => ({ ...f, sizes: f.sizes.filter((_, idx) => idx !== i) }))}><Trash2 className="h-3 w-3" /></Button>}
                </div>
              ))}
            </div>

            {/* Themes */}
            <div>
              <div className="flex items-center justify-between"><Label>Themes</Label><Button variant="outline" size="sm" onClick={() => setForm(f => ({ ...f, themes: [...f.themes, { id: "", name: "", preview: "", image: "" }] }))}>+ Add Theme</Button></div>
              {form.themes.map((t, i) => (
                <div key={i} className="flex gap-2 mt-2 items-center">
                  <Input placeholder="Name" value={t.name} onChange={e => updateTheme(i, "name", e.target.value)} className="flex-1" />
                  <Input placeholder="Preview emoji" value={t.preview} onChange={e => updateTheme(i, "preview", e.target.value)} className="w-24" />
                  {form.themes.length > 1 && <Button variant="ghost" size="icon" onClick={() => setForm(f => ({ ...f, themes: f.themes.filter((_, idx) => idx !== i) }))}><Trash2 className="h-3 w-3" /></Button>}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editingProduct ? "Save Changes" : "Add Product"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProductsPage;
