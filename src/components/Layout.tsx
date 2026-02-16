import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, User, Camera } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Photo Books", to: "/products?category=photo-books" },
  { label: "Mugs", to: "/products?category=mugs" },
  { label: "T-Shirts", to: "/products?category=t-shirts" },
];

export const Header = () => {
  const { totalItems } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero">
            <Camera className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">PrintPK</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                location.pathname === link.to ? "bg-muted text-foreground" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary p-0 text-xs text-secondary-foreground">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="mt-8 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-4 rounded-md px-4 py-3 text-base font-medium text-primary hover:bg-muted"
                >
                  Login / Register
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero">
              <Camera className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-heading text-lg font-bold">PrintPK</span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Pakistan's trusted custom photo printing service. Turn your memories into beautiful gifts.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Products</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/products?category=photo-books" className="hover:text-foreground">Photo Books</Link>
            <Link to="/products?category=mugs" className="hover:text-foreground">Custom Mugs</Link>
            <Link to="/products?category=t-shirts" className="hover:text-foreground">T-Shirts</Link>
            <Link to="/products?category=gifts" className="hover:text-foreground">Gift Items</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Support</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>WhatsApp: +92 300 1234567</span>
            <span>Email: info@printpk.com</span>
            <span>Mon-Sat: 10am - 8pm</span>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Info</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>Cash on Delivery Available</span>
            <span>3-5 Days Delivery</span>
            <span>Nationwide Shipping</span>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        © 2026 PrintPK. All rights reserved.
      </div>
    </div>
  </footer>
);
