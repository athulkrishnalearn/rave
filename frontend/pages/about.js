import Head from 'next/head';
import Link from 'next/link';

export default function AboutRAVEPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>About RAVE | Rave</title>
      </Head>

      {/* Navigation */}
      <nav className="bg-black text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-wide">RAVE</Link>
          <div className="flex space-x-4">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <Link href="/login" className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200">Login</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        
        <h1 className="text-4xl font-bold text-black mb-8">About RAVE</h1>
        <div className="bg-white rounded shadow p-8">
          <p className="text-gray-700">RAVE is the leading affiliate aggregator platform connecting creators, sales agents, and companies for mutual growth and success.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 RAVE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
