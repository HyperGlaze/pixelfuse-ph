"use client";

import { useCartStore } from '@/store/cartStore';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Cart() {
  const { items, updateQuantity, removeItem, totalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Looks like you haven't added any pixel art to your cart yet.</p>
        <Link 
          href="/shop"
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Shopping Cart</h2>
      
      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between bg-gray-900 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
              <div className="w-16 h-16 bg-gray-700 rounded mr-4 flex-shrink-0"></div>
              <div>
                <h3 className="text-white font-medium">{item.name}</h3>
                <p className="text-purple-400">₱{item.price}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between w-full sm:w-auto space-x-4">
              <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1 border border-gray-700">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-white">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-white font-medium min-w-[4rem] text-right">
                ₱{item.price * item.quantity}
              </div>
              
              <button 
                onClick={() => removeItem(item.id)}
                className="text-red-400 hover:text-red-300 p-2"
                aria-label="Remove item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-700 pt-6">
        <div className="flex justify-between items-center mb-6 text-xl font-bold text-white">
          <span>Total:</span>
          <span className="text-purple-400">₱{totalPrice()}</span>
        </div>
        
        <Link 
          href="/checkout"
          className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center font-medium py-4 px-6 rounded-lg transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
