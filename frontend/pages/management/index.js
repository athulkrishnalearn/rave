import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Link from 'next/link';

export default function ManagementDashboard() {
  const [stats] = useState({
    totalUsers: 1247,
    activeCreators: 456,
    activeSalesAgents: 289,
    activeCompanies: 45
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Management Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-black">{stats.totalUsers}</p>
              </div>
              <div className="bg-black rounded-full p-3">
                <span className="text-white text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Creators</p>
                <p className="text-2xl font-bold text-black">{stats.activeCreators}</p>
              </div>
              <div className="bg-gray-700 rounded-full p-3">
                <span className="text-white text-2xl">🎨</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Sales Agents</p>
                <p className="text-2xl font-bold text-black">{stats.activeSalesAgents}</p>
              </div>
              <div className="bg-gray-600 rounded-full p-3">
                <span className="text-white text-2xl">📞</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Companies</p>
                <p className="text-2xl font-bold text-black">{stats.activeCompanies}</p>
              </div>
              <div className="bg-gray-500 rounded-full p-3">
                <span className="text-white text-2xl">🏢</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Campaigns and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-black">Active Campaigns</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { name: 'Summer Sale 2026', participants: 145, endDate: '15 days left' },
                  { name: 'Top Performer Contest', participants: 89, endDate: '22 days left' },
                  { name: 'New Product Launch', participants: 67, endDate: '8 days left' }
                ].map((campaign, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-semibold text-black">{campaign.name}</p>
                      <p className="text-sm text-gray-600">{campaign.participants} participants</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">{campaign.endDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-black">Pending Approvals</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { type: 'Company Registration', name: 'TechCorp Inc.', time: '2 hours ago' },
                  { type: 'Creator Verification', name: 'John Smith', time: '5 hours ago' },
                  { type: 'Sales Agent Application', name: 'Emma Wilson', time: '1 day ago' }
                ].map((approval, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-semibold text-black">{approval.type}</p>
                      <p className="text-sm text-gray-600">{approval.name}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800">
                        Approve
                      </button>
                      <button className="bg-gray-200 text-black px-3 py-1 rounded text-sm hover:bg-gray-300">
                        Review
                      </button>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/management/campaigns" className="bg-black text-white p-4 rounded hover:bg-gray-800 transition text-center">
              Create New Campaign
            </Link>
            <Link href="/management/reports" className="bg-gray-700 text-white p-4 rounded hover:bg-gray-600 transition text-center">
              Generate Reports
            </Link>
            <Link href="/management/analytics" className="bg-gray-500 text-white p-4 rounded hover:bg-gray-400 transition text-center">
              View Analytics
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
