import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

export default function SalesAgentDashboard() {
  const stats = [
    { label: 'Total Leads', value: '48', change: '+12%', icon: '👥' },
    { label: 'Conversions', value: '23', change: '+8%', icon: '✅' },
    { label: 'This Month Earnings', value: '$2,450', change: '+15%', icon: '💰' },
    { label: 'Test Score', value: '92%', change: '+5%', icon: '📝' }
  ];

  const recentLeads = [
    { name: 'Robert Johnson', company: 'Tech Innovations', status: 'contacted', value: '$200' },
    { name: 'Emily Davis', company: 'Fashion Forward', status: 'new', value: '$150' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Sales Agent Dashboard</h1>
          <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">
            Take Weekly Test
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-sm text-gray-600">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-black">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-black">Recent Leads</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentLeads.map((lead, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                  <div>
                    <h3 className="font-medium text-black">{lead.name}</h3>
                    <p className="text-sm text-gray-600">{lead.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-black">{lead.value}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      lead.status === 'contacted' ? 'bg-gray-200 text-gray-700' : 'bg-black text-white'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
