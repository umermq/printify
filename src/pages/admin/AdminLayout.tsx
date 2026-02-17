import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard, ShoppingBag, Users, Package, Settings, BarChart3,
  ChevronLeft, ChevronRight, Image, Layers, LogOut, Bell, Search } from
"lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const sidebarLinks = [
{ label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
{ label: "Orders", icon: ShoppingBag, to: "/admin/orders" },
{ label: "Products", icon: Package, to: "/admin/products" },
{ label: "Categories", icon: Layers, to: "/admin/categories" },
{ label: "Customers", icon: Users, to: "/admin/customers" },
{ label: "Print Shops", icon: Image, to: "/admin/print-shops" },
{ label: "Reports", icon: BarChart3, to: "/admin/reports" },
{ label: "Settings", icon: Settings, to: "/admin/settings" }];


const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (to: string) => {
    if (to === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(to);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all ${collapsed ? "w-16" : "w-64"}`}>
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && <span className="font-heading text-lg font-bold text-sidebar-foreground">PrintPK Admin</span>}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="text-sidebar-foreground hover:bg-sidebar-accent">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="flex-1 space-y-1 p-2 text-primary bg-teal-400">
          {sidebarLinks.map((link) =>
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive(link.to) ?
            "bg-sidebar-accent text-sidebar-primary" :
            "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`
            }>

              <link.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          )}
        </nav>
        <div className="border-t border-sidebar-border p-2">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent">
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Back to Store</span>}
          </Link>
        </div>
      </aside>

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
          <Outlet />
        </div>
      </main>
    </div>);

};

export default AdminLayout;