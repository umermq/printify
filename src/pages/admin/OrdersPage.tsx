import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, X, Printer, ZoomIn, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useOrders, type Order } from "@/contexts/OrderContext";

const statuses = ["All", "Pending Confirmation", "Confirmed", "Assigned to Print Shop", "In Design", "Awaiting Customer Approval", "Approved", "Printed", "Shipped", "Delivered", "Cancelled"];
const printShops = ["Lahore Print House", "Karachi Graphics", "Islamabad Prints", "Peshawar Studio"];

const getRenderableImages = (images: string[]) => images.filter((img) => img && img !== "/placeholder.svg");

const isLegacyBlobImage = (img: string) => img.startsWith("blob:");

const statusColor = (s: string) => {
  if (s.includes("Pending") || s === "Awaiting Customer Approval") return "bg-warning/10 text-warning border-warning/20";
  if (s === "Confirmed" || s === "Approved") return "bg-primary/10 text-primary border-primary/20";
  if (s.includes("Design") || s === "Assigned to Print Shop") return "bg-secondary/10 text-secondary border-secondary/20";
  if (s === "Printed" || s === "Shipped") return "bg-accent/10 text-accent-foreground border-accent/20";
  if (s === "Delivered") return "bg-success/10 text-success border-success/20";
  if (s === "Cancelled") return "bg-destructive/10 text-destructive border-destructive/20";
  return "";
};

const OrdersPage = () => {
  const { orders, updateOrder } = useOrders();
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const { toast } = useToast();

  const filtered = orders.filter(o => {
    const matchTab = activeTab === "All" || o.status === activeTab;
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const selectedImages = selected ? getRenderableImages(selected.images) : [];
  const hasLegacyBlobImages = selectedImages.some(isLegacyBlobImage);

  const handleUpdateOrder = (id: string, updates: Partial<Order>) => {
    updateOrder(id, updates);
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, ...updates } : null);
    toast({ title: "Order updated", description: `${id} has been updated.` });
  };

  const generateOrderHTML = (order: Order) => {
    const renderableImages = getRenderableImages(order.images);
    const imagesHtml = renderableImages
      .map(img => `<img src="${img}" style="max-width:300px;max-height:300px;object-fit:contain;border:1px solid #ddd;border-radius:8px;" />`)
      .join("");
    const blobWarning = renderableImages.some(isLegacyBlobImage)
      ? `<p style="margin-top:16px;color:#b45309">Some artwork uses temporary browser image links and may not display correctly. New uploads are stored more reliably.</p>`
      : "";
    return `<html><head><title>Order ${order.id}</title>
      <style>body{font-family:system-ui,sans-serif;padding:40px;color:#222}h1{font-size:28px;margin-bottom:4px}h2{font-size:18px;margin-top:24px}.batch{font-size:32px;font-weight:bold;color:#111;border:3px solid #111;display:inline-block;padding:8px 24px;border-radius:8px;margin-bottom:16px;letter-spacing:1px}table{border-collapse:collapse;width:100%;margin:20px 0}td,th{padding:8px 12px;border:1px solid #ddd;text-align:left}.images{display:flex;gap:12px;flex-wrap:wrap;margin-top:16px}</style>
      </head><body>
      <div class="batch">BATCH # ${order.id}</div>
      <h1>Order Sheet</h1>
      <table>
        <tr><th>Customer</th><td>${order.customer}</td><th>Phone</th><td>${order.phone}</td></tr>
        <tr><th>Email</th><td>${order.email}</td><th>City</th><td>${order.city}</td></tr>
        <tr><th>Product</th><td>${order.product}</td><th>Size / Theme</th><td>${order.size} / ${order.theme}</td></tr>
        <tr><th>Amount</th><td>Rs. ${order.amount.toLocaleString()}</td><th>Payment</th><td>${order.paymentMethod}</td></tr>
        <tr><th>Status</th><td>${order.status}</td><th>Tracking</th><td>${order.trackingNumber || "—"}</td></tr>
        <tr><th>Print Shop</th><td>${order.assignedShop || "—"}</td><th>Date</th><td>${order.date}</td></tr>
      </table>
      ${imagesHtml ? `<h2>Customer Uploaded Images</h2><div class="images">${imagesHtml}</div>` : ""}
      ${blobWarning}
      </body></html>`;
  };

  const handlePrintOrder = () => {
    if (!selected) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(generateOrderHTML(selected) + `<script>setTimeout(()=>window.print(),500)<\/script>`);
    printWindow.document.close();
  };

  const handleDownloadOrder = () => {
    if (!selected) return;
    const html = generateOrderHTML(selected);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selected.id}-order-sheet.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded", description: `Order sheet for ${selected.id} has been downloaded.` });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold">Order Management</h1>
      <p className="text-muted-foreground">Manage and track all customer orders.</p>

      <div className="mt-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search by order ID or customer..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {statuses.map(s => (
          <Button key={s} variant={activeTab === s ? "default" : "outline"} size="sm" onClick={() => setActiveTab(s)} className="text-xs">
            {s} {s !== "All" && <span className="ml-1 opacity-60">({orders.filter(o => o.status === s).length})</span>}
          </Button>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Batch #</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer" onClick={() => setSelected(order)}>
                <td className="px-4 py-3 font-medium">{order.id}</td>
                <td className="px-4 py-3">{order.customer}</td>
                <td className="px-4 py-3">{order.product}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor(order.status)}`}>{order.status}</span>
                </td>
                <td className="px-4 py-3 font-medium">Rs. {order.amount.toLocaleString()}</td>
                <td className="px-4 py-3"><Badge variant="outline">{order.paymentMethod}</Badge></td>
                <td className="px-4 py-3 text-muted-foreground">{order.date}</td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); setSelected(order); }}><Eye className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <div>
                    <span>Batch # {selected.id}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownloadOrder} className="gap-1">
                      <Download className="h-4 w-4" /> Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={handlePrintOrder} className="gap-1">
                      <Printer className="h-4 w-4" /> Print
                    </Button>
                  </div>
                </DialogTitle>
              </DialogHeader>
              </DialogHeader>
              <div className="grid gap-4 mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">{selected.customer}</p>
                    <p className="text-sm text-muted-foreground">{selected.email}</p>
                    <p className="text-sm text-muted-foreground">{selected.phone}</p>
                    <p className="text-sm text-muted-foreground">{selected.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Product</p>
                    <p className="font-medium">{selected.product}</p>
                    <p className="text-sm text-muted-foreground">Size: {selected.size} | Theme: {selected.theme}</p>
                    <p className="text-lg font-bold mt-1">Rs. {selected.amount.toLocaleString()}</p>
                    <Badge variant="outline" className="mt-1">{selected.paymentMethod}</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Update Status</label>
                    <Select value={selected.status} onValueChange={v => handleUpdateOrder(selected.id, { status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {statuses.filter(s => s !== "All").map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Assign to Print Shop</label>
                    <Select value={selected.assignedShop || ""} onValueChange={v => handleUpdateOrder(selected.id, { assignedShop: v })}>
                      <SelectTrigger><SelectValue placeholder="Select print shop" /></SelectTrigger>
                      <SelectContent>
                        {printShops.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tracking Number</label>
                    <Input value={selected.trackingNumber} onChange={e => handleUpdateOrder(selected.id, { trackingNumber: e.target.value })} placeholder="Enter tracking number" />
                  </div>
                </div>

                {/* Customer Uploaded Images */}
                <div>
                  <p className="text-sm font-medium mb-2">Customer Uploaded Images</p>
                  {hasLegacyBlobImages && (
                    <p className="mb-3 text-sm text-warning">
                      These are older temporary uploads. If they break after refresh, the customer artwork needs to be uploaded again.
                    </p>
                  )}
                  <div className="flex gap-3 flex-wrap">
                    {selectedImages.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No images uploaded by customer.</p>
                    ) : (
                      selectedImages.map((img, i) => (
                        <div
                          key={i}
                          className="relative h-28 w-28 rounded-lg border border-border bg-muted overflow-hidden cursor-pointer group"
                          onClick={() => setLightboxImg(img)}
                        >
                          <img src={img} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ZoomIn className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {selected.status !== "Cancelled" && (
                  <Button variant="destructive" onClick={() => { handleUpdateOrder(selected.id, { status: "Cancelled" }); setSelected(null); }}>
                    <X className="h-4 w-4 mr-1" /> Cancel Order
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      <Dialog open={!!lightboxImg} onOpenChange={() => setLightboxImg(null)}>
        <DialogContent className="max-w-3xl p-2">
          {lightboxImg && (
            <img src={lightboxImg} alt="Full size" className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default OrdersPage;
