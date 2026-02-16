import { motion } from "framer-motion";
import { ShoppingBag, DollarSign, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stats = [
  { label: "Total Revenue", value: "Rs. 485,000", change: "+12%", icon: DollarSign, color: "text-primary" },
  { label: "Orders Today", value: "24", change: "+8%", icon: ShoppingBag, color: "text-secondary" },
  { label: "Pending Orders", value: "12", change: "-3%", icon: Clock, color: "text-warning" },
  { label: "Completed", value: "156", change: "+15%", icon: CheckCircle, color: "text-success" },
];

const recentOrders = [
  { id: "ORD-001", customer: "Ahmed Khan", product: "Photo Book", status: "Pending", amount: "Rs. 3,500", date: "Today" },
  { id: "ORD-002", customer: "Sara Ali", product: "Custom Mug", status: "Confirmed", amount: "Rs. 800", date: "Today" },
  { id: "ORD-003", customer: "Usman Tariq", product: "T-Shirt", status: "In Design", amount: "Rs. 1,500", date: "Yesterday" },
  { id: "ORD-004", customer: "Fatima Noor", product: "Photo Cushion", status: "Shipped", amount: "Rs. 2,200", date: "Yesterday" },
  { id: "ORD-005", customer: "Ali Raza", product: "Wedding Album", status: "Delivered", amount: "Rs. 8,000", date: "2 days ago" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-warning/10 text-warning",
  Confirmed: "bg-primary/10 text-primary",
  "In Design": "bg-secondary/10 text-secondary",
  Shipped: "bg-primary/10 text-primary",
  Delivered: "bg-success/10 text-success",
};

const DashboardPage = () => (
  <>
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
    </motion.div>

    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </div>
          <div className="mt-2 text-2xl font-bold">{stat.value}</div>
          <div className="mt-1 flex items-center gap-1 text-xs">
            <TrendingUp className="h-3 w-3 text-success" />
            <span className="text-success">{stat.change}</span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        </motion.div>
      ))}
    </div>

    <div className="mt-8 rounded-xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border p-5">
        <h3 className="text-lg font-semibold">Recent Orders</h3>
        <Button variant="ghost" size="sm" asChild><Link to="/admin/orders">View All</Link></Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-5 py-3 font-medium">Order ID</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-5 py-3 font-medium">{order.id}</td>
                <td className="px-5 py-3">{order.customer}</td>
                <td className="px-5 py-3">{order.product}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[order.status] || ""}`}>{order.status}</span>
                </td>
                <td className="px-5 py-3 font-medium">{order.amount}</td>
                <td className="px-5 py-3 text-muted-foreground">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

export default DashboardPage;
