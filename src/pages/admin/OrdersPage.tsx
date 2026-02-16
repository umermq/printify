import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string; customer: string; email: string; phone: string; city: string;
  product: string; size: string; theme: string; status: string;
  amount: number; date: string; paymentMethod: string; trackingNumber: string;
  assignedShop: string; images: string[];
}

const statuses = ["All", "Pending Confirmation", "Confirmed", "Assigned to Print Shop", "In Design", "Awaiting Customer Approval", "Approved", "Printed", "Shipped", "Delivered", "Cancelled"];
const printShops = ["Lahore Print House", "Karachi Graphics", "Islamabad Prints", "Peshawar Studio"];

const initialOrders: Order[] = [
  { id: "ORD-001", customer: "Ahmed Khan", email: "ahmed@email.com", phone: "0300-1234567", city: "Lahore", product: "Classic Photo Book", size: "10x10", theme: "Classic White", status: "Pending Confirmation", amount: 3500, date: "2026-02-16", paymentMethod: "COD", trackingNumber: "", assignedShop: "", images: ["/placeholder.svg"] },
  { id: "ORD-002", customer: "Sara Ali", email: "sara@email.com", phone: "0321-9876543", city: "Karachi", product: "Photo Mug", size: "11oz", theme: "Full Wrap", status: "Confirmed", amount: 800, date: "2026-02-16", paymentMethod: "JazzCash", trackingNumber: "", assignedShop: "", images: ["/placeholder.svg"] },
  { id: "ORD-003", customer: "Usman Tariq", email: "usman@email.com", phone: "0333-5551234", city: "Islamabad", product: "Custom T-Shirt", size: "L", theme: "Front Print", status: "In Design", amount: 1500, date: "2026-02-15", paymentMethod: "COD", trackingNumber: "", assignedShop: "Islamabad Prints", images: ["/placeholder.svg"] },
  { id: "ORD-004", customer: "Fatima Noor", email: "fatima@email.com", phone: "0345-7778899", city: "Lahore", product: "Photo Cushion", size: '16"x16"', theme: "Single Photo", status: "Shipped", amount: 2200, date: "2026-02-15", paymentMethod: "Easypaisa", trackingNumber: "TRK-99887766", assignedShop: "Lahore Print House", images: ["/placeholder.svg"] },
  { id: "ORD-005", customer: "Ali Raza", email: "ali@email.com", phone: "0312-4445566", city: "Faisalabad", product: "Wedding Album", size: "12x12", theme: "Elegant Gold", status: "Delivered", amount: 8000, date: "2026-02-13", paymentMethod: "COD", trackingNumber: "TRK-11223344", assignedShop: "Lahore Print House", images: ["/placeholder.svg"] },
  { id: "ORD-006", customer: "Hina Malik", email: "hina@email.com", phone: "0300-6667788", city: "Rawalpindi", product: "Magic Mug", size: "11oz", theme: "Photo Reveal", status: "Awaiting Customer Approval", amount: 1200, date: "2026-02-14", paymentMethod: "COD", trackingNumber: "", assignedShop: "Islamabad Prints", images: ["/placeholder.svg"] },
  { id: "ORD-007", customer: "Bilal Ahmed", email: "bilal@email.com", phone: "0321-1112233", city: "Multan", product: "Photo Keychain", size: "Heart Shape", theme: "Single Photo", status: "Approved", amount: 600, date: "2026-02-14", paymentMethod: "JazzCash", trackingNumber: "", assignedShop: "Lahore Print House", images: ["/placeholder.svg"] },
  { id: "ORD-008", customer: "Ayesha Siddiqui", email: "ayesha@email.com", phone: "0333-8889900", city: "Karachi", product: "Classic Photo Book", size: "8x8", theme: "Rustic Wood", status: "Printed", amount: 2500, date: "2026-02-13", paymentMethod: "COD", trackingNumber: "", assignedShop: "Karachi Graphics", images: ["/placeholder.svg"] },
  { id: "ORD-009", customer: "Zain Abbas", email: "zain@email.com", phone: "0345-2223344", city: "Lahore", product: "Custom T-Shirt", size: "XL", theme: "Front & Back", status: "Cancelled", amount: 1600, date: "2026-02-12", paymentMethod: "COD", trackingNumber: "", assignedShop: "", images: ["/placeholder.svg"] },
  { id: "ORD-010", customer: "Maryam Bibi", email: "maryam@email.com", phone: "0300-5556677", city: "Peshawar", product: "Photo Cushion", size: '12"x12"', theme: "4 Photo Collage", status: "Assigned to Print Shop", amount: 1800, date: "2026-02-14", paymentMethod: "Easypaisa", trackingNumber: "", assignedShop: "Peshawar Studio", images: ["/placeholder.svg"] },
  { id: "ORD-011", customer: "Hamza Sheikh", email: "hamza@email.com", phone: "0312-9990011", city: "Sialkot", product: "Photo Mug", size: "15oz Large", theme: "Heart Frame", status: "Pending Confirmation", amount: 1000, date: "2026-02-16", paymentMethod: "COD", trackingNumber: "", assignedShop: "", images: ["/placeholder.svg"] },
  { id: "ORD-012", customer: "Nadia Jamil", email: "nadia@email.com", phone: "0321-7778800", city: "Lahore", product: "Wedding Album", size: "10x10", theme: "Romantic Blush", status: "Confirmed", amount: 5000, date: "2026-02-15", paymentMethod: "JazzCash", trackingNumber: "", assignedShop: "", images: ["/placeholder.svg"] },
  { id: "ORD-013", customer: "Imran Qureshi", email: "imran@email.com", phone: "0333-1114455", city: "Quetta", product: "Classic Photo Book", size: "12x12", theme: "Modern Dark", status: "In Design", amount: 5000, date: "2026-02-14", paymentMethod: "COD", trackingNumber: "", assignedShop: "Karachi Graphics", images: ["/placeholder.svg"] },
  { id: "ORD-014", customer: "Sana Rehman", email: "sana@email.com", phone: "0345-6660011", city: "Hyderabad", product: "Photo Keychain", size: "Rectangle", theme: "Single Photo", status: "Delivered", amount: 500, date: "2026-02-11", paymentMethod: "COD", trackingNumber: "TRK-55667788", assignedShop: "Karachi Graphics", images: ["/placeholder.svg"] },
  { id: "ORD-015", customer: "Farhan Akhtar", email: "farhan@email.com", phone: "0300-3334455", city: "Islamabad", product: "Magic Mug", size: "11oz", theme: "Message Reveal", status: "Pending Confirmation", amount: 1200, date: "2026-02-16", paymentMethod: "Easypaisa", trackingNumber: "", assignedShop: "", images: ["/placeholder.svg"] },
];

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
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const { toast } = useToast();

  const filtered = orders.filter(o => {
    const matchTab = activeTab === "All" || o.status === activeTab;
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
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

      {/* Order Detail Dialog */}
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
                    <Select value={selected.status} onValueChange={v => updateOrder(selected.id, { status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {statuses.filter(s => s !== "All").map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Assign to Print Shop</label>
                    <Select value={selected.assignedShop || ""} onValueChange={v => updateOrder(selected.id, { assignedShop: v })}>
                      <SelectTrigger><SelectValue placeholder="Select print shop" /></SelectTrigger>
                      <SelectContent>
                        {printShops.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tracking Number</label>
                    <Input value={selected.trackingNumber} onChange={e => updateOrder(selected.id, { trackingNumber: e.target.value })} placeholder="Enter tracking number" />
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
                  <Button variant="destructive" onClick={() => { updateOrder(selected.id, { status: "Cancelled" }); setSelected(null); }}>
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
