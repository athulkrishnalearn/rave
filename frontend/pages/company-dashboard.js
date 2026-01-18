import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function CompanyDashboard() {
  const [stats] = useState({
    activeProducts: 45,
    totalCreators: 1234,
    totalSalesAgents: 567,
    monthlyRevenue: 125000,
    pendingPayouts: 15000
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Company Dashboard | RAVE</title>
      </Head>

      {/* Navbar */}
      <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-3xl font-black tracking-tight">RAVE</Link>
            <div className="flex items-center space-x-6">
              <Link href="/company-dashboard" className="text-white font-bold">Dashboard</Link>
              <Link href="/rave-feed" className="hover:text-gray-300 transition">The Rave</Link>
              <Link href="/rave-ideas" className="hover:text-gray-300 transition">Launchpad</Link>
              <div className="w-10 h-10 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-black mb-2">Company Dashboard</h1>
          <p className="text-gray-600">Manage your products, agents, and performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:border-black transition">
            <p className="text-gray-600 text-sm font-medium mb-2">Active Products</p>
            <p className="text-4xl font-black text-black">{stats.activeProducts}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:border-black transition">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Creators</p>
            <p className="text-4xl font-black text-black">{stats.totalCreators}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:border-black transition">
            <p className="text-gray-600 text-sm font-medium mb-2">Sales Agents</p>
            <p className="text-4xl font-black text-black">{stats.totalSalesAgents}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:border-black transition">
            <p className="text-gray-600 text-sm font-medium mb-2">Monthly Revenue</p>
            <p className="text-4xl font-black text-black">${(stats.monthlyRevenue / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:border-black transition">
            <p className="text-gray-600 text-sm font-medium mb-2">Pending Payouts</p>
            <p className="text-4xl font-black text-black">${(stats.pendingPayouts / 1000).toFixed(0)}K</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/company-dashboard/products" className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition border-2 border-transparent hover:border-black group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📦</div>
            <h3 className="text-2xl font-black text-black mb-2">Products</h3>
            <p className="text-gray-600 mb-4">Manage your product catalog and commissions</p>
            <span className="text-black font-bold group-hover:underline">Manage Products →</span>
          </Link>

          <Link href="/company-dashboard/agents" className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition border-2 border-transparent hover:border-black group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👥</div>
            <h3 className="text-2xl font-black text-black mb-2">Agents</h3>
            <p className="text-gray-600 mb-4">Approve and manage sales agents</p>
            <span className="text-black font-bold group-hover:underline">View Agents →</span>
          </Link>

          <Link href="/company-dashboard/analytics" className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition border-2 border-transparent hover:border-black group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
            <h3 className="text-2xl font-black text-black mb-2">Analytics</h3>
            <p className="text-gray-600 mb-4">Track conversions and ROI</p>
            <span className="text-black font-bold group-hover:underline">View Analytics →</span>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-black text-black mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'New product added', product: 'Premium Widget Pro', time: '2 hours ago' },
              { action: 'Sales agent approved', product: 'John Smith', time: '5 hours ago' },
              { action: 'Payout processed', product: '$5,000 to creators', time: '1 day ago' },
              { action: 'Product updated', product: 'Basic Widget', time: '2 days ago' }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-4 border-b-2 border-gray-100 last:border-0">
                <div>
                  <p className="font-bold text-black">{item.action}</p>
                  <p className="text-gray-600 text-sm">{item.product}</p>
                </div>
                <p className="text-gray-500 text-sm">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
