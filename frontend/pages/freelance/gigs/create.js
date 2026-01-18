import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/DashboardLayout';

export default function CreateGig() {
  const router = useRouter();
  const user = { name: 'Freelancer Alex', userType: 'freelancer' };
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Design',
    description: '',
    price: '',
    deliveryTime: '3',
    revisions: '1'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Gig published successfully!');
    router.push('/freelance/gigs');
  };

  return (
    <DashboardLayout user={user}>
      <Head>
        <title>Create New Gig | RAVE</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-black mb-2">Create a Gig</h1>
          <p className="text-gray-500 text-lg">Define your service and set your price.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 rounded-3xl border border-gray-100 shadow-xl animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6 md:col-span-2">
              <div>
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Gig Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. I will design a professional logo..."
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black text-lg font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black bg-white font-medium"
              >
                <option>Design</option>
                <option>Development</option>
                <option>Writing</option>
                <option>Marketing</option>
                <option>Video</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Base Price ($)</label>
              <input
                type="number"
                name="price"
                required
                placeholder="50"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Description</label>
              <textarea
                name="description"
                required
                rows="6"
                placeholder="Explain what exactly you will provide in this gig..."
                value={formData.description}
                onChange={handleChange}
                className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Delivery Time (Days)</label>
              <input
                type="number"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleChange}
                className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Revisions</label>
              <input
                type="number"
                name="revisions"
                value={formData.revisions}
                onChange={handleChange}
                className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black font-medium"
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-6 border-t border-gray-100">
            <button type="submit" className="flex-1 bg-black text-white py-4 rounded-full font-bold hover:bg-gray-900 transition shadow-lg">
              Publish Gig →
            </button>
            <button type="button" onClick={() => router.back()} className="px-8 py-4 bg-gray-100 text-black rounded-full font-bold hover:bg-gray-200 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
      `}</style>
    </DashboardLayout>
  );
}
