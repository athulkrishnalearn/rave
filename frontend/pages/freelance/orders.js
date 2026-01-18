import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function FreelanceOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock orders data
    setOrders([
      {
        id: 1,
        gigTitle: 'Modern Logo Design',
        client: 'John Startup',
        package: 'Premium',
        price: 250,
        status: 'in_progress',
        deadline: '2026-01-25',
        createdAt: '2026-01-15'
      },
      {
        id: 2,
        gigTitle: 'Next.js Website Development',
        client: 'Tech Corp',
        package: 'Standard',
        price: 500,
        status: 'delivered',
        deadline: '2026-01-20',
        createdAt: '2026-01-10'
      }
    ]);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      delivered: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      disputed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>My Orders | RAVE Freelance</title>
      </Head>

      {/* Navbar */}
      <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-black tracking-tight">RAVE</Link>
          <div className="flex items-center space-x-6">
            <Link href="/freelance" className="hover:text-gray-300 transition">Browse Gigs</Link>
            <Link href="/freelance/orders" className="hover:text-gray-300 transition font-bold">My Orders</Link>
            <Link href="/" className="text-sm">Logout</Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-black mb-2">My Orders</h1>
          <p className="text-gray-600">Track all your freelance orders and deliveries</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-black mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">Start browsing gigs to get your first order</p>
            <Link href="/freelance" className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition">
              Browse Gigs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-black transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-black mb-1">{order.gigTitle}</h3>
                    <p className="text-gray-600 text-sm">Client: {order.client}</p>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Package</p>
                    <p className="text-black font-bold">{order.package}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Price</p>
                    <p className="text-black font-bold">${order.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Deadline</p>
                    <p className="text-black font-bold">{new Date(order.deadline).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Ordered</p>
                    <p className="text-black font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-black text-white py-2 rounded-full font-bold hover:bg-gray-800 transition">
                    View Details
                  </button>
                  {order.status === 'in_progress' && (
                    <button className="flex-1 bg-white text-black border-2 border-black py-2 rounded-full font-bold hover:bg-gray-50 transition">
                      Deliver Work
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
