import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useOrders, type DerivedCustomer } from "@/contexts/OrderContext";

const CustomersPage = () => {
  const { customers } = useOrders();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<DerivedCustomer | null>(null);

  const filtered = customers.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold">Customers</h1>
      <p className="text-muted-foreground">Customer accounts derived from order history.</p>

      <div className="mt-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-10" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Total Spent</th>
              <th className="px-4 py-3 font-medium">First Order</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No customers found.</td></tr>
            ) : filtered.map(c => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer" onClick={() => setSelected(c)}>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3">{c.email || "—"}</td>
                <td className="px-4 py-3">{c.phone}</td>
                <td className="px-4 py-3">{c.city}</td>
                <td className="px-4 py-3">{c.ordersCount}</td>
                <td className="px-4 py-3 font-medium">Rs. {c.totalSpent.toLocaleString()}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.joinedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader><DialogTitle>{selected.name}</DialogTitle></DialogHeader>
              <div className="grid gap-3 mt-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">Email:</span> {selected.email || "—"}</div>
                  <div><span className="text-muted-foreground">Phone:</span> {selected.phone}</div>
                  <div><span className="text-muted-foreground">City:</span> {selected.city}</div>
                  <div><span className="text-muted-foreground">First Order:</span> {selected.joinedDate}</div>
                  <div><span className="text-muted-foreground">Orders:</span> {selected.ordersCount}</div>
                  <div><span className="text-muted-foreground">Total Spent:</span> Rs. {selected.totalSpent.toLocaleString()}</div>
                </div>
                {selected.orders.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm font-medium mb-2">Order History</p>
                    {selected.orders.map(o => (
                      <div key={o.id} className="flex items-center justify-between text-sm py-1">
                        <span>{o.id} — {o.product}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{o.status}</Badge>
                          <span className="font-medium">Rs. {o.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default CustomersPage;
