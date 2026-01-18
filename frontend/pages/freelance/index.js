import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function BrowseGigs() {
  const [category, setCategory] = useState('All');
  const categories = ['All', 'Design', 'Development', 'Writing', 'Marketing', 'Video', 'Music'];
  
  const mockGigs = [
    {
      id: 1,
      title: 'I will design a modern monochrome logo for your brand',
      freelancer: 'Alex Designer',
      rating: 4.9,
      reviews: 124,
      price: 50,
      category: 'Design',
      image: '🎨'
    },
    {
      id: 2,
      title: 'I will build a high-performance Next.js website',
      freelancer: 'Dev Guru',
      rating: 5.0,
      reviews: 89,
      price: 200,
      category: 'Development',
      image: '💻'
    },
    {
      id: 3,
      title: 'I will write SEO optimized tech blog posts',
      freelancer: 'Word Smith',
      rating: 4.8,
      reviews: 56,
      price: 30,
      category: 'Writing',
      image: '✍️'
    },
    {
      id: 4,
      title: 'I will manage your social media marketing',
      freelancer: 'Social Star',
      rating: 4.7,
      reviews: 210,
      price: 150,
      category: 'Marketing',
      image: '📱'
    }
  ];

  const filteredGigs = category === 'All' ? mockGigs : mockGigs.filter(gig => gig.category === category);

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Browse Gigs | RAVE Freelance</title>
      </Head>

      {/* Navigation */}
      <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-black tracking-tight">RAVE</Link>
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <Link href="/freelance" className="hover:text-gray-300 transition">Browse</Link>
            <Link href="/freelance/onboarding" className="hover:text-gray-300 transition">Become a Freelancer</Link>
            <Link href="/login" className="hover:text-gray-300 transition">Login</Link>
          </div>
          <Link href="/register" className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition text-sm">
            Join
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-black text-black mb-4 animate-fade-in-up">Marketplace</h1>
            <p className="text-gray-600 animate-fade-in-up animation-delay-200">Expert talent for every task, escrow protected.</p>
          </div>
          
          <div className="mt-8 md:mt-0 flex flex-wrap gap-2 animate-fade-in-up animation-delay-400">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  category === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredGigs.map((gig, idx) => (
            <div key={gig.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.05] animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="h-48 bg-gray-50 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500">
                {gig.image}
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-black rounded-full"></div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{gig.freelancer}</span>
                </div>
                <h3 className="text-lg font-bold text-black mb-4 line-clamp-2 leading-tight group-hover:text-gray-700 transition-colors">
                  {gig.title}
                </h3>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm font-black ml-1 text-black">{gig.rating}</span>
                    <span className="text-xs text-gray-400 ml-1">({gig.reviews})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block leading-none uppercase font-bold tracking-tighter">Starting at</span>
                    <span className="text-xl font-black text-black">${gig.price}</span>
                  </div>
                </div>
              </div>
              <Link href={`/freelance/gigs/${gig.id}`} className="block w-full bg-black text-white py-3 text-center font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animation-delay-200 { animation-delay: 0.2s; opacity: 0; animation-fill-mode: forwards; }
        .animation-delay-400 { animation-delay: 0.4s; opacity: 0; animation-fill-mode: forwards; }
      `}</style>
    </div>
  );
}
