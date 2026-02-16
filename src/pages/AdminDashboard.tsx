import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, ShoppingBag, Users, Package, Settings, BarChart3,
  ChevronLeft, ChevronRight, Image, Layers, LogOut, Bell, Search,
  TrendingUp, DollarSign, Clock, CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const sidebarLinks = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
  { label: "Orders", icon: ShoppingBag, to: "/admin/orders" },
  { label: "Products", icon: Package, to: "/admin/products" },
  { label: "Categories", icon: Layers, to: "/admin/categories" },
  { label: "Customers", icon: Users, to: "/admin/customers" },
  { label: "Print Shops", icon: Image, to: "/admin/print-shops" },
  { label: "Reports", icon: BarChart3, to: "/admin/reports" },
  { label: "Settings", icon: Settings, to: "/admin/settings" },
];

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

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all ${collapsed ? "w-16" : "w-64"}`}>
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && <span className="font-heading text-lg font-bold text-sidebar-foreground">PrintPK Admin</span>}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="text-sidebar-foreground hover:bg-sidebar-accent">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <link.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-2">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent">
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Back to Store</span>}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 transition-all ${collapsed ? "ml-16" : "ml-64"}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-md">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-10" placeholder="Search orders, customers..." />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-hero text-xs font-bold text-primary-foreground">A</div>
          </div>
        </header>

        <div className="p-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
          </motion.div>

          {/* Stats */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-border bg-card p-5 shadow-card"
              >
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

          {/* Recent Orders */}
          <div className="mt-8 rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <Button variant="ghost" size="sm">View All</Button>
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
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[order.status] || ""}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-medium">{order.amount}</td>
                      <td className="px-5 py-3 text-muted-foreground">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
