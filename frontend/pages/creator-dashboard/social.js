import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Link from 'next/link';

export default function SocialAccounts() {
  const [accounts, setAccounts] = useState([
    { id: 1, platform: 'Instagram', username: '@creator_john', status: 'Verified', followers: '125K' },
    { id: 2, platform: 'TikTok', username: '@john_creates', status: 'Pending', followers: '89K' },
    { id: 3, platform: 'YouTube', username: 'JohnCreates', status: 'Verified', followers: '45K' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newAccount, setNewAccount] = useState({ platform: '', username: '' });

  const handleAddAccount = () => {
    if (newAccount.platform && newAccount.username) {
      setAccounts([...accounts, {
        id: Date.now(),
        platform: newAccount.platform,
        username: newAccount.username,
        status: 'Pending',
        followers: 'N/A'
      }]);
      setNewAccount({ platform: '', username: '' });
      setShowModal(false);
      alert('Social account added! Please check your DMs for verification link.');
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to remove this account?')) {
      setAccounts(accounts.filter(acc => acc.id !== id));
    }
  };

  const handleVerify = (id) => {
    alert('Verification link sent to your DMs!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Social Accounts</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
          >
            + Add Account
          </button>
        </div>

        {/* Accounts List */}
        <div className="bg-white rounded shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Followers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-black">{account.platform}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{account.username}</td>
                    <td className="px-6 py-4 text-gray-700">{account.followers}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        account.status === 'Verified' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'
                      }`}>
                        {account.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      {account.status === 'Pending' && (
                        <button
                          onClick={() => handleVerify(account.id)}
                          className="text-black hover:underline text-sm font-semibold"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(account.id)}
                        className="text-gray-600 hover:text-black text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Account Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4 text-black">Add Social Account</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  value={newAccount.platform}
                  onChange={(e) => setNewAccount({...newAccount, platform: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Select Platform</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Facebook">Facebook</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username/Handle</label>
                <input
                  type="text"
                  value={newAccount.username}
                  onChange={(e) => setNewAccount({...newAccount, username: e.target.value})}
                  placeholder="@username"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-black py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAccount}
                  className="flex-1 bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                >
                  Add Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
