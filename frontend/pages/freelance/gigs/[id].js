import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function GigDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [selectedPackage, setSelectedPackage] = useState('Standard');

  const packages = {
    Basic: { price: 50, delivery: 3, revisions: 1, desc: 'Simple monochrome logo design with 2 concepts.' },
    Standard: { price: 100, delivery: 5, revisions: 3, desc: 'Professional logo design with 4 concepts and source files.' },
    Premium: { price: 200, delivery: 7, revisions: 'Unlimited', desc: 'Full brand identity with social media kit and 3D mockups.' }
  };

  const gig = {
    title: 'I will design a modern monochrome logo for your brand',
    freelancer: 'Alex Designer',
    rating: 4.9,
    reviews: 124,
    category: 'Design',
    description: 'Looking for a clean, sophisticated monochrome logo? You\'ve come to the right place. I specialize in minimalist designs that represent your brand with elegance and power.',
    image: '🎨'
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>{gig.title} | RAVE</title>
      </Head>

      <nav className="bg-black text-white py-4 px-6 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/freelance" className="text-2xl font-black">RAVE</Link>
          <Link href="/freelance" className="text-sm font-bold hover:text-gray-300 transition">← Back to Marketplace</Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Left: Gig Info */}
          <div className="md:col-span-2 space-y-8">
            <h1 className="text-4xl font-black text-black leading-tight">{gig.title}</h1>
            
            <div className="flex items-center space-x-4 border-b border-gray-100 pb-6">
              <div className="w-12 h-12 bg-black rounded-full"></div>
              <div>
                <p className="font-bold text-black">{gig.freelancer}</p>
                <div className="flex items-center text-sm">
                  <span className="text-yellow-400">★</span>
                  <span className="font-bold ml-1">{gig.rating}</span>
                  <span className="text-gray-400 ml-1">({gig.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="aspect-video bg-gray-50 rounded-3xl flex items-center justify-center text-9xl shadow-inner border border-gray-100">
              {gig.image}
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-black">About This Gig</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {gig.description}
              </p>
            </div>
          </div>

          {/* Right: Pricing Card */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-black rounded-3xl overflow-hidden shadow-2xl sticky top-24">
              <div className="flex border-b-2 border-black">
                {Object.keys(packages).map((pkg) => (
                  <button
                    key={pkg}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`flex-1 py-4 font-black text-sm uppercase tracking-widest transition-all ${
                      selectedPackage === pkg ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'
                    }`}
                  >
                    {pkg}
                  </button>
                ))}
              </div>
              
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-end">
                  <h3 className="text-3xl font-black text-black">${packages[selectedPackage].price}</h3>
                </div>
                <p className="text-gray-600 text-sm">{packages[selectedPackage].desc}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm font-bold text-black">
                    <span className="mr-2">🕒</span> {packages[selectedPackage].delivery} Days Delivery
                  </div>
                  <div className="flex items-center text-sm font-bold text-black">
                    <span className="mr-2">🔄</span> {packages[selectedPackage].revisions} Revisions
                  </div>
                </div>

                <Link href={`/freelance/checkout?gig=${id}&pkg=${selectedPackage}`} className="block w-full bg-black text-white py-4 rounded-full text-center font-black hover:bg-gray-800 transition shadow-xl transform hover:scale-105">
                  Continue (${packages[selectedPackage].price})
                </Link>
                
                <button className="w-full text-sm font-bold text-gray-400 hover:text-black transition">
                  Contact Freelancer
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
