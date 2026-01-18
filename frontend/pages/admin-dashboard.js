import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Link from 'next/link';
import api from '../lib/axios';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    raveHeads: 0,
    creators: 0,
    salesAgents: 0,
    freelancers: 0,
    companies: 0,
    activeRaveMoments: 0,
    activeRaveIdeas: 0,
    activeGigs: 0,
    totalRevenue: 0,
    activeTickets: 23,
    systemErrors: 3,
    platformGrowth: 0,
    dailyActiveUsers: 0,
    weeklyGrowth: 0
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [flaggedContent, setFlaggedContent] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    userType: 'creator'
  });
  const [broadcastData, setBroadcastData] = useState({
    title: '',
    message: '',
    userType: 'all'
  });

  const [systemAlerts] = useState([
    { type: 'warning', message: 'High memory usage on server 2', time: '10 min ago' },
    { type: 'info', message: 'Scheduled maintenance in 3 days', time: '1 hour ago' },
    { type: 'error', message: 'Payment gateway timeout', time: '2 hours ago' },
  ]);

  const [platformMetrics] = useState({
    dailyActiveUsers: 892,
    weeklyGrowth: 12.3,
    averageSessionTime: '24 min',
    conversionRate: '3.8%',
    churnRate: '1.2%',
    nps: 68
  });

  // Fetch analytics data
  useEffect(() => {
    fetchAnalytics();
    fetchUsers();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/analytics');
      if (response.data.success) {
        const data = response.data.data;
        setStats(data.stats);
        setRecentUsers(data.recentUsers.map(user => ({
          id: user._id,
          name: user.name,
          role: user.userType,
          status: user.isActive ? 'active' : 'inactive',
          joined: new Date(user.createdAt).toLocaleString(),
          avatar: getRoleAvatar(user.userType),
          email: user.email
        })));
        
        // Process flagged content
        const flagged = [];
        if (data.flaggedContent.moments) {
          data.flaggedContent.moments.forEach(moment => {
            flagged.push({
              id: moment._id,
              type: 'Rave Moment',
              author: moment.raveHead?.name || 'Unknown',
              reason: moment.flagReason || 'Flagged',
              reports: moment.flagCount || 1,
              status: moment.flagStatus || 'pending',
              contentType: 'moment'
            });
          });
        }
        if (data.flaggedContent.ideas) {
          data.flaggedContent.ideas.forEach(idea => {
            flagged.push({
              id: idea._id,
              type: 'Rave Idea',
              author: idea.founder?.name || 'Unknown',
              reason: idea.flagReason || 'Flagged',
              reports: idea.flagCount || 1,
              status: idea.flagStatus || 'pending',
              contentType: 'idea'
            });
          });
        }
        setFlaggedContent(flagged);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set some default data if API fails
      setStats({
        totalUsers: 0,
        raveHeads: 0,
        creators: 0,
        salesAgents: 0,
        freelancers: 0,
        companies: 0,
        activeRaveMoments: 0,
        activeRaveIdeas: 0,
        activeGigs: 0,
        dailyActiveUsers: 0,
        weeklyGrowth: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users?limit=100');
      if (response.data.success) {
        setAllUsers(response.data.data.map(user => ({
          id: user._id,
          name: user.name,
          role: user.userType,
          status: user.isActive ? 'active' : 'inactive',
          joined: new Date(user.createdAt).toLocaleString(),
          avatar: getRoleAvatar(user.userType),
          email: user.email
        })));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const getRoleAvatar = (role) => {
    const avatars = {
      creator: '🎨',
      sales: '💼',
      freelancer: '💻',
      company: '🏢',
      admin: '👑',
      support: '🎧'
    };
    return avatars[role] || '👤';
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/staff', newUser);
      if (response.data.success) {
        alert('User added successfully!');
        setShowAddUserModal(false);
        setNewUser({ name: '', email: '', phone: '', password: '', userType: 'creator' });
        fetchUsers();
        fetchAnalytics();
      }
    } catch (error) {
      alert('Error adding user: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleBanUser = async (userId) => {
    if (!confirm('Are you sure you want to ban this user?')) return;
    
    try {
      const response = await api.post(`/admin/users/${userId}/ban`, {
        reason: 'Violating platform rules',
        duration: 30 // 30 days
      });
      if (response.data.success) {
        alert('User banned successfully!');
        fetchUsers();
        fetchAnalytics();
      }
    } catch (error) {
      alert('Error banning user: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      const response = await api.post(`/admin/users/${userId}/unban`);
      if (response.data.success) {
        alert('User unbanned successfully!');
        fetchUsers();
        fetchAnalytics();
      }
    } catch (error) {
      alert('Error unbanning user: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleModerateContent = async (contentType, contentId, action) => {
    try {
      const response = await api.post(`/admin/moderate/${contentType}/${contentId}`, {
        action,
        reason: action === 'remove' ? 'Violates platform guidelines' : ''
      });
      if (response.data.success) {
        alert(`Content ${action}d successfully!`);
        fetchAnalytics();
      }
    } catch (error) {
      alert('Error moderating content: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/broadcast', broadcastData);
      if (response.data.success) {
        alert(`Broadcast sent to ${response.data.data.recipientCount} users!`);
        setShowBroadcastModal(false);
        setBroadcastData({ title: '', message: '', userType: 'all' });
      }
    } catch (error) {
      alert('Error sending broadcast: ' + (error.response?.data?.message || error.message));
    }
  };

  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Platform Title */}
        <div className="bg-gradient-to-r from-black via-gray-900 to-black rounded-2xl p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black mb-2">⚡ RAVE Admin Control</h1>
              <p className="text-gray-300">Platform Management & System Oversight</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total Rave Heads</div>
              <div className="mt-2 inline-block bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                ↑ {stats.platformGrowth}% Growth
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'users', label: 'Users', icon: '👥' },
              { id: 'content', label: 'Content', icon: '📝' },
              { id: 'reports', label: 'Reports', icon: '🚨' },
              { id: 'system', label: 'System', icon: '⚙️' },
              { id: 'analytics', label: 'Analytics', icon: '📈' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-bold whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-b-4 border-black text-black bg-gray-50'
                    : 'text-gray-500 hover:text-black hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:shadow-lg transition-all hover:border-black group">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform">🎭</div>
                  <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold">CORE</span>
                </div>
                <div className="text-3xl font-black text-black mb-1">{stats.raveHeads}</div>
                <div className="text-sm text-gray-600">Rave Heads (All Users)</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:shadow-lg transition-all hover:border-black group">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform">🎨</div>
                  <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold">CREATORS</span>
                </div>
                <div className="text-3xl font-black text-black mb-1">{stats.creators}</div>
                <div className="text-sm text-gray-600">Active Creators</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:shadow-lg transition-all hover:border-black group">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform">💼</div>
                  <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-bold">SALES</span>
                </div>
                <div className="text-3xl font-black text-black mb-1">{stats.salesAgents}</div>
                <div className="text-sm text-gray-600">Sales Agents</div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:shadow-lg transition-all hover:border-black group">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform">💻</div>
                  <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-bold">FREELANCE</span>
                </div>
                <div className="text-3xl font-black text-black mb-1">{stats.freelancers}</div>
                <div className="text-sm text-gray-600">Freelancers</div>
              </div>
            </div>

            {/* Platform Activity Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-black">Rave Feed Activity</h3>
                  <span className="text-2xl">🗣️</span>
                </div>
                <div className="text-4xl font-black text-black mb-2">{stats.activeRaveMoments}</div>
                <div className="text-sm text-gray-600 mb-4">Active Rave Moments</div>
                <Link href="/rave-feed" className="text-black font-bold text-sm hover:underline">
                  View Feed →
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-black">Startup Launchpad</h3>
                  <span className="text-2xl">🚀</span>
                </div>
                <div className="text-4xl font-black text-black mb-2">{stats.activeRaveIdeas}</div>
                <div className="text-sm text-gray-600 mb-4">Active Rave Ideas</div>
                <Link href="/rave-ideas" className="text-black font-bold text-sm hover:underline">
                  View Launchpad →
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-black">Freelance Marketplace</h3>
                  <span className="text-2xl">💼</span>
                </div>
                <div className="text-4xl font-black text-black mb-2">{stats.activeGigs}</div>
                <div className="text-sm text-gray-600 mb-4">Active Gigs</div>
                <Link href="/freelance" className="text-black font-bold text-sm hover:underline">
                  View Marketplace →
                </Link>
              </div>
            </div>

            {/* System Health & Recent Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Health */}
              <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-black text-black">System Health</h2>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">All Systems Online</span>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[
                      { service: 'API Server', status: 'Online', uptime: '99.9%', color: 'green' },
                      { service: 'Database (MongoDB)', status: 'Online', uptime: '100%', color: 'green' },
                      { service: 'Redis Cache', status: 'Online', uptime: '99.8%', color: 'green' },
                      { service: 'Email Service', status: 'Online', uptime: '99.5%', color: 'green' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full bg-${item.color}-500 mr-3 animate-pulse`}></div>
                          <div>
                            <p className="font-bold text-black">{item.service}</p>
                            <p className="text-sm text-gray-600">{item.status}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-black">{item.uptime}</p>
                          <p className="text-xs text-gray-500">uptime</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-black text-black">Recent Signups</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentUsers.map(user => (
                      <div key={user.id} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0">
                        <div className="flex items-center">
                          <div className="text-3xl mr-3">{user.avatar}</div>
                          <div>
                            <p className="font-bold text-black">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {user.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{user.joined}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* System Alerts */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-black text-black">System Alerts</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {systemAlerts.map((alert, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border-2 flex items-start ${
                      alert.type === 'error' ? 'bg-red-50 border-red-200' :
                      alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <span className="text-2xl mr-3">
                        {alert.type === 'error' ? '⚠️' : alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                      </span>
                      <div className="flex-1">
                        <p className="font-bold text-black">{alert.message}</p>
                        <p className="text-sm text-gray-600 mt-1">{alert.time}</p>
                      </div>
                      <button className="text-black font-bold text-sm hover:underline">Resolve</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'black' },
                { label: 'Creators', value: stats.creators, icon: '🎨', color: 'gray-800' },
                { label: 'Sales Agents', value: stats.salesAgents, icon: '💼', color: 'gray-700' },
                { label: 'Freelancers', value: stats.freelancers, icon: '💻', color: 'gray-600' },
                { label: 'Companies', value: stats.companies, icon: '🏢', color: 'gray-500' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 text-center hover:shadow-lg transition-all">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-black text-black">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* User Management */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-black text-black">User Management</h2>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-full focus:border-black outline-none"
                  />
                  <button 
                    onClick={() => setShowAddUserModal(true)}
                    className="bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition"
                  >
                    + Add User
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">User</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Joined</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{user.avatar}</span>
                            <div>
                              <div className="font-bold text-black">{user.name}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 capitalize">{user.role}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{user.joined}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link href={`/admin-dashboard/users/${user.id}`} className="text-black font-bold text-sm hover:underline">
                              View
                            </Link>
                            {user.status === 'active' ? (
                              <button 
                                onClick={() => handleBanUser(user.id)}
                                className="text-red-600 font-bold text-sm hover:underline"
                              >
                                Ban
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleUnbanUser(user.id)}
                                className="text-green-600 font-bold text-sm hover:underline"
                              >
                                Unban
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-black text-black">Content Moderation Queue</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {flaggedContent.map(content => (
                    <div key={content.id} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold">{content.type}</span>
                            <span className="text-red-600 font-bold text-sm">{content.reports} reports</span>
                          </div>
                          <p className="font-bold text-black mb-1">Author: {content.author}</p>
                          <p className="text-sm text-gray-600 mb-2">Reason: {content.reason}</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            content.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {content.status}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleModerateContent(content.contentType, content.id, 'approve')}
                            className="bg-green-500 text-white px-4 py-2 rounded-full font-bold hover:bg-green-600 transition"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleModerateContent(content.contentType, content.id, 'remove')}
                            className="bg-red-500 text-white px-4 py-2 rounded-full font-bold hover:bg-red-600 transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-8 text-center">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-2xl font-black text-black mb-2">Analytics & Reports</h3>
              <p className="text-gray-600 mb-6">Generate comprehensive reports for platform performance</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <button className="bg-black text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-800 transition">
                  User Report
                </button>
                <button className="bg-gray-800 text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-700 transition">
                  Revenue Report
                </button>
                <button className="bg-gray-700 text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-600 transition">
                  Activity Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-black text-black">System Configuration</h2>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { setting: 'Maintenance Mode', value: 'Off', toggle: true },
                    { setting: 'User Registration', value: 'Open', toggle: true },
                    { setting: 'Email Notifications', value: 'Enabled', toggle: true },
                    { setting: 'Auto Backup', value: 'Daily', toggle: false },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-bold text-black">{item.setting}</p>
                        <p className="text-sm text-gray-600">{item.value}</p>
                      </div>
                      {item.toggle && (
                        <button className="bg-black text-white px-4 py-2 rounded-full font-bold hover:bg-gray-800 transition text-sm">
                          Toggle
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-black text-black">Database Stats</h2>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { label: 'Total Records', value: '45,892' },
                    { label: 'Database Size', value: '2.4 GB' },
                    { label: 'Cache Hit Rate', value: '94.2%' },
                    { label: 'Avg Query Time', value: '12ms' },
                  ].map((stat, idx) => (
                    <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0">
                      <p className="text-gray-600">{stat.label}</p>
                      <p className="font-black text-black text-xl">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Daily Active Users', value: platformMetrics.dailyActiveUsers, suffix: '' },
                { label: 'Weekly Growth', value: platformMetrics.weeklyGrowth, suffix: '%' },
                { label: 'Avg Session Time', value: platformMetrics.averageSessionTime, suffix: '' },
                { label: 'Conversion Rate', value: platformMetrics.conversionRate, suffix: '' },
                { label: 'Churn Rate', value: platformMetrics.churnRate, suffix: '' },
                { label: 'Net Promoter Score', value: platformMetrics.nps, suffix: '' },
              ].map((metric, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:shadow-lg transition-all">
                  <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
                  <p className="text-4xl font-black text-black">
                    {metric.value}{metric.suffix}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-8 text-center">
              <div className="text-6xl mb-4">📉</div>
              <h3 className="text-2xl font-black text-black mb-2">Detailed Analytics</h3>
              <p className="text-gray-600 mb-6">Comprehensive platform metrics and insights coming soon</p>
              <button className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition">
                View Full Analytics
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions Panel */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-8">
          <h2 className="text-2xl font-black text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="bg-white/10 hover:bg-white/20 text-white p-6 rounded-xl font-bold transition-all hover:scale-105 backdrop-blur-sm"
            >
              <div className="text-3xl mb-2">📣</div>
              <div className="text-sm">Broadcast Message</div>
            </button>
            <button
              onClick={() => alert('Export functionality coming soon!')}
              className="bg-white/10 hover:bg-white/20 text-white p-6 rounded-xl font-bold transition-all hover:scale-105 backdrop-blur-sm"
            >
              <div className="text-3xl mb-2">📥</div>
              <div className="text-sm">Export Data</div>
            </button>
            <button
              onClick={() => alert('Backup initiated!')}
              className="bg-white/10 hover:bg-white/20 text-white p-6 rounded-xl font-bold transition-all hover:scale-105 backdrop-blur-sm"
            >
              <div className="text-3xl mb-2">💾</div>
              <div className="text-sm">Run Backup</div>
            </button>
            <button
              onClick={() => alert('Viewing logs...')}
              className="bg-white/10 hover:bg-white/20 text-white p-6 rounded-xl font-bold transition-all hover:scale-105 backdrop-blur-sm"
            >
              <div className="text-3xl mb-2">📄</div>
              <div className="text-sm">View Logs</div>
            </button>
            <button
              onClick={() => alert('Role management coming soon!')}
              className="bg-white/10 hover:bg-white/20 text-white p-6 rounded-xl font-bold transition-all hover:scale-105 backdrop-blur-sm"
            >
              <div className="text-3xl mb-2">🔑</div>
              <div className="text-sm">Manage Roles</div>
            </button>
            <button
              onClick={() => alert('API keys management coming soon!')}
              className="bg-white/10 hover:bg-white/20 text-white p-6 rounded-xl font-bold transition-all hover:scale-105 backdrop-blur-sm"
            >
              <div className="text-3xl mb-2">🔐</div>
              <div className="text-sm">API Keys</div>
            </button>
            <button
              onClick={() => alert('Webhooks management coming soon!')}
              className="bg-white/10 hover:bg-white/20 text-white p-6 rounded-xl font-bold transition-all hover:scale-105 backdrop-blur-sm"
            >
              <div className="text-3xl mb-2">🔗</div>
              <div className="text-sm">Webhooks</div>
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className="bg-white/10 hover:bg-white/20 text-white p-6 rounded-xl font-bold transition-all hover:scale-105 backdrop-blur-sm"
            >
              <div className="text-3xl mb-2">⚙️</div>
              <div className="text-sm">Settings</div>
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddUserModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-black text-black mb-6">Add New User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  required
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">User Type</label>
                <select
                  value={newUser.userType}
                  onChange={(e) => setNewUser({...newUser, userType: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black outline-none"
                >
                  <option value="creator">Creator</option>
                  <option value="sales">Sales Agent</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="admin">Admin</option>
                  <option value="support">Support</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition"
                >
                  Add User
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 bg-gray-200 text-black py-3 rounded-xl font-bold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowBroadcastModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-black text-black mb-6">📣 Broadcast Message</h3>
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={broadcastData.title}
                  onChange={(e) => setBroadcastData({...broadcastData, title: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black outline-none"
                  placeholder="Announcement title"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea
                  required
                  value={broadcastData.message}
                  onChange={(e) => setBroadcastData({...broadcastData, message: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black outline-none"
                  rows="5"
                  placeholder="Type your message here..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Send To</label>
                <select
                  value={broadcastData.userType}
                  onChange={(e) => setBroadcastData({...broadcastData, userType: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black outline-none"
                >
                  <option value="all">All Users</option>
                  <option value="creator">Creators Only</option>
                  <option value="sales">Sales Agents Only</option>
                  <option value="freelancer">Freelancers Only</option>
                  <option value="company">Companies Only</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition"
                >
                  Send Broadcast
                </button>
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="flex-1 bg-gray-200 text-black py-3 rounded-xl font-bold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
