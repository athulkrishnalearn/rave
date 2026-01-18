import { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '../components/DashboardLayout';

export default function CreatorDashboard({ user, logout }) {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalClicks: 0,
    totalConversions: 0,
    affiliateLinksCount: 0
  });
  const [recentLinks, setRecentLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use mock data since API isn't fully connected yet
    setStats({
      totalEarnings: 500.00,
      totalClicks: 1234,
      totalConversions: 45,
      affiliateLinksCount: 8
    });
    setRecentLinks([
      { 
        productId: { name: 'Premium Software Suite' },
        socialPlatform: 'Instagram',
        clicks: 245,
        conversions: 12,
        earnings: 180.00,
        createdAt: new Date()
      },
      { 
        productId: { name: 'Designer Handbag Collection' },
        socialPlatform: 'TikTok',
        clicks: 189,
        conversions: 8,
        earnings: 320.00,
        createdAt: new Date()
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <DashboardLayout user={user} logout={logout}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} logout={logout}>
      <Head>
        <title>Creator Dashboard | Rave</title>
        <meta name="description" content="Your Rave creator dashboard" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-black">Creator Dashboard</h1>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-black rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Earnings</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-black">${stats.totalEarnings?.toFixed(2) || '0.00'}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gray-700 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Clicks</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-black">{stats.totalClicks || 0}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gray-600 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Conversions</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-black">{stats.totalConversions || 0}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gray-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Affiliate Links</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-black">{stats.affiliateLinksCount || 0}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Affiliate Links */}
        <div className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Affiliate Links</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Your recently created affiliate links</p>
              </div>
              <ul className="divide-y divide-gray-200">
                {recentLinks.length > 0 ? (
                  recentLinks.map((link, index) => (
                    <li key={index} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-black truncate">
                          {link.productId?.name || 'Product Name'}
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-800">
                            {link.socialPlatform}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between text-sm text-gray-500">
                        <div className="flex space-x-4">
                          <span>Clicks: {link.clicks}</span>
                          <span>Conversions: {link.conversions}</span>
                          <span>Earnings: ${link.earnings?.toFixed(2)}</span>
                        </div>
                        <div className="truncate text-right">
                          {new Date(link.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-5 sm:px-6 text-center">
                    <p className="text-gray-500">No affiliate links yet. Create your first link!</p>
                  </li>
                )}
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-black">Quick Actions</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Get started with Rave</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <a
                    href="/creator-dashboard/links"
                    className="flex items-center p-4 text-base font-medium text-black bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <svg className="w-6 h-6 mr-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Create Link
                  </a>
                  <a
                    href="/creator-dashboard/products"
                    className="flex items-center p-4 text-base font-medium text-black bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <svg className="w-6 h-6 mr-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Browse Products
                  </a>
                  <a
                    href="/creator-dashboard/social"
                    className="flex items-center p-4 text-base font-medium text-black bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <svg className="w-6 h-6 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Manage Socials
                  </a>
                  <a
                    href="/creator-dashboard/promotions"
                    className="flex items-center p-4 text-base font-medium text-black bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <svg className="w-6 h-6 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    Promotions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}