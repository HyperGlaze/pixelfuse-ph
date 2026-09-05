import Cart from '@/components/Cart';

export default function CartPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-white">Your Cart</h1>
      </div>
      <Cart />
    </div>
  );
}
