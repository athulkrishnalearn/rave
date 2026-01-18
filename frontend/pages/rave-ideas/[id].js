import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function IdeaDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [idea, setIdea] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [application, setApplication] = useState({
    role: '',
    skills: '',
    message: '',
    portfolio: ''
  });

  useEffect(() => {
    if (id) {
      // Mock data - would fetch from API
      setIdea({
        _id: id,
        title: 'AI-Powered Fitness Coach',
        tagline: 'Personal trainer in your pocket using machine learning',
        description: 'Building an AI fitness app that creates personalized workout plans based on your goals, progress, and preferences. The app will use computer vision to analyze form, track progress with ML algorithms, and provide real-time feedback during workouts.',
        problemStatement: 'Traditional fitness apps lack personalization and real-time adaptation. People struggle to maintain motivation and proper form without a personal trainer, which is too expensive for most.',
        solution: 'Use AI to analyze user data and provide dynamic, adaptive workout recommendations. Computer vision will check form in real-time, and ML will adjust difficulty based on progress and recovery metrics.',
        founder: { 
          _id: '1',
          name: 'Sarah Founder', 
          profilePicture: '', 
          userType: 'creator',
          email: 'sarah@example.com'
        },
        industry: 'Tech',
        stage: 'mvp',
        status: 'open',
        skillsNeeded: [
          { skill: 'React Native Developer', level: 'expert', equityOffered: 5 },
          { skill: 'ML Engineer', level: 'expert', equityOffered: 8 },
          { skill: 'UI/UX Designer', level: 'intermediate', equityOffered: 3 },
          { skill: 'Backend Developer (Python)', level: 'expert', equityOffered: 5 },
          { skill: 'Marketing Lead', level: 'intermediate', equityOffered: 2 }
        ],
        buildSquad: [
          { 
            contributor: { name: 'Mike Dev', profilePicture: '' }, 
            role: 'Frontend Lead', 
            equityShare: 5, 
            status: 'active',
            skills: ['React Native', 'TypeScript'],
            joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        ],
        equityDistribution: {
          founder: 70,
          availableEquity: 14,
          reservedForTeam: 16
        },
        milestones: [
          { title: 'MVP Launch', description: 'Basic app with workout tracking', targetDate: new Date('2024-03-01'), completed: true, completedAt: new Date('2024-02-28') },
          { title: 'AI Integration', description: 'Implement ML-based recommendations', targetDate: new Date('2024-05-01'), completed: false },
          { title: 'Beta Testing', description: '100 beta users testing', targetDate: new Date('2024-06-01'), completed: false }
        ],
        fundingGoal: 50000,
        fundingRaised: 15000,
        raveVibes: [
          { raveHead: { name: 'John' }, vibeType: 'rocket' },
          { raveHead: { name: 'Jane' }, vibeType: 'fire' },
          { raveHead: { name: 'Bob' }, vibeType: 'star' }
        ],
        comments: [
          { 
            raveHead: { name: 'Alex Rave', profilePicture: '' },
            comment: 'This is exactly what the fitness industry needs! Would love to contribute as a backend developer.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          }
        ],
        applicationCount: 8,
        viewCount: 234,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
      });
    }
  }, [id]);

  const handleApply = () => {
    console.log('Applying with:', application);
    setShowApplyModal(false);
    setApplication({ role: '', skills: '', message: '', portfolio: '' });
  };

  if (!idea) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const stageIcons = {
    idea: '💡',
    mvp: '🛠️',
    beta: '🧪',
    launched: '🚀',
    growing: '📈'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{idea.title} | RAVE Launchpad</title>
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
              <button
                onClick={() => router.back()}
                className="hover:text-gray-300 transition text-sm"
              >
                ← Back
              </button>
              <div className="w-10 h-10 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-4xl">{stageIcons[idea.stage]}</span>
                <span className="bg-gray-100 px-4 py-1 rounded-full text-sm font-bold text-gray-700">
                  {idea.stage.toUpperCase()}
                </span>
                <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-bold">
                  {idea.industry}
                </span>
              </div>
              
              <h1 className="text-5xl font-black text-black mb-4">{idea.title}</h1>
              <p className="text-2xl text-gray-600 mb-6">{idea.tagline}</p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white font-black text-xl">
                  {idea.founder.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-black text-lg">{idea.founder.name}</p>
                  <p className="text-sm text-gray-500">Founder • {idea.founder.userType}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <span>🔥</span>
                  <span className="font-bold">{idea.raveVibes.length} Vibes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>👁️</span>
                  <span className="font-bold">{idea.viewCount} Views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📝</span>
                  <span className="font-bold">{idea.applicationCount} Applications</span>
                </div>
              </div>
            </div>

            {/* Problem & Solution */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="mb-6">
                <h3 className="text-2xl font-black text-black mb-3">💢 The Problem</h3>
                <p className="text-gray-700 leading-relaxed">{idea.problemStatement}</p>
              </div>
              
              <div>
                <h3 className="text-2xl font-black text-black mb-3">💡 The Solution</h3>
                <p className="text-gray-700 leading-relaxed">{idea.solution}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-black text-black mb-4">📖 Full Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{idea.description}</p>
            </div>

            {/* Build Squad */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-black text-black mb-4">👥 Build Squad ({idea.buildSquad.length})</h3>
              <div className="space-y-4">
                {idea.buildSquad.map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-black">
                        {member.contributor.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-black">{member.contributor.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {member.skills.map((skill, i) => (
                            <span key={i} className="text-xs bg-white px-2 py-1 rounded-full text-gray-700">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-green-600">{member.equityShare}%</p>
                      <p className="text-xs text-gray-500">equity</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-black text-black mb-4">🎯 Milestones</h3>
              <div className="space-y-4">
                {idea.milestones.map((milestone, idx) => (
                  <div key={idx} className={`border-l-4 pl-4 py-2 ${milestone.completed ? 'border-green-500' : 'border-gray-300'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-black">{milestone.title}</p>
                      {milestone.completed && <span className="text-green-600 font-bold">✓ Done</span>}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{milestone.description}</p>
                    <p className="text-xs text-gray-500">
                      Target: {new Date(milestone.targetDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-black text-black mb-4">💬 Comments</h3>
              <div className="space-y-4">
                {idea.comments.map((comment, idx) => (
                  <div key={idx} className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-black">
                      {comment.raveHead.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-bold text-black">{comment.raveHead.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-gray-700">{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA Card */}
            <div className="bg-gradient-to-br from-black to-gray-800 text-white rounded-2xl p-6 shadow-lg sticky top-24">
              <h3 className="text-2xl font-black mb-4">Join the Squad</h3>
              <p className="text-sm mb-6 text-gray-300">
                This idea is looking for talented builders. Apply with your skills and earn equity!
              </p>
              <button
                onClick={() => setShowApplyModal(true)}
                className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-100 transition mb-3"
              >
                Apply Now
              </button>
              <button className="w-full border-2 border-white text-white py-4 rounded-xl font-bold hover:bg-white hover:text-black transition">
                Send Message
              </button>
            </div>

            {/* Equity Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="text-lg font-black text-black mb-4">💰 Equity Distribution</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Founder</span>
                  <span className="font-bold text-black">{idea.equityDistribution.founder}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Squad</span>
                  <span className="font-bold text-black">
                    {idea.buildSquad.reduce((sum, m) => sum + m.equityShare, 0)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600 font-bold">Available</span>
                  <span className="font-black text-green-600 text-xl">{idea.equityDistribution.availableEquity}%</span>
                </div>
              </div>
            </div>

            {/* Roles Needed */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="text-lg font-black text-black mb-4">🎯 Roles Needed</h4>
              <div className="space-y-3">
                {idea.skillsNeeded.map((skill, idx) => (
                  <div key={idx} className="border-2 border-gray-100 rounded-xl p-3">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-sm text-black">{skill.skill}</p>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                        {skill.equityOffered}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 capitalize">{skill.level} level</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Funding */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="text-lg font-black text-black mb-4">💵 Funding</h4>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Raised</span>
                  <span className="font-bold">${idea.fundingRaised.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${(idea.fundingRaised / idea.fundingGoal) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Goal: ${idea.fundingGoal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full">
            <h2 className="text-3xl font-black mb-6">Apply to Join Squad</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">What role?</label>
                <input
                  type="text"
                  value={application.role}
                  onChange={(e) => setApplication({...application, role: e.target.value})}
                  placeholder="e.g., Frontend Developer"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Skills</label>
                <input
                  type="text"
                  value={application.skills}
                  onChange={(e) => setApplication({...application, skills: e.target.value})}
                  placeholder="React, TypeScript, UI/UX (comma separated)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Why you?</label>
                <textarea
                  rows="4"
                  value={application.message}
                  onChange={(e) => setApplication({...application, message: e.target.value})}
                  placeholder="Tell the founder why you're perfect for this..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Portfolio Link (optional)</label>
                <input
                  type="url"
                  value={application.portfolio}
                  onChange={(e) => setApplication({...application, portfolio: e.target.value})}
                  placeholder="https://yourportfolio.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleApply}
                className="flex-1 bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 transition"
              >
                Submit Application
              </button>
              <button
                onClick={() => setShowApplyModal(false)}
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
