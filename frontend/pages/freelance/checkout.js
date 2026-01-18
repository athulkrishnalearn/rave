import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Checkout() {
  const router = useRouter();
  const { pkg } = router.query;
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      alert('Payment successful! Funds are held in escrow. Freelancer has been notified.');
      router.push('/freelance/client/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <Head>
        <title>Checkout | RAVE Freelance</title>
      </Head>

      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
            <h1 className="text-3xl font-black text-black mb-8">Checkout</h1>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">🛡️</div>
                  <div>
                    <p className="font-bold text-black">RAVE Escrow Protection</p>
                    <p className="text-xs text-gray-500">Your funds are safe with us until you approve the work.</p>
                  </div>
                </div>
                <div className="text-green-600 font-bold text-xs uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">Active</div>
              </div>

              <div>
                <h2 className="font-black text-lg text-black mb-4 uppercase tracking-widest">Payment Method</h2>
                <div className="p-6 border-2 border-black rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center font-bold text-[10px]">VISA</div>
                    <p className="font-bold text-black">•••• •••• •••• 4242</p>
                  </div>
                  <button className="text-sm font-bold text-gray-400 hover:text-black">Edit</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="font-black text-xl text-black mb-6">Summary</h2>
            <div className="space-y-4 border-b border-gray-100 pb-6 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service</span>
                <span className="font-bold text-black">Logo Design</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Package</span>
                <span className="font-bold text-black">{pkg || 'Standard'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery</span>
                <span className="font-bold text-black">5 Days</span>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Subtotal</span>
                <span className="font-black text-black">$100.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Service Fee</span>
                <span className="font-black text-black">$5.00</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-100">
                <span className="text-black font-black text-xl uppercase">Total</span>
                <span className="font-black text-2xl text-black">$105.00</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-full font-black hover:bg-gray-800 transition shadow-2xl disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Pay & Start Order'}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-widest">Secure transaction by RAVE Pay</p>
          </div>
        </div>
      </div>
    </div>
  );
}
