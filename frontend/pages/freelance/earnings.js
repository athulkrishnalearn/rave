import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function FreelanceEarnings() {
  const [stats] = useState({
    totalEarnings: 2450.00,
    pendingClearance: 750.00,
    availableWithdraw: 1700.00,
    totalOrders: 12
  });

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Earnings | RAVE Freelance</title>
      </Head>

      <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-black">RAVE</Link>
          <Link href="/" className="text-sm">Logout</Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-black text-black mb-8">Earnings Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black text-white rounded-2xl p-6">
            <p className="text-gray-400 text-sm uppercase font-bold mb-2">Total Earnings</p>
            <p className="text-4xl font-black">${stats.totalEarnings.toFixed(2)}</p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-6">
            <p className="text-gray-600 text-sm uppercase font-bold mb-2">Pending Clearance</p>
            <p className="text-4xl font-black text-black">${stats.pendingClearance.toFixed(2)}</p>
          </div>
          <div className="bg-green-100 rounded-2xl p-6">
            <p className="text-green-800 text-sm uppercase font-bold mb-2">Available</p>
            <p className="text-4xl font-black text-green-900">${stats.availableWithdraw.toFixed(2)}</p>
          </div>
        </div>

        <button className="w-full md:w-auto bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition">
          Withdraw Funds
        </button>
      </main>
    </div>
  );
}
