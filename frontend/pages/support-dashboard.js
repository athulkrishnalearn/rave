import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Link from 'next/link';

export default function SupportDashboard() {
  const [stats] = useState({
    openTickets: 23,
    resolvedToday: 15,
    avgResponseTime: '2.5h',
    satisfaction: 94
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Support Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Open Tickets</p>
                <p className="text-2xl font-bold text-black">{stats.openTickets}</p>
              </div>
              <div className="bg-black rounded-full p-3">
                <span className="text-white text-2xl">🎫</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Resolved Today</p>
                <p className="text-2xl font-bold text-black">{stats.resolvedToday}</p>
              </div>
              <div className="bg-gray-700 rounded-full p-3">
                <span className="text-white text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Response Time</p>
                <p className="text-2xl font-bold text-black">{stats.avgResponseTime}</p>
              </div>
              <div className="bg-gray-600 rounded-full p-3">
                <span className="text-white text-2xl">⏱️</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Satisfaction Rate</p>
                <p className="text-2xl font-bold text-black">{stats.satisfaction}%</p>
              </div>
              <div className="bg-gray-500 rounded-full p-3">
                <span className="text-white text-2xl">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tickets and Priority Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-black">Recent Tickets</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { id: '#TKT-1045', subject: 'Payment issue', user: 'John Smith', time: '5 min ago', priority: 'High' },
                  { id: '#TKT-1044', subject: 'Account verification', user: 'Emma Wilson', time: '15 min ago', priority: 'Medium' },
                  { id: '#TKT-1043', subject: 'Link not working', user: 'Mike Johnson', time: '30 min ago', priority: 'Low' }
                ].map((ticket, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-semibold text-black">{ticket.id} - {ticket.subject}</p>
                      <p className="text-sm text-gray-600">{ticket.user}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        ticket.priority === 'High' ? 'bg-gray-800 text-white' :
                        ticket.priority === 'Medium' ? 'bg-gray-400 text-white' :
                        'bg-gray-200 text-black'
                      }`}>
                        {ticket.priority}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{ticket.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-black">Ticket Categories</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { category: 'Technical Issues', count: 12, percentage: 40 },
                  { category: 'Billing & Payments', count: 8, percentage: 30 },
                  { category: 'Account Issues', count: 6, percentage: 20 },
                  { category: 'General Inquiry', count: 3, percentage: 10 }
                ].map((item, idx) => (
                  <div key={idx} className="pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-black">{item.category}</p>
                      <p className="text-sm text-gray-600">{item.count} tickets</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-black h-2 rounded-full" 
                        style={{width: `${item.percentage}%`}}
                      ></div>
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
            <Link href="/support-dashboard/all-tickets" className="bg-black text-white p-4 rounded hover:bg-gray-800 transition text-center">
              View All Tickets
            </Link>
            <Link href="/support-dashboard/knowledge" className="bg-gray-700 text-white p-4 rounded hover:bg-gray-600 transition text-center">
              Knowledge Base
            </Link>
            <button onClick={() => alert('Report generation coming soon!')} className="bg-gray-500 text-white p-4 rounded hover:bg-gray-400 transition">
              Create Report
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
