import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string; name: string; email: string; phone: string; city: string;
  ordersCount: number; totalSpent: number; active: boolean; joinedDate: string;
  orders: { id: string; product: string; amount: number; status: string; date: string }[];
}

const initialCustomers: Customer[] = [
  { id: "c1", name: "Ahmed Khan", email: "ahmed@email.com", phone: "0300-1234567", city: "Lahore", ordersCount: 5, totalSpent: 15500, active: true, joinedDate: "2025-08-12", orders: [{ id: "ORD-001", product: "Photo Book", amount: 3500, status: "Pending", date: "2026-02-16" }, { id: "ORD-020", product: "Mug", amount: 800, status: "Delivered", date: "2025-12-01" }] },
  { id: "c2", name: "Sara Ali", email: "sara@email.com", phone: "0321-9876543", city: "Karachi", ordersCount: 3, totalSpent: 4600, active: true, joinedDate: "2025-10-05", orders: [{ id: "ORD-002", product: "Mug", amount: 800, status: "Confirmed", date: "2026-02-16" }] },
  { id: "c3", name: "Usman Tariq", email: "usman@email.com", phone: "0333-5551234", city: "Islamabad", ordersCount: 2, totalSpent: 3000, active: true, joinedDate: "2025-11-20", orders: [] },
  { id: "c4", name: "Fatima Noor", email: "fatima@email.com", phone: "0345-7778899", city: "Lahore", ordersCount: 7, totalSpent: 22400, active: true, joinedDate: "2025-06-15", orders: [] },
  { id: "c5", name: "Ali Raza", email: "ali@email.com", phone: "0312-4445566", city: "Faisalabad", ordersCount: 1, totalSpent: 8000, active: false, joinedDate: "2025-12-01", orders: [] },
  { id: "c6", name: "Hina Malik", email: "hina@email.com", phone: "0300-6667788", city: "Rawalpindi", ordersCount: 4, totalSpent: 9800, active: true, joinedDate: "2025-09-10", orders: [] },
  { id: "c7", name: "Bilal Ahmed", email: "bilal@email.com", phone: "0321-1112233", city: "Multan", ordersCount: 2, totalSpent: 2100, active: true, joinedDate: "2025-11-05", orders: [] },
  { id: "c8", name: "Ayesha Siddiqui", email: "ayesha@email.com", phone: "0333-8889900", city: "Karachi", ordersCount: 6, totalSpent: 18500, active: true, joinedDate: "2025-07-22", orders: [] },
  { id: "c9", name: "Zain Abbas", email: "zain@email.com", phone: "0345-2223344", city: "Lahore", ordersCount: 1, totalSpent: 1600, active: false, joinedDate: "2026-01-10", orders: [] },
  { id: "c10", name: "Maryam Bibi", email: "maryam@email.com", phone: "0300-5556677", city: "Peshawar", ordersCount: 3, totalSpent: 5400, active: true, joinedDate: "2025-10-18", orders: [] },
];

const CustomersPage = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const { toast } = useToast();

  const filtered = customers.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleActive = (id: string) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, active: !prev.active } : null);
    toast({ title: "Customer status updated" });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold">Customers</h1>
      <p className="text-muted-foreground">View and manage customer accounts.</p>

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
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer" onClick={() => setSelected(c)}>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3">{c.email}</td>
                <td className="px-4 py-3">{c.phone}</td>
                <td className="px-4 py-3">{c.city}</td>
                <td className="px-4 py-3">{c.ordersCount}</td>
                <td className="px-4 py-3 font-medium">Rs. {c.totalSpent.toLocaleString()}</td>
                <td className="px-4 py-3"><Badge variant={c.active ? "default" : "secondary"}>{c.active ? "Active" : "Inactive"}</Badge></td>
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
                  <div><span className="text-muted-foreground">Email:</span> {selected.email}</div>
                  <div><span className="text-muted-foreground">Phone:</span> {selected.phone}</div>
                  <div><span className="text-muted-foreground">City:</span> {selected.city}</div>
                  <div><span className="text-muted-foreground">Joined:</span> {selected.joinedDate}</div>
                  <div><span className="text-muted-foreground">Orders:</span> {selected.ordersCount}</div>
                  <div><span className="text-muted-foreground">Total Spent:</span> Rs. {selected.totalSpent.toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Switch checked={selected.active} onCheckedChange={() => toggleActive(selected.id)} />
                  <span className="text-sm">{selected.active ? "Active" : "Inactive"}</span>
                </div>
                {selected.orders.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm font-medium mb-2">Recent Orders</p>
                    {selected.orders.map(o => (
                      <div key={o.id} className="flex items-center justify-between text-sm py-1">
                        <span>{o.id} — {o.product}</span>
                        <span className="font-medium">Rs. {o.amount.toLocaleString()}</span>
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
