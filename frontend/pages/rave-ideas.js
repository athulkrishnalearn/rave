import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function RaveIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    // Mock data for demonstration
    setIdeas([
      {
        _id: '1',
        title: 'AI-Powered Fitness Coach',
        tagline: 'Personal trainer in your pocket using machine learning',
        description: 'Building an AI fitness app that creates personalized workout plans based on your goals, progress, and preferences.',
        problemStatement: 'Traditional fitness apps lack personalization and real-time adaptation.',
        solution: 'Use AI to analyze user data and provide dynamic, adaptive workout recommendations.',
        founder: { name: 'Sarah Founder', profilePicture: '', userType: 'creator' },
        industry: 'Tech',
        stage: 'mvp',
        status: 'open',
        skillsNeeded: [
          { skill: 'React Native Developer', level: 'expert', equityOffered: 5 },
          { skill: 'ML Engineer', level: 'expert', equityOffered: 8 },
          { skill: 'UI/UX Designer', level: 'intermediate', equityOffered: 3 }
        ],
        buildSquad: [
          { contributor: { name: 'Mike Dev' }, role: 'Frontend Lead', equityShare: 5, status: 'active' }
        ],
        equityDistribution: {
          founder: 70,
          availableEquity: 14,
          reservedForTeam: 16
        },
        raveVibes: [{ vibeType: 'rocket' }, { vibeType: 'fire' }, { vibeType: 'star' }],
        applicationCount: 8,
        viewCount: 234,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        _id: '2',
        title: 'Sustainable Fashion Marketplace',
        tagline: 'Connect eco-conscious consumers with sustainable fashion brands',
        description: 'A platform that makes sustainable fashion accessible and affordable for everyone.',
        problemStatement: 'Fast fashion is destroying the planet, but sustainable options are hard to find.',
        solution: 'Curated marketplace with verified sustainable brands and carbon tracking.',
        founder: { name: 'Emma Green', profilePicture: '', userType: 'company' },
        industry: 'E-commerce',
        stage: 'idea',
        status: 'open',
        skillsNeeded: [
          { skill: 'Full-Stack Developer', level: 'expert', equityOffered: 10 },
          { skill: 'Marketing Specialist', level: 'intermediate', equityOffered: 4 }
        ],
        buildSquad: [],
        equityDistribution: {
          founder: 80,
          availableEquity: 14,
          reservedForTeam: 6
        },
        raveVibes: [{ vibeType: 'heart' }, { vibeType: 'star' }],
        applicationCount: 12,
        viewCount: 456,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ]);
  }, []);

  const industries = ['All', 'Tech', 'Finance', 'Healthcare', 'Education', 'E-commerce', 'Social', 'Gaming', 'Design', 'Marketing'];
  const stages = ['All', 'idea', 'mvp', 'beta', 'launched', 'growing'];

  const stageIcons = {
    idea: '💡',
    mvp: '🛠️',
    beta: '🧪',
    launched: '🚀',
    growing: '📈'
  };

  const vibeEmojis = {
    fire: '🔥',
    rocket: '🚀',
    star: '⭐',
    bulb: '💡',
    money: '💰',
    heart: '❤️'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Launchpad | RAVE Ideas</title>
      </Head>

      {/* Navbar */}
      <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-3xl font-black tracking-tight">RAVE</Link>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <Link href="/rave-feed" className="hover:text-gray-300 transition">The Rave</Link>
              <Link href="/rave-ideas" className="text-white font-bold">Launchpad</Link>
              <Link href="/freelance" className="hover:text-gray-300 transition">Marketplace</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/creator-dashboard" className="hover:text-gray-300 transition text-sm">Dashboard</Link>
              <div className="w-10 h-10 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-6xl font-black text-black mb-4">🚀 The Launchpad</h1>
          <p className="text-xl text-gray-600 mb-2">Where visionary founders meet talented builders</p>
          <p className="text-lg text-gray-500">Post your startup idea, build a squad, share equity</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-4xl font-black text-black mb-2">{ideas.length}</p>
            <p className="text-sm font-bold text-gray-600">Active Ideas</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-4xl font-black text-black mb-2">156</p>
            <p className="text-sm font-bold text-gray-600">Build Squads Formed</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-4xl font-black text-black mb-2">23</p>
            <p className="text-sm font-bold text-gray-600">Ideas Launched</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-4xl font-black text-black mb-2">$2.4M</p>
            <p className="text-sm font-bold text-gray-600">Equity Distributed</p>
          </div>
        </div>

        {/* Create Idea Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-6 rounded-2xl font-black text-lg hover:from-gray-800 hover:to-black transition-all mb-8 shadow-lg flex items-center justify-center space-x-3"
        >
          <span className="text-3xl">💡</span>
          <span>Launch Your Idea</span>
        </button>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <div className="mb-4">
            <p className="text-sm font-bold text-gray-600 mb-3">Industry</p>
            <div className="flex flex-wrap gap-2">
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setFilter(ind.toLowerCase())}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    filter === ind.toLowerCase()
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {ideas.map((idea) => (
            <div
              key={idea._id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-black cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-black">
                    {idea.founder.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-black">{idea.founder.name}</h4>
                    <p className="text-xs text-gray-500">{idea.founder.userType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{stageIcons[idea.stage]}</span>
                  <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-bold text-gray-700">
                    {idea.stage.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-2xl font-black text-black mb-2">{idea.title}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{idea.tagline}</p>

              {/* Industry Badge */}
              <div className="mb-4">
                <span className="inline-block bg-black text-white px-4 py-1 rounded-full text-xs font-bold">
                  {idea.industry}
                </span>
              </div>

              {/* Equity Info */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-gray-600 mb-1">Equity Available</p>
                    <p className="text-2xl font-black text-black">{idea.equityDistribution.availableEquity}%</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-600 mb-1">Squad Size</p>
                    <p className="text-2xl font-black text-black">{idea.buildSquad.length}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-600 mb-1">Applications</p>
                    <p className="text-2xl font-black text-black">{idea.applicationCount}</p>
                  </div>
                </div>
              </div>

              {/* Skills Needed */}
              {idea.skillsNeeded && idea.skillsNeeded.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-600 mb-2">Looking for:</p>
                  <div className="space-y-2">
                    {idea.skillsNeeded.slice(0, 2).map((skill, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div>
                          <p className="text-sm font-bold text-black">{skill.skill}</p>
                          <p className="text-xs text-gray-500">{skill.level}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                          {skill.equityOffered}% equity
                        </span>
                      </div>
                    ))}
                  </div>
                  {idea.skillsNeeded.length > 2 && (
                    <p className="text-xs text-gray-500 mt-2">+{idea.skillsNeeded.length - 2} more roles</p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-black transition group">
                    <span className="text-xl group-hover:scale-125 transition-transform">🔥</span>
                    <span className="font-bold">{idea.raveVibes.length}</span>
                  </button>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="text-xl">👁️</span>
                    <span className="font-bold">{idea.viewCount}</span>
                  </div>
                </div>
                <button className="bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition">
                  View & Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Create Modal (Placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-black mb-6">Launch Your Idea 🚀</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Idea Title</label>
                <input
                  type="text"
                  placeholder="Your big idea in a few words..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tagline</label>
                <input
                  type="text"
                  placeholder="What's your elevator pitch?"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Problem Statement</label>
                <textarea
                  rows="3"
                  placeholder="What problem are you solving?"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Solution</label>
                <textarea
                  rows="3"
                  placeholder="How will you solve it?"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Industry</label>
                  <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black">
                    <option>Tech</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                    <option>Education</option>
                    <option>E-commerce</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stage</label>
                  <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black">
                    <option>idea</option>
                    <option>mvp</option>
                    <option>beta</option>
                    <option>launched</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Equity Available for Team (%)</label>
                <input
                  type="number"
                  placeholder="20"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button className="flex-1 bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 transition">
                Launch on Launchpad
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-8 bg-gray-100 text-black py-4 rounded-full font-bold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
