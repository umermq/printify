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
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
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

        {/* Products */}
        <div>
          <h4 className="mb-3 text-sm font-semibold">Products</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/products?category=photo-books" className="hover:text-foreground">Photo Books</Link>
            <Link to="/products?category=mugs" className="hover:text-foreground">Custom Mugs</Link>
            <Link to="/products?category=t-shirts" className="hover:text-foreground">T-Shirts</Link>
            <Link to="/products?category=gifts" className="hover:text-foreground">Gift Items</Link>
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground">About Us</Link>
            <Link to="/contact" className="hover:text-foreground">Contact Us</Link>
            <Link to="/faqs" className="hover:text-foreground">FAQs</Link>
          </div>
        </div>

        {/* Policies */}
        <div>
          <h4 className="mb-3 text-sm font-semibold">Policies</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms & Conditions</Link>
            <Link to="/refund-policy" className="hover:text-foreground">Refund Policy</Link>
            <Link to="/shipping-policy" className="hover:text-foreground">Shipping Policy</Link>
            <Link to="/return-policy" className="hover:text-foreground">Return Policy</Link>
          </div>
        </div>

        {/* Support */}
        <div>
          <h4 className="mb-3 text-sm font-semibold">Support</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">WhatsApp</a>
            <span>+92 42 3456 7890</span>
            <span>info@printpk.com</span>
            <span>Mon-Sat: 10am - 8pm</span>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-border pt-6">
        <a href="https://facebook.com/printpk" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="Facebook">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
        <a href="https://instagram.com/printpk" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="Instagram">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        </a>
        <a href="https://tiktok.com/@printpk" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="TikTok">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
        </a>
        <a href="https://youtube.com/@printpk" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="YouTube">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        </a>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-base">💵</span>
          <span>Cash on Delivery</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-base">🔒</span>
          <span>Secure Payments</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-base">🚚</span>
          <span>3-7 Days Delivery</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-base">📱</span>
          <span>JazzCash</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-base">📲</span>
          <span>Easypaisa</span>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        © 2026 PrintPK. All rights reserved.
      </div>
    </div>
  </footer>
);
