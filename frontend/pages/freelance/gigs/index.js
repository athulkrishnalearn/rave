import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function MyGigs() {
  const [gigs] = useState([
    {
      id: 1,
      title: 'I will design a modern monochrome logo',
      category: 'Design',
      orders: 24,
      rating: 4.9,
      price: 50,
      status: 'active',
      image: '🎨'
    },
    {
      id: 2,
      title: 'I will build a Next.js website',
      category: 'Development',
      orders: 15,
      rating: 5.0,
      price: 200,
      status: 'active',
      image: '💻'
    }
  ]);

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>My Gigs | RAVE Freelance</title>
      </Head>

      <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-black">RAVE</Link>
          <div className="flex items-center space-x-6">
            <Link href="/freelance" className="hover:text-gray-300 transition">Browse</Link>
            <Link href="/freelance/gigs" className="hover:text-gray-300 transition font-bold">My Gigs</Link>
            <Link href="/freelance/orders" className="hover:text-gray-300 transition">Orders</Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black text-black mb-2">My Gigs</h1>
            <p className="text-gray-600">Manage your service offerings</p>
          </div>
          <Link
            href="/freelance/gigs/create"
            className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition"
          >
            + Create New Gig
          </Link>
        </div>

        {gigs.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-black mb-2">No Gigs Yet</h3>
            <p className="text-gray-600 mb-6">Create your first gig to start earning</p>
            <Link
              href="/freelance/gigs/create"
              className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition"
            >
              Create Your First Gig
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <div key={gig.id} className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-black transition-all duration-300 group">
                <div className="h-48 bg-gray-50 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-300">
                  {gig.image}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{gig.category}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      gig.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {gig.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-black mb-4 leading-tight">
                    {gig.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="font-black text-black">{gig.rating}</span>
                      <span className="text-gray-400 ml-1">({gig.orders})</span>
                    </div>
                    <span className="text-xl font-black text-black">${gig.price}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/freelance/gigs/${gig.id}`}
                      className="bg-black text-white text-center py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition"
                    >
                      View
                    </Link>
                    <button className="bg-white text-black border-2 border-black text-center py-2 rounded-full text-sm font-bold hover:bg-gray-50 transition">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
