"use client";

import { Product } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const [showToast, setShowToast] = useState(false);

  const cartItem = cartItems.find(item => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addItem(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02] border border-gray-700 flex flex-col h-full relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full font-medium shadow-lg z-10 flex items-center animate-bounce">
          <Check className="w-4 h-4 mr-2" />
          Added to cart!
        </div>
      )}

      <div className="h-48 w-full bg-gray-700 relative flex items-center justify-center p-0 overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-400 text-sm">Image: {product.name}</div>
        )}
        {quantityInCart > 0 && (
          <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            {quantityInCart} in cart
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white">{product.name}</h3>
          <span className="text-purple-400 font-bold">₱{product.price}</span>
        </div>
        <p className="text-gray-400 text-sm flex-grow mb-4">{product.description}</p>
        <button
          onClick={handleAddToCart}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors relative overflow-hidden"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
