import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function ManagementDashboard() {
  const [stats] = useState({
    activeCompanies: 28,
    activeCampaigns: 12,
    totalRevenue: 450000,
    totalPayouts: 85000,
    platformGrowth: 23.5
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Management Dashboard | RAVE</title>
      </Head>

      {/* Navbar */}
      <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-3xl font-black tracking-tight">RAVE</Link>
            <div className="flex items-center space-x-6">
              <Link href="/management-dashboard" className="text-white font-bold">Dashboard</Link>
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
          <h1 className="text-4xl font-black text-black mb-2">Management Dashboard</h1>
          <p className="text-gray-600">Oversee platform operations and campaigns</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:border-black transition">
            <p className="text-gray-600 text-sm font-medium mb-2">Active Companies</p>
            <p className="text-4xl font-black text-black">{stats.activeCompanies}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:border-black transition">
            <p className="text-gray-600 text-sm font-medium mb-2">Active Campaigns</p>
            <p className="text-4xl font-black text-black">{stats.activeCampaigns}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:border-black transition">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Revenue</p>
            <p className="text-4xl font-black text-black">${(stats.totalRevenue / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:border-black transition">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Payouts</p>
            <p className="text-4xl font-black text-black">${(stats.totalPayouts / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:border-black transition">
            <p className="text-gray-600 text-sm font-medium mb-2">Platform Growth</p>
            <p className="text-4xl font-black text-green-600">+{stats.platformGrowth}%</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/management-dashboard/campaigns" className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition border-2 border-transparent hover:border-black group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎯</div>
            <h3 className="text-2xl font-black text-black mb-2">Campaigns</h3>
            <p className="text-gray-600 mb-4">Create and manage marketing campaigns</p>
            <span className="text-black font-bold group-hover:underline">Manage Campaigns →</span>
          </Link>

          <Link href="/management-dashboard/companies" className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition border-2 border-transparent hover:border-black group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏢</div>
            <h3 className="text-2xl font-black text-black mb-2">Companies</h3>
            <p className="text-gray-600 mb-4">Oversee company accounts and partnerships</p>
            <span className="text-black font-bold group-hover:underline">View Companies →</span>
          </Link>

          <Link href="/management-dashboard/reports" className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition border-2 border-transparent hover:border-black group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📈</div>
            <h3 className="text-2xl font-black text-black mb-2">Reports</h3>
            <p className="text-gray-600 mb-4">View detailed performance reports</p>
            <span className="text-black font-bold group-hover:underline">View Reports →</span>
          </Link>
        </div>

        {/* Recent Campaigns */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-black text-black mb-6">Recent Campaigns</h2>
          <div className="space-y-4">
            {[
              { name: 'Summer Sale 2024', company: 'TechCorp', status: 'Active', budget: '$50,000' },
              { name: 'Product Launch Q1', company: 'E-commerce Plus', status: 'Active', budget: '$75,000' },
              { name: 'Brand Awareness', company: 'Fashion Co', status: 'Completed', budget: '$30,000' }
            ].map((campaign, idx) => (
              <div key={idx} className="flex justify-between items-center py-4 border-b-2 border-gray-100 last:border-0">
                <div>
                  <p className="font-bold text-black">{campaign.name}</p>
                  <p className="text-gray-600 text-sm">{campaign.company}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status}
                  </span>
                  <p className="text-gray-600 font-bold">{campaign.budget}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-black text-black mb-4">Top Performing Companies</h3>
            <div className="space-y-3">
              {[
                { name: 'TechCorp', revenue: '$125K', growth: '+15%' },
                { name: 'E-commerce Plus', revenue: '$98K', growth: '+22%' },
                { name: 'Fashion Co', revenue: '$87K', growth: '+18%' }
              ].map((company, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="font-bold text-black">{company.name}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-600">{company.revenue}</span>
                    <span className="text-green-600 font-bold">{company.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-black text-black mb-4">Platform Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Creators</span>
                <span className="font-black text-black">12,456</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Sales Agents</span>
                <span className="font-black text-black">3,789</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Freelancers</span>
                <span className="font-black text-black">5,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Transactions</span>
                <span className="font-black text-black">45,678</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
