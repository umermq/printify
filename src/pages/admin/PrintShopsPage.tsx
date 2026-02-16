import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface PrintShop {
  id: string; name: string; email: string; phone: string; location: string;
  assignedJobs: number; completedJobs: number; rejectedJobs: number; active: boolean;
}

const initialShops: PrintShop[] = [
  { id: "ps1", name: "Lahore Print House", email: "lahore@printpk.com", phone: "042-35551234", location: "Lahore", assignedJobs: 45, completedJobs: 38, rejectedJobs: 3, active: true },
  { id: "ps2", name: "Karachi Graphics", email: "karachi@printpk.com", phone: "021-34567890", location: "Karachi", assignedJobs: 32, completedJobs: 28, rejectedJobs: 2, active: true },
  { id: "ps3", name: "Islamabad Prints", email: "isb@printpk.com", phone: "051-2345678", location: "Islamabad", assignedJobs: 20, completedJobs: 17, rejectedJobs: 1, active: true },
  { id: "ps4", name: "Peshawar Studio", email: "pew@printpk.com", phone: "091-1234567", location: "Peshawar", assignedJobs: 12, completedJobs: 9, rejectedJobs: 2, active: false },
];

const PrintShopsPage = () => {
  const [shops, setShops] = useState(initialShops);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PrintShop | null>(null);
  const [viewShop, setViewShop] = useState<PrintShop | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "", password: "" });
  const { toast } = useToast();

  const openAdd = () => { setEditing(null); setForm({ name: "", email: "", phone: "", location: "", password: "" }); setDialogOpen(true); };
  const openEdit = (s: PrintShop) => { setEditing(s); setForm({ name: s.name, email: s.email, phone: s.phone, location: s.location, password: "" }); setDialogOpen(true); };

  const save = () => {
    if (!form.name || !form.email) return;
    if (editing) {
      setShops(prev => prev.map(s => s.id === editing.id ? { ...s, name: form.name, email: form.email, phone: form.phone, location: form.location } : s));
      toast({ title: "Print shop updated" });
    } else {
      setShops(prev => [...prev, { id: `ps-${Date.now()}`, ...form, assignedJobs: 0, completedJobs: 0, rejectedJobs: 0, active: true }]);
      toast({ title: "Print shop added" });
    }
    setDialogOpen(false);
  };

  const deleteShop = (id: string) => { setShops(prev => prev.filter(s => s.id !== id)); toast({ title: "Print shop deleted" }); };

  const rejectionRate = (s: PrintShop) => s.completedJobs + s.rejectedJobs > 0 ? ((s.rejectedJobs / (s.completedJobs + s.rejectedJobs)) * 100).toFixed(1) : "0";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Print Shops</h1><p className="text-muted-foreground">Manage print shop partners.</p></div>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Add Print Shop</Button>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Assigned</th>
              <th className="px-4 py-3 font-medium">Completed</th>
              <th className="px-4 py-3 font-medium">Rejection %</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shops.map(s => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3">{s.email}</td>
                <td className="px-4 py-3">{s.location}</td>
                <td className="px-4 py-3">{s.assignedJobs}</td>
                <td className="px-4 py-3">{s.completedJobs}</td>
                <td className="px-4 py-3">{rejectionRate(s)}%</td>
                <td className="px-4 py-3"><Badge variant={s.active ? "default" : "secondary"}>{s.active ? "Active" : "Inactive"}</Badge></td>
                <td className="px-4 py-3 flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setViewShop(s)}><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Delete {s.name}?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteShop(s.id)}>Delete</AlertDialogAction></AlertDialogFooter>
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
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Print Shop" : "Add Print Shop"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 mt-2">
            <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div><Label>Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div>
            {!editing && <div><Label>Password</Label><Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></div>}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={save}>{editing ? "Save" : "Add"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Performance Dialog */}
      <Dialog open={!!viewShop} onOpenChange={() => setViewShop(null)}>
        <DialogContent>
          {viewShop && (
            <>
              <DialogHeader><DialogTitle>{viewShop.name} — Performance</DialogTitle></DialogHeader>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="rounded-lg border border-border p-4 text-center">
                  <p className="text-2xl font-bold">{viewShop.assignedJobs}</p>
                  <p className="text-sm text-muted-foreground">Assigned</p>
                </div>
                <div className="rounded-lg border border-border p-4 text-center">
                  <p className="text-2xl font-bold text-success">{viewShop.completedJobs}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="rounded-lg border border-border p-4 text-center">
                  <p className="text-2xl font-bold text-destructive">{viewShop.rejectedJobs}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Rejection Rate: {rejectionRate(viewShop)}%</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default PrintShopsPage;
