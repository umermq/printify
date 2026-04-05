import { motion } from "framer-motion";
import { ShoppingBag, DollarSign, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";

const statusColors: Record<string, string> = {
  "Pending Confirmation": "bg-warning/10 text-warning",
  Confirmed: "bg-primary/10 text-primary",
  "In Design": "bg-secondary/10 text-secondary",
  Shipped: "bg-primary/10 text-primary",
  Delivered: "bg-success/10 text-success",
  Cancelled: "bg-destructive/10 text-destructive",
};

const DashboardPage = () => {
  const { dashboardStats } = useOrders();
  const { totalRevenue, ordersToday, pendingOrders, completedOrders, recentOrders } = dashboardStats;

  const stats = [
    { label: "Total Revenue", value: `Rs. ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
    { label: "Orders Today", value: String(ordersToday), icon: ShoppingBag, color: "text-secondary" },
    { label: "Pending Orders", value: String(pendingOrders), icon: Clock, color: "text-warning" },
    { label: "Completed", value: String(completedOrders), icon: CheckCircle, color: "text-success" },
  ];

  return (
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
              {recentOrders.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">No orders yet.</td></tr>
              ) : recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-5 py-3 font-medium">{order.id}</td>
                  <td className="px-5 py-3">{order.customer}</td>
                  <td className="px-5 py-3">{order.product}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[order.status] || "bg-muted text-muted-foreground"}`}>{order.status}</span>
                  </td>
                  <td className="px-5 py-3 font-medium">Rs. {order.amount.toLocaleString()}</td>
                  <td className="px-5 py-3 text-muted-foreground">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
