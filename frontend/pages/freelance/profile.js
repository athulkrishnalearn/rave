import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function FreelanceProfile() {
  const [profile, setProfile] = useState({
    name: 'Your Name',
    title: 'Professional Freelancer',
    bio: 'Experienced professional ready to deliver high-quality work',
    skills: ['Design', 'Development', 'Writing'],
    hourlyRate: 50,
    languages: ['English'],
    rating: 4.9,
    completedOrders: 47
  });

  const [editing, setEditing] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>My Profile | RAVE Freelance</title>
      </Head>

      {/* Navbar */}
      <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-black tracking-tight">RAVE</Link>
          <div className="flex items-center space-x-6">
            <Link href="/freelance" className="hover:text-gray-300 transition">Browse Gigs</Link>
            <Link href="/freelance/orders" className="hover:text-gray-300 transition">Orders</Link>
            <Link href="/freelance/profile" className="hover:text-gray-300 transition font-bold">Profile</Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-black text-black mb-2">Freelancer Profile</h1>
              <p className="text-gray-600">Manage your professional presence</p>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition"
            >
              {editing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-6">
            <div className="flex items-start space-x-6 mb-6">
              <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-white text-3xl font-black">
                {profile.name.charAt(0)}
              </div>
              <div className="flex-1">
                {editing ? (
                  <>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full text-2xl font-bold mb-2 px-3 py-2 border-2 border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile({...profile, title: e.target.value})}
                      className="w-full text-lg text-gray-600 px-3 py-2 border-2 border-gray-300 rounded"
                    />
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-black mb-1">{profile.name}</h2>
                    <p className="text-lg text-gray-600 mb-3">{profile.title}</p>
                  </>
                )}
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-bold text-black">{profile.rating}</span>
                  </div>
                  <div className="text-gray-600">
                    <span className="font-bold text-black">{profile.completedOrders}</span> orders completed
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">About Me</label>
              {editing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              )}
            </div>

            {/* Skills */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase">Skills</label>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold"
                  >
                    {skill}
                  </span>
                ))}
                {editing && (
                  <button className="bg-gray-200 text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-300 transition">
                    + Add Skill
                  </button>
                )}
              </div>
            </div>

            {/* Hourly Rate */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Hourly Rate</label>
                {editing ? (
                  <input
                    type="number"
                    value={profile.hourlyRate}
                    onChange={(e) => setProfile({...profile, hourlyRate: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                ) : (
                  <p className="text-2xl font-black text-black">${profile.hourlyRate}/hr</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Languages</label>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-black px-4 py-2 rounded-full text-sm font-bold"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/freelance/gigs/create"
              className="block bg-black text-white text-center py-4 rounded-full font-bold hover:bg-gray-800 transition"
            >
              Create New Gig
            </Link>
            <Link
              href="/freelance/orders"
              className="block bg-white text-black border-2 border-black text-center py-4 rounded-full font-bold hover:bg-gray-50 transition"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
