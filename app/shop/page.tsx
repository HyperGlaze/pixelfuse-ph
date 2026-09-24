"use client";

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Filter } from 'lucide-react';

import CustomProductCard from '@/components/CustomProductCard';

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);
        
        if (productsRes.ok) {
          setProducts(await productsRes.json());
        }
        if (categoriesRes.ok) {
          setCategories(await categoriesRes.json());
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredProducts = products.filter(product => {
    if (selectedTags.length === 0) return true;
    if (!product.category) return false;
    const productTags = product.category.split(',');
    return selectedTags.some(tag => productTags.includes(tag));
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-white mb-4">Shop</h1>
        <p className="text-xl text-gray-400">Browse our collection of pixel art keychains and DIY kits, or request a custom design!</p>
      </div>

      {categories.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4 text-gray-300">
            <Filter className="w-5 h-5" />
            <h2 className="font-semibold">Filter by Tags:</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const isSelected = selectedTags.includes(c.name);
              return (
                <button
                  key={c.id}
                  onClick={() => toggleTag(c.name)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                    isSelected 
                      ? 'bg-purple-600 text-white border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]' 
                      : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
            {selectedTags.length > 0 && (
              <button 
                onClick={() => setSelectedTags([])}
                className="px-4 py-1.5 text-sm font-medium text-red-400 hover:text-red-300 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <CustomProductCard />
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-20 bg-gray-800/30 rounded-xl border border-gray-700/50 mt-4">
              <p className="text-xl">No products match the selected tags.</p>
              <button onClick={() => setSelectedTags([])} className="mt-4 text-purple-400 hover:underline">Clear filters</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
