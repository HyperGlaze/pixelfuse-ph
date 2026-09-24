"use client";

import { useCartStore } from '@/store/cartStore';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    facebookName: '',
    facebookUrl: '',
    address: '',
    city: 'meetup',
    paymentMethod: 'meetup',
  });

  const [confirmOrder, setConfirmOrder] = useState(false);

  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    
    // Load preset
    const savedPreset = localStorage.getItem('userPreset');
    if (savedPreset) {
      try {
        setFormData((prev) => ({ ...prev, ...JSON.parse(savedPreset) }));
      } catch (e) {
        console.error("Failed to parse user preset");
      }
    }

    // Load site settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSiteSettings(data))
      .catch(err => console.error(err));
  }, []);

  const [proofFile, setProofFile] = useState<File | null>(null);

  const getDeliveryFee = (city: string) => {
    if (!siteSettings) return 0;
    if (city === 'taguig') return siteSettings.deliveryTaguig;
    if (city === 'makati') return siteSettings.deliveryMakati;
    return 0; // meetup
  };

  const deliveryFee = getDeliveryFee(formData.city);
  const finalTotal = totalPrice() + deliveryFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProofFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmOrder) {
      alert("Please check the confirmation box to proceed.");
      return;
    }
    setIsSubmitting(true);
    
    try {
      let proofUrl = null;
      if (proofFile) {
        const fileData = new FormData();
        fileData.append('file', proofFile);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: fileData,
        });
        
        if (uploadRes.ok) {
          const result = await uploadRes.json();
          proofUrl = result.url;
        } else {
          console.error("Proof of payment upload failed.");
        }
      }

      const payload = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        facebookName: formData.facebookName,
        facebookUrl: formData.facebookUrl,
        address: formData.address, // Use explicit address
        deliveryFee: deliveryFee,
        items: items, // Frontend passes the array, API stringifies it
        totalAmount: finalTotal,
        paymentMethod: formData.paymentMethod,
        proofOfPayment: proofUrl,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsSuccess(true);
        clearCart();
      } else {
        let errorMsg = "Unknown error";
        try {
          const text = await res.text();
          const parsed = text ? JSON.parse(text) : {};
          errorMsg = parsed.error || JSON.stringify(parsed);
          console.error("Failed to place order (API response):", parsed);
        } catch (parseError) {
          console.error("Failed to parse error response");
        }
        alert(`Failed to place order. Error: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Checkout submission error:", error);
      alert("An error occurred while placing order. Please check the console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-20 h-20 text-green-500" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Order Confirmed!</h1>
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          Thank you for your order, {formData.name}!<br />
          We will contact you on your Facebook, phone number, or email to coordinate delivery/meetup. You can view your order status in the Track Order page.
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/history"
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-8 rounded-lg transition-colors inline-block"
          >
            Track Order
          </Link>
          <Link 
            href="/shop"
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-colors inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Your cart is empty</h1>
        <p className="text-gray-400 mb-8">You need items in your cart to checkout.</p>
        <button 
          onClick={() => router.push('/shop')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-colors inline-block"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-white mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className="w-full lg:w-2/3">
          <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6">Contact & Delivery Information</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Juan Dela Cruz"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="juan@example.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="facebookName" className="block text-sm font-medium text-gray-400 mb-1">Facebook Name</label>
                  <input
                    type="text"
                    id="facebookName"
                    name="facebookName"
                    value={formData.facebookName}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Juan Dela Cruz"
                  />
                </div>
                <div>
                  <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-400 mb-1">Facebook Profile Link</label>
                  <input
                    type="url"
                    id="facebookUrl"
                    name="facebookUrl"
                    value={formData.facebookUrl}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://facebook.com/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="09123456789"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-400 mb-1">Delivery Option *</label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="meetup">Campus Meetup (₱0)</option>
                    <option value="taguig">Taguig Delivery (₱{siteSettings?.deliveryTaguig || 50})</option>
                    <option value="makati">Makati Delivery (₱{siteSettings?.deliveryMakati || 70})</option>
                  </select>
                </div>
              </div>

              {/* Explicit Address Input */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-1">Full Delivery Address / Meetup Location *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="House No, Street, Barangay OR Campus building details"
                />
              </div>

              <h3 className="text-lg font-bold text-white mt-8 mb-4 border-t border-gray-700 pt-6">Payment Method</h3>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-700 rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="ml-3 text-white font-medium">Cash (Upon Meetup / Delivery)</span>
                </label>
                <label className="flex items-center p-4 border border-gray-700 rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="gcash"
                    checked={formData.paymentMethod === 'gcash'}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="ml-3 text-white font-medium">GCash</span>
                </label>
                <label className="flex items-center p-4 border border-gray-700 rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="maya"
                    checked={formData.paymentMethod === 'maya'}
                    onChange={handleChange}
                    className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="ml-3 text-white font-medium">Maya</span>
                </label>
              </div>

              {(formData.paymentMethod === 'gcash' || formData.paymentMethod === 'maya') && (
                <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg mt-4">
                  <p className="text-purple-300 font-medium mb-2">Please send your payment to:</p>
                  <p className="text-2xl font-bold text-white mb-4 tracking-wider">09927367858</p>
                  
                  <div>
                    <label htmlFor="proofFile" className="block text-sm font-medium text-gray-400 mb-1">Upload Proof of Payment (Screenshot) *</label>
                    <input
                      type="file"
                      id="proofFile"
                      accept="image/*"
                      required
                      onChange={handleFileChange}
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmOrder}
                  onChange={(e) => setConfirmOrder(e.target.checked)}
                  className="mt-1 w-5 h-5 text-purple-600 bg-gray-900 border-gray-600 rounded focus:ring-purple-500"
                />
                <span className="ml-3 text-gray-300">
                  I confirm that all my details above are correct and I want to proceed with this order.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 px-6 rounded-lg transition-colors flex justify-center items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Processing...' : `Place Order (₱${finalTotal})`}
            </button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex items-start text-sm">
                  <div className="w-12 h-12 bg-gray-700 rounded mr-3 flex-shrink-0 overflow-hidden relative">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-[8px] text-gray-400 text-center p-1">No Img</div>
                    )}
                  </div>
                  <div className="flex-1 pr-4">
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-purple-400 font-medium">₱{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>₱{totalPrice()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery Fee</span>
                <span>₱{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-gray-700">
                <span>Total</span>
                <span className="text-purple-400">₱{finalTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
