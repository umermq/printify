import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { Header, Footer } from "@/components/Layout";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import PrintShopDashboard from "./pages/PrintShopDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/admin") || location.pathname.startsWith("/print-shop");

  return (
    <>
      {!isDashboard && <Header />}
      <main className={isDashboard ? "" : "min-h-screen"}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/print-shop/*" element={<PrintShopDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
      <WhatsAppButton />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
