import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function DashboardLayout({ children, user, logout }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Define navigation based on user type
  const navItems = {
    creator: [
      { name: 'Dashboard', href: '/creator-dashboard', icon: '📊' },
      { name: 'Affiliate Links', href: '/creator-dashboard/links', icon: '🔗' },
      { name: 'Products', href: '/creator-dashboard/products', icon: '📦' },
      { name: 'Analytics', href: '/creator-dashboard/analytics', icon: '📈' },
      { name: 'Social Accounts', href: '/creator-dashboard/social', icon: '📱' },
      { name: 'Promotions', href: '/creator-dashboard/promotions', icon: '🎁' },
      { name: 'Profile', href: '/creator-dashboard/profile', icon: '👤' }
    ],
    'sales_agent': [
      { name: 'Dashboard', href: '/sales-agent-dashboard', icon: '📊' },
      { name: 'Companies', href: '/sales-agent-dashboard/companies', icon: '🏢' },
      { name: 'Leads', href: '/sales-agent-dashboard/leads', icon: '👥' },
      { name: 'Performance', href: '/sales-agent-dashboard/performance', icon: '📈' },
      { name: 'Weekly Test', href: '/sales-agent-dashboard/test', icon: '📝' },
      { name: 'Promotions', href: '/sales-agent-dashboard/promotions', icon: '🎁' },
      { name: 'Profile', href: '/sales-agent-dashboard/profile', icon: '👤' }
    ],
    company: [
      { name: 'Dashboard', href: '/company', icon: '📊' },
      { name: 'Products', href: '/company/products', icon: '📦' },
      { name: 'Leads', href: '/company/leads', icon: '👥' },
      { name: 'Sales Agents', href: '/company/agents', icon: '🤝' },
      { name: 'Affiliates', href: '/company/affiliates', icon: '🔗' },
      { name: 'Support', href: '/company/support', icon: '🎫' }
    ],
    management: [
      { name: 'Dashboard', href: '/management', icon: '📊' },
      { name: 'Users', href: '/management/users', icon: '👥' },
      { name: 'Campaigns', href: '/management/campaigns', icon: '🎯' },
      { name: 'Collaborations', href: '/management/collaborations', icon: '🤝' },
      { name: 'Analytics', href: '/management/analytics', icon: '📈' },
      { name: 'Reports', href: '/management/reports', icon: '📋' }
    ],
    admin: [
      { name: 'Dashboard', href: '/admin-dashboard', icon: '📊' },
      { name: 'Users', href: '/admin-dashboard/users', icon: '👥' },
      { name: 'Companies', href: '/admin-dashboard/companies', icon: '🏢' },
      { name: 'Products', href: '/admin-dashboard/products', icon: '📦' },
      { name: 'Leads', href: '/admin-dashboard/leads', icon: '📈' },
      { name: 'Promotions', href: '/admin-dashboard/promotions', icon: '🎁' },
      { name: 'Tickets', href: '/admin-dashboard/tickets', icon: '🎫' },
      { name: 'Errors', href: '/admin-dashboard/errors', icon: '⚠️' },
      { name: 'Reports', href: '/admin-dashboard/reports', icon: '📋' }
    ],
    support: [
      { name: 'Dashboard', href: '/support-dashboard', icon: '📊' },
      { name: 'Tickets', href: '/support-dashboard/tickets', icon: '🎫' },
      { name: 'All Tickets', href: '/support-dashboard/all-tickets', icon: '📋' },
      { name: 'Users', href: '/support-dashboard/users', icon: '👥' },
      { name: 'Knowledge Base', href: '/support-dashboard/knowledge', icon: '📚' },
      { name: 'Profile', href: '/support-dashboard/profile', icon: '👤' }
    ],
    freelancer: [
      { name: 'Dashboard', href: '/freelance/freelancer/dashboard', icon: '📊' },
      { name: 'My Gigs', href: '/freelance/gigs', icon: '🎨' },
      { name: 'Orders', href: '/freelance/orders', icon: '📋' },
      { name: 'Earnings', href: '/freelance/earnings', icon: '💰' },
      { name: 'Profile', href: '/freelance/profile', icon: '👤' }
    ],
    client: [
      { name: 'Dashboard', href: '/freelance/client/dashboard', icon: '📊' },
      { name: 'Browse Gigs', href: '/freelance/gigs', icon: '🔍' },
      { name: 'My Orders', href: '/freelance/client/orders', icon: '📋' },
      { name: 'Post Job', href: '/freelance/jobs/post', icon: '📝' },
      { name: 'Payments', href: '/freelance/client/payments', icon: '💳' }
    ]
  };

  const currentNavItems = navItems[user?.userType] || [];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="pt-5 pb-4 px-4 flex justify-between items-center border-b">
              <div className="flex items-center">
                <span className="text-black font-bold text-2xl">RAVE</span>
              </div>
              <button
                type="button"
                className="ml-1 flex-shrink-0 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {currentNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      router.pathname === item.href
                        ? 'bg-gray-200 text-black'
                        : 'text-gray-700 hover:bg-gray-100'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-black font-bold text-2xl">RAVE</span>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {currentNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    router.pathname === item.href
                      ? 'bg-gray-200 text-black'
                      : 'text-gray-700 hover:bg-gray-100'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs font-medium text-gray-500 capitalize">{user?.userType}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="ml-auto flex-shrink-0 bg-white p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Logout</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation bar */}
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}