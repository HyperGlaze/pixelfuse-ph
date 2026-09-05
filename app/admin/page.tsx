"use client";

import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  
  // Data states
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  // Product Form states
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });
  const [productImage, setProductImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchOrders();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid password");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productImage) {
      alert("Please select an image");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // 1. Upload image
      const fileData = new FormData();
      fileData.append("file", productImage);
      
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: fileData,
      });
      
      if (!uploadRes.ok) throw new Error("Image upload failed");
      const { url } = await uploadRes.json();
      
      // 2. Create product
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newProduct, image: url }),
      });
      
      if (res.ok) {
        alert("Product added successfully!");
        setNewProduct({ name: "", price: "", description: "", category: "" });
        setProductImage(null);
        fetchProducts();
      } else {
        alert("Error adding product");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        alert("Product deleted!");
        fetchProducts();
      } else {
        alert("Failed to delete product.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error occurred while deleting the product.");
    }
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        fetchOrders();
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'Accepted': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'Shipping': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'Done': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Declined': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-gray-800 rounded-lg shadow-xl border border-gray-700 text-center">
        <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-white mb-8">Admin Dashboard</h1>
      
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "products" 
              ? "bg-purple-600 text-white" 
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "orders" 
              ? "bg-purple-600 text-white" 
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          Orders
        </button>
      </div>

      {activeTab === "products" && (
        <div className="space-y-8">
          {/* Add Product Form */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProductImage(e.target.files ? e.target.files[0] : null)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-1.5 text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-purple-600 file:text-white"
                required
              />
              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white md:col-span-2"
                rows={3}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors md:col-span-2 ${isSubmitting ? 'opacity-70' : ''}`}
              >
                {isSubmitting ? 'Uploading & Adding...' : 'Add Product'}
              </button>
            </form>
          </div>

          {/* Products Table */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 overflow-x-auto">
            <h2 className="text-xl font-bold text-white mb-4">Existing Products</h2>
            <table className="w-full text-left text-gray-400">
              <thead className="text-xs text-gray-400 uppercase bg-gray-900">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-4 text-center">No products found.</td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="border-b border-gray-700">
                      <td className="px-4 py-3">
                        <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded bg-gray-700" />
                      </td>
                      <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                      <td className="px-4 py-3">{p.category}</td>
                      <td className="px-4 py-3">₱{p.price}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-red-400 hover:text-red-300 font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 overflow-x-auto">
          <h2 className="text-xl font-bold text-white mb-4">Customer Orders</h2>
          <table className="w-full text-left text-gray-400">
            <thead className="text-xs text-gray-400 uppercase bg-gray-900">
              <tr>
                <th className="px-4 py-3">Date / ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Address & Fee</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total & Payment</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center">No orders yet.</td>
                </tr>
              ) : (
                orders.map((o) => {
                  const itemsList = JSON.parse(o.items || "[]");
                  return (
                    <tr key={o.id} className="border-b border-gray-700 text-sm">
                      <td className="px-4 py-3">
                        <div className="text-white mb-1">{new Date(o.createdAt).toLocaleDateString()}</div>
                        <div className="text-xs font-mono text-gray-500">{o.id.substring(0, 8)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{o.customerName}</div>
                        <div className="text-xs">{o.customerEmail}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="max-w-[150px] truncate" title={o.address || 'N/A'}>{o.address || 'N/A'}</div>
                        {o.deliveryFee > 0 && <div className="text-xs text-purple-400 mt-1">Fee: ₱{o.deliveryFee}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <ul className="list-disc list-inside">
                          {itemsList.map((item: any, idx: number) => (
                            <li key={idx} className="truncate max-w-[150px]">{item.name} (x{item.quantity})</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-purple-400 font-bold">₱{o.totalAmount}</div>
                        <div className="capitalize text-xs mt-1">{o.paymentMethod}</div>
                        {o.proofOfPayment && (
                          <a href={o.proofOfPayment} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline text-xs mt-1 block">
                            View Proof
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          className={`px-2 py-1.5 rounded text-xs font-medium border appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500 ${getStatusColor(o.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Shipping">Shipping</option>
                          <option value="Done">Done</option>
                          <option value="Declined">Declined</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
