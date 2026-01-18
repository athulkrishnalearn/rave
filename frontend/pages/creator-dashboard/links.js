import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';

export default function AffiliateLinks() {
  const [links, setLinks] = useState([
    { id: 1, product: 'Premium Software Suite', url: 'https://rave.com/aff/user123/prod1', clicks: 245, conversions: 12, earnings: '$180.00' },
    { id: 2, product: 'Designer Handbag Collection', url: 'https://rave.com/aff/user123/prod2', clicks: 189, conversions: 8, earnings: '$320.00' },
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Affiliate Links</h1>
          <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">
            Generate New Link
          </button>
        </div>

        <div className="bg-white rounded shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Affiliate Link</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Clicks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Conversions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Earnings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{link.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span className="truncate max-w-xs">{link.url}</span>
                        <button className="text-black hover:text-gray-700">📋</button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{link.clicks}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{link.conversions}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{link.earnings}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <button className="text-black hover:text-gray-700 mr-2">View</button>
                      <button className="text-gray-600 hover:text-black">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
