import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, User, Award, Shield, Truck, CreditCard } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/Logo";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Photo Prints", to: "/products?category=photo-prints" },
  { label: "Photo Books", to: "/products?category=photo-books" },
  { label: "Mugs", to: "/products?category=mugs" },
  { label: "T-Shirts", to: "/products?category=t-shirts" },
];

export const Header = () => {
  const { totalItems } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Logo size="md" />

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to || (link.to.includes('?') && location.search === link.to.split('?')[1] ? '?' + location.search.slice(1) === '?' + link.to.split('?')[1] : false);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-xs font-medium tracking-widest uppercase transition-colors duration-300 pb-0.5 group ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 h-px bg-gold transition-all duration-500 ${
                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className="relative hover:bg-muted transition-colors duration-300">
              <ShoppingCart className="h-4 w-4" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-foreground">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost" size="icon" className="hover:bg-muted transition-colors duration-300">
              <User className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </Link>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                <Menu className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background border-border">
              <div className="mb-8 pt-2">
                <Logo size="sm" linkTo="" />
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="border-b border-border px-0 py-3 text-sm font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-4 py-3 text-sm font-medium tracking-widest uppercase text-gold hover:opacity-75 transition-opacity duration-300"
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
  <footer className="bg-foreground text-primary-foreground">
    <div className="container py-16">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" className="group inline-block">
            <span className="font-serif text-xl font-semibold tracking-widest text-primary-foreground">PixelCraft</span>
            <span className="accent-line mt-1 transition-all duration-500" />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/50">
            Pakistan's trusted premium photo printing service. Transform your cherished moments into timeless keepsakes.
          </p>
          {/* Social icons */}
          <div className="mt-6 flex items-center gap-4">
            <a href="https://facebook.com/pixelcraft" target="_blank" rel="noopener noreferrer"
              className="text-primary-foreground/40 hover:text-gold transition-colors duration-300" aria-label="Facebook">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://instagram.com/pixelcraft" target="_blank" rel="noopener noreferrer"
              className="text-primary-foreground/40 hover:text-gold transition-colors duration-300" aria-label="Instagram">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="https://tiktok.com/@pixelcraft" target="_blank" rel="noopener noreferrer"
              className="text-primary-foreground/40 hover:text-gold transition-colors duration-300" aria-label="TikTok">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
            <a href="https://youtube.com/@pixelcraft" target="_blank" rel="noopener noreferrer"
              className="text-primary-foreground/40 hover:text-gold transition-colors duration-300" aria-label="YouTube">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Products */}
        <div>
          <h4 className="mb-4 section-label !text-gold">Products</h4>
          <div className="flex flex-col gap-2.5 text-sm text-primary-foreground/50">
            <Link to="/products?category=photo-books" className="hover:text-gold transition-colors duration-300">Photo Books</Link>
            <Link to="/products?category=mugs" className="hover:text-gold transition-colors duration-300">Custom Mugs</Link>
            <Link to="/products?category=t-shirts" className="hover:text-gold transition-colors duration-300">T-Shirts</Link>
            <Link to="/products?category=gifts" className="hover:text-gold transition-colors duration-300">Gift Items</Link>
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="mb-4 section-label !text-gold">Company</h4>
          <div className="flex flex-col gap-2.5 text-sm text-primary-foreground/50">
            <Link to="/about" className="hover:text-gold transition-colors duration-300">About Us</Link>
            <Link to="/contact" className="hover:text-gold transition-colors duration-300">Contact Us</Link>
            <Link to="/faqs" className="hover:text-gold transition-colors duration-300">FAQs</Link>
          </div>
        </div>

        {/* Policies */}
        <div>
          <h4 className="mb-4 section-label !text-gold">Policies</h4>
          <div className="flex flex-col gap-2.5 text-sm text-primary-foreground/50">
            <Link to="/privacy-policy" className="hover:text-gold transition-colors duration-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold transition-colors duration-300">Terms & Conditions</Link>
            <Link to="/refund-policy" className="hover:text-gold transition-colors duration-300">Refund Policy</Link>
            <Link to="/shipping-policy" className="hover:text-gold transition-colors duration-300">Shipping Policy</Link>
            <Link to="/return-policy" className="hover:text-gold transition-colors duration-300">Return Policy</Link>
          </div>
        </div>

        {/* Support */}
        <div>
          <h4 className="mb-4 section-label !text-gold">Support</h4>
          <div className="flex flex-col gap-2.5 text-sm text-primary-foreground/50">
            <a href="https://wa.me/923334442957" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors duration-300">WhatsApp Us</a>
            <span>+92 42 3334442957</span>
            <span>info@pixelcraft.pk</span>
            <span>Mon–Sat: 10am – 8pm</span>
          </div>
        </div>
      </div>

      {/* Trust Strip */}
      <div className="mt-12 border-t border-primary-foreground/10 pt-8">
        <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-primary-foreground/35">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-gold" strokeWidth={1.5} />
            <span>Premium Quality Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-gold" strokeWidth={1.5} />
            <span>Secure Payments</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-gold" strokeWidth={1.5} />
            <span>Nationwide Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-gold" strokeWidth={1.5} />
            <span>Cash on Delivery</span>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-primary-foreground/25">
          © 2026 PixelCraft. All rights reserved. Crafted with care in Pakistan.
        </p>
      </div>
    </div>
  </footer>
);
