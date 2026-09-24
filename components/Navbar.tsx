"use client";

import Link from 'next/link';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold tracking-tight text-purple-400">
              PixelFuse PH
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
            <Link href="/shop" className="hover:text-purple-400 transition-colors">Shop</Link>
            <Link href="/history" className="hover:text-purple-400 transition-colors">Track Order</Link>
            <Link href="/about" className="hover:text-purple-400 transition-colors">About Us</Link>
            
            <div className="flex items-center space-x-6 border-l border-gray-700 pl-6">
              <Link href="/user" className="flex items-center space-x-2 hover:text-purple-400 transition-colors" title="User Settings">
                <User className="w-5 h-5" />
                <span>User</span>
              </Link>
              
              <Link href="/cart" className="relative hover:text-purple-400 transition-colors" title="Cart">
                <ShoppingCart className="w-6 h-6" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <Link href="/cart" className="relative text-white">
              <ShoppingCart className="w-6 h-6" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800"
              onClick={() => setIsOpen(false)}
            >
              Shop
            </Link>
            <Link 
              href="/history" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800"
              onClick={() => setIsOpen(false)}
            >
              Track Order
            </Link>
            <Link 
              href="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            <Link 
              href="/user" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-5 h-5" />
              <span>User Info</span>
            </Link>
            <Link 
              href="/cart" 
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800"
              onClick={() => setIsOpen(false)}
            >
              Cart
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
