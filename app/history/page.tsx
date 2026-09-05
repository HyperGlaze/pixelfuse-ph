"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';

export default function OrderHistory() {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setHasSearched(true);
    
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'Accepted': return 'bg-blue-500/20 text-blue-400';
      case 'Shipping': return 'bg-purple-500/20 text-purple-400';
      case 'Done': return 'bg-green-500/20 text-green-400';
      case 'Declined': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-white mb-8">Order History</h1>
      
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="emailSearch" className="block text-sm font-medium text-gray-400 mb-1">Enter your email address</label>
            <input
              type="email"
              id="emailSearch"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="juan@example.com"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? 'Searching...' : 'Search Orders'}
            </button>
          </div>
        </form>
      </div>

      {hasSearched && !loading && orders.length === 0 && (
        <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No orders found</h3>
          <p className="text-gray-400 mb-6">We couldn't find any orders linked to this email address.</p>
          <Link href="/shop" className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center">
            Go to Shop <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
      )}

      {orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => {
            const items = JSON.parse(order.items || "[]");
            return (
              <div key={order.id} className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                <div className="bg-gray-900/50 px-6 py-4 border-b border-gray-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Order ID</p>
                    <p className="font-mono text-white text-sm">{order.id}</p>
                  </div>
                  <div className="flex flex-wrap gap-4 sm:gap-8">
                    <div>
                      <p className="text-sm text-gray-400">Date Placed</p>
                      <p className="text-white text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Total Amount</p>
                      <p className="text-white text-sm font-bold">₱{order.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="text-white font-medium mb-4">Items Ordered</h4>
                  <ul className="space-y-3">
                    {items.map((item: any, index: number) => (
                      <li key={index} className="flex justify-between items-center text-sm">
                        <div className="flex items-center text-gray-300">
                          <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs mr-3">{item.quantity}x</span>
                          {item.name}
                        </div>
                        <span className="text-gray-400">₱{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 pt-4 border-t border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Delivery Information</p>
                      <p className="text-white mt-1">{order.address || 'Campus Meetup'}</p>
                      {order.deliveryFee > 0 && <p className="text-gray-400 mt-1">Delivery Fee: ₱{order.deliveryFee}</p>}
                    </div>
                    <div>
                      <p className="text-gray-400">Payment Method</p>
                      <p className="text-white mt-1 capitalize">{order.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
