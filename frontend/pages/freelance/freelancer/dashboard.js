import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '../../../components/DashboardLayout';

export default function FreelancerDashboard() {
  const user = { name: 'Freelancer Alex', userType: 'freelancer' };
  
  const stats = [
    { name: 'Active Orders', value: '3', icon: '📋' },
    { name: 'Total Earnings', value: '$1,240', icon: '💰' },
    { name: 'Average Rating', value: '4.9', icon: '⭐' },
    { name: 'Response Rate', value: '98%', icon: '⚡' }
  ];

  return (
    <DashboardLayout user={user}>
      <Head>
        <title>Freelancer Dashboard | RAVE</title>
      </Head>

      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-black">Welcome back, Alex!</h1>
          <p className="text-gray-500">Here's what's happening with your gigs today.</p>
        </div>
        <Link href="/freelance/gigs/create" className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition shadow-lg">
          + Create New Gig
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{stat.name}</p>
            <p className="text-3xl font-black text-black mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Active Orders */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-black text-xl text-black">Active Orders</h2>
            <Link href="/freelance/orders" className="text-sm font-bold text-gray-400 hover:text-black transition">View All</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {[1, 2].map((order) => (
              <div key={order} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">📦</div>
                  <div>
                    <p className="font-bold text-black">Monochrome Logo Design</p>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Client: TechCorp • Due in 2 days</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-black">$150.00</p>
                  <span className="inline-block px-3 py-1 bg-black text-white text-[10px] font-bold uppercase rounded-full">In Progress</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-black p-8 rounded-2xl shadow-xl text-white">
            <h2 className="font-black text-xl mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition">
                Withdraw Earnings
              </button>
              <button className="w-full border-2 border-white text-white py-3 rounded-xl font-bold hover:bg-white hover:text-black transition">
                Manage Profile
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-black text-lg text-black mb-4">Platform Updates</h2>
            <div className="space-y-4 text-sm">
              <p className="text-gray-600"><strong className="text-black">New Feature:</strong> You can now add video previews to your gigs!</p>
              <p className="text-gray-600"><strong className="text-black">Reminder:</strong> Response time affects your ranking.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
