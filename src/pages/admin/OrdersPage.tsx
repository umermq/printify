import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useOrders, type Order } from "@/contexts/OrderContext";

const statuses = ["All", "Pending Confirmation", "Confirmed", "Assigned to Print Shop", "In Design", "Awaiting Customer Approval", "Approved", "Printed", "Shipped", "Delivered", "Cancelled"];
const printShops = ["Lahore Print House", "Karachi Graphics", "Islamabad Prints", "Peshawar Studio"];

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
  const { toast } = useToast();

  const filtered = orders.filter(o => {
    const matchTab = activeTab === "All" || o.status === activeTab;
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleUpdateOrder = (id: string, updates: Partial<Order>) => {
    updateOrder(id, updates);
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, ...updates } : null);
    toast({ title: "Order updated", description: `${id} has been updated.` });
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
              <th className="px-4 py-3 font-medium">Order ID</th>
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

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Order {selected.id}</DialogTitle>
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

                <div>
                  <p className="text-sm font-medium mb-2">Uploaded Images</p>
                  <div className="flex gap-2">
                    {selected.images.map((img, i) => (
                      <div key={i} className="h-20 w-20 rounded-lg border border-border bg-muted flex items-center justify-center">
                        <img src={img} alt="upload" className="h-full w-full object-cover rounded-lg" />
                      </div>
                    ))}
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
    </motion.div>
  );
};

export default OrdersPage;
