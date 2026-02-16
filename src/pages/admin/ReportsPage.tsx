import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, ShoppingBag, TrendingUp, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const revenueData = [
  { month: "Sep", revenue: 42000 }, { month: "Oct", revenue: 58000 }, { month: "Nov", revenue: 71000 },
  { month: "Dec", revenue: 95000 }, { month: "Jan", revenue: 82000 }, { month: "Feb", revenue: 110000 },
];

const categoryData = [
  { name: "Photo Books", orders: 45 }, { name: "Mugs", orders: 38 },
  { name: "T-Shirts", orders: 28 }, { name: "Gifts", orders: 35 },
];

const paymentData = [
  { name: "COD", value: 65 }, { name: "JazzCash", value: 18 },
  { name: "Easypaisa", value: 12 }, { name: "Other", value: 5 },
];

const cityData = [
  { city: "Lahore", orders: 52 }, { city: "Karachi", orders: 41 },
  { city: "Islamabad", orders: 28 }, { city: "Faisalabad", orders: 15 },
  { city: "Rawalpindi", orders: 12 }, { city: "Multan", orders: 8 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted-foreground))"];

const stats = [
  { label: "Total Revenue", value: "Rs. 458,000", icon: DollarSign },
  { label: "Total Orders", value: "146", icon: ShoppingBag },
  { label: "Avg Order Value", value: "Rs. 3,137", icon: TrendingUp },
  { label: "Top Category", value: "Photo Books", icon: Layers },
];

const ReportsPage = () => {
  const [range, setRange] = useState("6months");

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Reports & Analytics</h1><p className="text-muted-foreground">Business performance overview.</p></div>
        <div className="flex gap-2">
          {[{ label: "This Month", v: "1month" }, { label: "3 Months", v: "3months" }, { label: "6 Months", v: "6months" }].map(r => (
            <Button key={r.v} variant={range === r.v ? "default" : "outline"} size="sm" onClick={() => setRange(r.v)}>{r.label}</Button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-2 text-2xl font-bold">{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Revenue Line Chart */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip formatter={(v: number) => [`Rs. ${v.toLocaleString()}`, "Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Category */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-lg font-semibold mb-4">Orders by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip />
              <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* COD vs Online */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={paymentData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {paymentData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by City */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-lg font-semibold mb-4">Orders by City</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis dataKey="city" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
              <Tooltip />
              <Bar dataKey="orders" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportsPage;
