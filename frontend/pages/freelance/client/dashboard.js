import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '../../../components/DashboardLayout';

export default function ClientDashboard() {
  const user = { name: 'Client Sarah', userType: 'client' };
  
  const stats = [
    { name: 'Active Orders', value: '2', icon: '📋' },
    { name: 'Total Spent', value: '$3,450', icon: '💳' },
    { name: 'Open Jobs', value: '1', icon: '🎯' },
    { name: 'Unread Messages', value: '5', icon: '💬' }
  ];

  return (
    <DashboardLayout user={user}>
      <Head>
        <title>Client Dashboard | RAVE</title>
      </Head>

      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-black">Welcome back, Sarah!</h1>
          <p className="text-gray-500">Track your projects and find new talent.</p>
        </div>
        <div className="flex space-x-4">
          <Link href="/freelance/jobs/post" className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition shadow-lg">
            Post a Job
          </Link>
          <Link href="/freelance/gigs" className="bg-white text-black px-6 py-3 rounded-full font-bold border-2 border-black hover:bg-black hover:text-white transition">
            Browse Gigs
          </Link>
        </div>
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
            <h2 className="font-black text-xl text-black">My Orders</h2>
            <Link href="/freelance/client/orders" className="text-sm font-bold text-gray-400 hover:text-black transition">View All</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {[1, 2].map((order) => (
              <div key={order} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">⚡</div>
                  <div>
                    <p className="font-bold text-black">SEO Optimization Campaign</p>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Freelancer: SEO Pro • Delivery in 4 days</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-black">$450.00</p>
                  <span className="inline-block px-3 py-1 bg-black text-white text-[10px] font-bold uppercase rounded-full">In Escrow</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Help / Support */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-8 rounded-2xl border border-dashed border-gray-300">
            <h2 className="font-black text-xl mb-4 text-black">Need a Custom Quote?</h2>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              If you can't find what you're looking for, post a job and let the experts come to you.
            </p>
            <button className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg">
              Create Job Post
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-black text-lg text-black mb-4">Escrow Protection</h2>
            <div className="space-y-4 text-sm">
              <p className="text-gray-600">Your payments are held securely and only released when you approve the work.</p>
              <Link href="/support" className="text-black font-bold hover:underline">Learn more about disputes →</Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
