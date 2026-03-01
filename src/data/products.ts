export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  basePrice: number;
  sizes: { label: string; price: number }[];
  themes: { id: string; name: string; preview: string }[];
  deliveryDays: string;
  image: string;
  featured: boolean;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  productCount: number;
}

export const categories: Category[] = [
  { slug: "photo-books", name: "Photo Books", description: "Premium hardcover & softcover photo books", icon: "📖", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80&auto=format&fit=crop", productCount: 4 },
  { slug: "mugs", name: "Custom Mugs", description: "Ceramic mugs with your favorite photos", icon: "☕", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80&auto=format&fit=crop", productCount: 3 },
  { slug: "t-shirts", name: "T-Shirts", description: "Custom printed t-shirts in all sizes", icon: "👕", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format&fit=crop", productCount: 3 },
  { slug: "gifts", name: "Gift Items", description: "Photo cushions, keychains & more", icon: "🎁", image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80&auto=format&fit=crop", productCount: 4 },
];

export const products: Product[] = [
  {
    id: "pb-1", name: "Classic Photo Book", category: "Photo Books", categorySlug: "photo-books",
    description: "A beautiful hardcover photo book with premium glossy pages. Perfect for weddings, birthdays, and family memories.",
    basePrice: 2500, sizes: [{ label: "8x8 (20 pages)", price: 2500 }, { label: "10x10 (30 pages)", price: 3500 }, { label: "12x12 (40 pages)", price: 5000 }],
    themes: [{ id: "classic", name: "Classic White", preview: "🤍" }, { id: "rustic", name: "Rustic Wood", preview: "🪵" }, { id: "modern", name: "Modern Dark", preview: "🖤" }],
    deliveryDays: "5-7 days", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80&auto=format&fit=crop", featured: true,
  },
  {
    id: "pb-2", name: "Wedding Album", category: "Photo Books", categorySlug: "photo-books",
    description: "Luxurious wedding album with leather cover and lay-flat pages.",
    basePrice: 5000, sizes: [{ label: "10x10 (30 pages)", price: 5000 }, { label: "12x12 (50 pages)", price: 8000 }],
    themes: [{ id: "elegant", name: "Elegant Gold", preview: "✨" }, { id: "romantic", name: "Romantic Blush", preview: "🌸" }, { id: "royal", name: "Royal Navy", preview: "💎" }],
    deliveryDays: "7-10 days", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80&auto=format&fit=crop", featured: true,
  },
  {
    id: "mug-1", name: "Photo Mug - Classic", category: "Custom Mugs", categorySlug: "mugs",
    description: "11oz ceramic mug with your photo printed in vibrant colors. Dishwasher safe.",
    basePrice: 800, sizes: [{ label: "11oz Standard", price: 800 }, { label: "15oz Large", price: 1000 }],
    themes: [{ id: "wrap", name: "Full Wrap", preview: "🔄" }, { id: "heart", name: "Heart Frame", preview: "❤️" }, { id: "collage", name: "Photo Collage", preview: "🖼️" }],
    deliveryDays: "3-5 days", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80&auto=format&fit=crop", featured: true,
  },
  {
    id: "mug-2", name: "Magic Mug", category: "Custom Mugs", categorySlug: "mugs",
    description: "Heat-sensitive color-changing mug. Pour hot water and watch your photo appear!",
    basePrice: 1200, sizes: [{ label: "11oz", price: 1200 }],
    themes: [{ id: "reveal", name: "Photo Reveal", preview: "✨" }, { id: "message", name: "Message Reveal", preview: "💬" }],
    deliveryDays: "3-5 days", image: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=80&auto=format&fit=crop", featured: false,
  },
  {
    id: "ts-1", name: "Custom Photo T-Shirt", category: "T-Shirts", categorySlug: "t-shirts",
    description: "Premium cotton t-shirt with full-color photo print. Available in all sizes.",
    basePrice: 1500, sizes: [{ label: "S", price: 1500 }, { label: "M", price: 1500 }, { label: "L", price: 1500 }, { label: "XL", price: 1600 }],
    themes: [{ id: "front", name: "Front Print", preview: "👕" }, { id: "back", name: "Back Print", preview: "🔙" }, { id: "both", name: "Front & Back", preview: "✌️" }],
    deliveryDays: "3-5 days", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format&fit=crop", featured: true,
  },
  {
    id: "gift-1", name: "Photo Cushion", category: "Gift Items", categorySlug: "gifts",
    description: "Soft velvet cushion with custom photo print. Great for home decor and gifts.",
    basePrice: 1800, sizes: [{ label: '12"x12"', price: 1800 }, { label: '16"x16"', price: 2200 }],
    themes: [{ id: "single", name: "Single Photo", preview: "📷" }, { id: "collage4", name: "4 Photo Collage", preview: "🖼️" }],
    deliveryDays: "5-7 days", image: "https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?w=800&q=80&auto=format&fit=crop", featured: true,
  },
  {
    id: "gift-2", name: "Photo Keychain", category: "Gift Items", categorySlug: "gifts",
    description: "Acrylic photo keychain. Compact and durable. Perfect personalized gift.",
    basePrice: 500, sizes: [{ label: "Rectangle", price: 500 }, { label: "Heart Shape", price: 600 }],
    themes: [{ id: "single", name: "Single Photo", preview: "📷" }],
    deliveryDays: "3-5 days", image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80&auto=format&fit=crop", featured: false,
  },
];
