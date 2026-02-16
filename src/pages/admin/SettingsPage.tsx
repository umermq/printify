import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    storeName: "PrintPK", contactEmail: "admin@printpk.com", phone: "0300-1234567", address: "123 Mall Road, Lahore",
    deliveryTime: "3-5", shippingFee: 200,
    codEnabled: true, jazzCashEnabled: true, easypaisaEnabled: true,
    emailNotifications: true, whatsappAlerts: true,
  });

  const save = () => toast({ title: "Settings saved", description: "Your changes have been saved." });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-muted-foreground">Manage your store configuration.</p>

      <div className="mt-6 space-y-8">
        {/* Store Info */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Store Information</h2>
          <div className="grid gap-4">
            <div><Label>Store Name</Label><Input value={form.storeName} onChange={e => setForm(f => ({ ...f, storeName: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Contact Email</Label><Input value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            </div>
            <div><Label>Address</Label><Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
          </div>
        </section>

        <Separator />

        {/* Delivery */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Delivery Settings</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Default Delivery Time (days)</Label><Input value={form.deliveryTime} onChange={e => setForm(f => ({ ...f, deliveryTime: e.target.value }))} /></div>
            <div><Label>Shipping Fee (Rs.)</Label><Input type="number" value={form.shippingFee} onChange={e => setForm(f => ({ ...f, shippingFee: Number(e.target.value) }))} /></div>
          </div>
        </section>

        <Separator />

        {/* Payment */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Payment Settings</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div><Label>Cash on Delivery</Label><p className="text-sm text-muted-foreground">Accept COD payments</p></div>
              <Switch checked={form.codEnabled} onCheckedChange={v => setForm(f => ({ ...f, codEnabled: v }))} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div><Label>JazzCash</Label><p className="text-sm text-muted-foreground">Accept JazzCash payments</p></div>
              <Switch checked={form.jazzCashEnabled} onCheckedChange={v => setForm(f => ({ ...f, jazzCashEnabled: v }))} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div><Label>Easypaisa</Label><p className="text-sm text-muted-foreground">Accept Easypaisa payments</p></div>
              <Switch checked={form.easypaisaEnabled} onCheckedChange={v => setForm(f => ({ ...f, easypaisaEnabled: v }))} />
            </div>
          </div>
        </section>

        <Separator />

        {/* Notifications */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div><Label>Email Notifications</Label><p className="text-sm text-muted-foreground">Receive order updates via email</p></div>
              <Switch checked={form.emailNotifications} onCheckedChange={v => setForm(f => ({ ...f, emailNotifications: v }))} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div><Label>WhatsApp Alerts</Label><p className="text-sm text-muted-foreground">Receive alerts via WhatsApp</p></div>
              <Switch checked={form.whatsappAlerts} onCheckedChange={v => setForm(f => ({ ...f, whatsappAlerts: v }))} />
            </div>
          </div>
        </section>

        <Button onClick={save} className="w-full">Save Settings</Button>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
