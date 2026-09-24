"use client";

import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, Check, X, Upload } from 'lucide-react';
import { useState } from 'react';

export default function CustomProductCard() {
  const addItem = useCartStore((state) => state.addItem);
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [customNotes, setCustomNotes] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCustomImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddToCart = async () => {
    if (!customImage) {
      alert("Please upload your custom design image first!");
      return;
    }

    setIsUploading(true);
    try {
      const fileData = new FormData();
      fileData.append("file", customImage);
      
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: fileData,
      });
      
      if (!uploadRes.ok) throw new Error("Image upload failed");
      const { url } = await uploadRes.json();

      const customProduct = {
        id: `custom-${Date.now()}`,
        name: "Custom Design",
        price: 150, // Base price for custom design
        description: `Custom User Design. ${customNotes ? `Notes: ${customNotes}` : ''}`,
        image: url,
        category: "custom",
      };

      for (let i = 0; i < quantity; i++) {
        addItem(customProduct);
      }
      
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setShowModal(false);
        setQuantity(1);
        setCustomImage(null);
        setPreviewUrl(null);
        setCustomNotes("");
      }, 1500);
    } catch (e) {
      console.error(e);
      alert("Failed to upload custom design.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02] border-2 border-dashed border-purple-500/50 flex flex-col h-full relative cursor-pointer hover:border-purple-500 group" onClick={() => setShowModal(true)}>
        <div className="h-48 w-full bg-purple-900/20 relative flex flex-col items-center justify-center p-0 overflow-hidden group-hover:bg-purple-900/40 transition-colors">
          <Upload className="w-12 h-12 text-purple-400 mb-2" />
          <span className="text-purple-300 font-medium">Upload Your Design</span>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-white">Custom Design</h3>
            <span className="text-purple-400 font-bold">₱150+</span>
          </div>
          <p className="text-gray-400 text-sm flex-grow mb-4 line-clamp-2">Upload your own image or pixel art design and we'll turn it into a reality!</p>
          <button
            onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            Create Custom
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row">
            {showToast && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full font-medium shadow-lg z-20 flex items-center animate-bounce">
                <Check className="w-4 h-4 mr-2" />
                Added to cart!
              </div>
            )}
            
            <button 
              onClick={() => { setShowModal(false); setQuantity(1); }}
              className="absolute top-3 right-3 text-gray-400 hover:text-white bg-gray-900/50 rounded-full p-1 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="h-64 md:h-auto md:w-1/2 bg-gray-900 relative flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-700 shrink-0">
              {previewUrl ? (
                <img src={previewUrl} alt="Custom Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6">
                  <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No image uploaded yet</p>
                </div>
              )}
            </div>
            
            <div className="p-6 md:w-1/2 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">Custom Design</h2>
                <span className="text-xl text-purple-400 font-bold ml-4 shrink-0">₱150</span>
              </div>
              
              <div className="space-y-4 mb-6 flex-grow">
                <p className="text-sm text-gray-300">
                  <span className="font-bold text-purple-400">Rules:</span> Max size 64x64 pixels equivalent. Complex designs may incur additional costs (we will contact you).
                </p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Upload Reference Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer bg-gray-900 rounded-lg p-2 border border-gray-700"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Additional Notes (Optional)</label>
                  <textarea
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="E.g., I want the background to be transparent"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-4 bg-gray-900/50 p-4 rounded-xl border border-gray-700 gap-4">
                <div className="flex items-center justify-center space-x-3 shrink-0">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 bg-gray-800 text-white text-center font-bold text-lg rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 py-1 no-spinners"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white hover:bg-purple-500 transition-colors"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={isUploading || !customImage}
                  className={`bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors flex-1 ${(!customImage || isUploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isUploading ? 'Uploading...' : `Add (₱${150 * quantity})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
