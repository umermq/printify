import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, ShoppingBag, CheckCircle, XCircle, ChevronLeft, ChevronRight,
  LogOut, Image, Clock, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoleGuard } from "@/components/RoleGuard";

const sidebarLinks = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/print-shop" },
  { label: "Assigned Jobs", icon: ShoppingBag, to: "/print-shop/jobs" },
  { label: "Completed", icon: CheckCircle, to: "/print-shop/completed" },
];

const assignedJobs = [
  { id: "ORD-003", customer: "Usman Tariq", product: "Custom T-Shirt (L)", status: "In Design", assignedDate: "Today" },
  { id: "ORD-006", customer: "Hira Malik", product: "Photo Book 10x10", status: "Pending", assignedDate: "Today" },
  { id: "ORD-007", customer: "Bilal Shah", product: "Photo Mug 11oz", status: "Awaiting Approval", assignedDate: "Yesterday" },
];

const PrintShopDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all ${collapsed ? "w-16" : "w-64"}`}>
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && <span className="font-heading text-lg font-bold text-sidebar-foreground">Print Shop</span>}
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
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-card/80 px-6 backdrop-blur-md">
          <h2 className="font-heading text-lg font-bold">Print Shop Dashboard</h2>
        </header>

        <div className="p-6">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Pending Jobs", value: "3", icon: Clock, color: "text-warning" },
              { label: "Completed Today", value: "5", icon: CheckCircle, color: "text-success" },
              { label: "Rejected", value: "1", icon: XCircle, color: "text-destructive" },
            ].map((stat, i) => (
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
              </motion.div>
            ))}
          </div>

          {/* Assigned Jobs */}
          <div className="mt-8 rounded-xl border border-border bg-card shadow-card">
            <div className="border-b border-border p-5">
              <h3 className="text-lg font-semibold">Assigned Jobs</h3>
            </div>
            <div className="divide-y divide-border">
              {assignedJobs.map((job) => (
                <div key={job.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{job.id}</span>
                      <Badge variant="outline" className="text-xs">
                        {job.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{job.product} • {job.customer}</p>
                    <p className="text-xs text-muted-foreground">Assigned: {job.assignedDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-success">Accept</Button>
                    <Button size="sm" variant="outline" className="text-destructive">Reject</Button>
                    <Button size="sm">Update Status</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrintShopDashboard;
