import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Link from 'next/link';

export default function CompanyDashboard() {
  const [stats] = useState({
    totalSales: 45230.50,
    activeAgents: 12,
    totalLeads: 156,
    conversionRate: 28.5
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Company Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Sales</p>
                <p className="text-2xl font-bold text-black">${stats.totalSales.toLocaleString()}</p>
              </div>
              <div className="bg-black rounded-full p-3">
                <span className="text-white text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Agents</p>
                <p className="text-2xl font-bold text-black">{stats.activeAgents}</p>
              </div>
              <div className="bg-gray-700 rounded-full p-3">
                <span className="text-white text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Leads</p>
                <p className="text-2xl font-bold text-black">{stats.totalLeads}</p>
              </div>
              <div className="bg-gray-600 rounded-full p-3">
                <span className="text-white text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold text-black">{stats.conversionRate}%</p>
              </div>
              <div className="bg-gray-500 rounded-full p-3">
                <span className="text-white text-2xl">✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-black">Recent Sales</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { agent: 'John Doe', amount: 1250, product: 'Premium Plan', date: '2 hours ago' },
                  { agent: 'Jane Smith', amount: 890, product: 'Basic Plan', date: '5 hours ago' },
                  { agent: 'Mike Johnson', amount: 2100, product: 'Enterprise Plan', date: '1 day ago' }
                ].map((sale, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-semibold text-black">{sale.agent}</p>
                      <p className="text-sm text-gray-600">{sale.product}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-black">${sale.amount}</p>
                      <p className="text-xs text-gray-500">{sale.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-black">Top Performing Agents</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { name: 'Sarah Williams', sales: 45, conversion: 32 },
                  { name: 'David Brown', sales: 38, conversion: 28 },
                  { name: 'Emma Davis', sales: 35, conversion: 25 }
                ].map((agent, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-semibold text-black">{agent.name}</p>
                      <p className="text-sm text-gray-600">{agent.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-black">{agent.conversion}%</p>
                      <p className="text-xs text-gray-500">conversion</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold text-black mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/company/products" className="bg-black text-white p-4 rounded hover:bg-gray-800 transition text-center">
              Add Product
            </Link>
            <Link href="/company/leads" className="bg-gray-700 text-white p-4 rounded hover:bg-gray-600 transition text-center">
              Upload Leads
            </Link>
            <Link href="/company/agents" className="bg-gray-500 text-white p-4 rounded hover:bg-gray-400 transition text-center">
              Manage Agents
            </Link>
            <Link href="/company/affiliates" className="bg-gray-400 text-white p-4 rounded hover:bg-gray-300 transition text-center">
              View Affiliates
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
