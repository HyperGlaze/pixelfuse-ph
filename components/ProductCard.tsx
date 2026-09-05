"use client";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  category?: string;
}
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02] border border-gray-700 flex flex-col h-full">
      <div className="h-48 w-full bg-gray-700 relative flex items-center justify-center p-0 overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-400 text-sm">Image: {product.name}</div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white">{product.name}</h3>
          <span className="text-purple-400 font-bold">₱{product.price}</span>
        </div>
        <p className="text-gray-400 text-sm flex-grow mb-4">{product.description}</p>
        <button
          onClick={() => addItem(product)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
