import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function RaveFeed() {
  const [moments, setMoments] = useState([]);
  const [newPost, setNewPost] = useState({ momentType: 'rave_win', content: '', raveTags: '' });
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock data for now
    setMoments([
      {
        _id: '1',
        raveHead: { name: 'Alex Creator', profilePicture: '', userType: 'creator' },
        momentType: 'rave_win',
        content: 'Just closed my biggest deal yet! 🎉 $5000 commission from a single sale. The hustle pays off!',
        raveTags: ['sales', 'milestone', 'winning'],
        raveVibes: [{ vibeType: 'fire' }, { vibeType: 'rocket' }, { vibeType: 'clap' }],
        raveResponses: [
          { raveHead: { name: 'Sarah Agent' }, response: 'Crushing it! 🔥', createdAt: new Date() }
        ],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isCollabPost: false
      },
      {
        _id: '2',
        raveHead: { name: 'Mike Designer', profilePicture: '', userType: 'freelancer' },
        momentType: 'rave_session',
        content: 'Starting a live Rave Session! Working on a monochrome branding project. Who wants to join and brainstorm? 💡',
        raveTags: ['design', 'collaboration', 'live'],
        raveVibes: [{ vibeType: 'star' }],
        raveResponses: [],
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        isCollabPost: true,
        collaborators: [{ name: 'Emma Dev' }]
      }
    ]);
  }, []);

  const momentTypeIcons = {
    rave_win: '🏆',
    rave_progress: '📈',
    rave_session: '🎯',
    rave_collab: '🤝',
    rave_milestone: '🎊'
  };

  const momentTypeLabels = {
    rave_win: 'Rave Win',
    rave_progress: 'Progress Update',
    rave_session: 'Live Session',
    rave_collab: 'Collaboration',
    rave_milestone: 'Milestone'
  };

  const vibeEmojis = {
    fire: '🔥',
    rocket: '🚀',
    star: '⭐',
    clap: '👏',
    heart: '❤️'
  };

  const handleCreatePost = () => {
    console.log('Creating post:', newPost);
    setShowCreatePost(false);
    setNewPost({ momentType: 'rave_win', content: '', raveTags: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>The Rave | RAVE Feed</title>
      </Head>

      {/* Navbar */}
      <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-3xl font-black tracking-tight">RAVE</Link>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <Link href="/rave-feed" className="text-white font-bold">The Rave</Link>
              <Link href="/rave-ideas" className="hover:text-gray-300 transition">Launchpad</Link>
              <Link href="/freelance" className="hover:text-gray-300 transition">Marketplace</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/creator-dashboard" className="hover:text-gray-300 transition text-sm">Dashboard</Link>
              <div className="w-10 h-10 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-black text-black mb-2">The Rave</h1>
          <p className="text-gray-600 text-lg">Where Rave Heads share wins, progress, and collaborate</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {['all', 'rave_win', 'rave_progress', 'rave_session', 'rave_collab', 'rave_milestone'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  filter === type
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? '🌟 All' : `${momentTypeIcons[type]} ${momentTypeLabels[type]}`}
              </button>
            ))}
          </div>
        </div>

        {/* Create Post Button */}
        <button
          onClick={() => setShowCreatePost(!showCreatePost)}
          className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition mb-6 flex items-center justify-center space-x-2"
        >
          <span className="text-2xl">+</span>
          <span>Share a Rave Moment</span>
        </button>

        {/* Create Post Form */}
        {showCreatePost && (
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border-2 border-black">
            <h3 className="text-xl font-black mb-4">Share Your Rave Moment</h3>
            
            <select
              value={newPost.momentType}
              onChange={(e) => setNewPost({...newPost, momentType: e.target.value})}
              className="w-full mb-4 px-4 py-3 border-2 border-gray-200 rounded-xl font-bold focus:outline-none focus:border-black"
            >
              {Object.entries(momentTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {momentTypeIcons[value]} {label}
                </option>
              ))}
            </select>

            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              placeholder="What's your rave moment? Share your wins, progress, or start a session..."
              rows="4"
              className="w-full mb-4 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black"
            />

            <input
              type="text"
              value={newPost.raveTags}
              onChange={(e) => setNewPost({...newPost, raveTags: e.target.value})}
              placeholder="Tags (comma separated): sales, design, milestone..."
              className="w-full mb-4 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black"
            />

            <div className="flex space-x-3">
              <button
                onClick={handleCreatePost}
                className="flex-1 bg-black text-white py-3 rounded-full font-bold hover:bg-gray-800 transition"
              >
                Post to The Rave
              </button>
              <button
                onClick={() => setShowCreatePost(false)}
                className="px-6 bg-gray-100 text-black py-3 rounded-full font-bold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Feed */}
        <div className="space-y-6">
          {moments.map((moment) => (
            <div key={moment._id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-black">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-black">
                    {moment.raveHead.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-black">{moment.raveHead.name}</h4>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full font-bold text-gray-600">
                        {moment.raveHead.userType}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(moment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className="text-2xl">{momentTypeIcons[moment.momentType]}</span>
              </div>

              {/* Content */}
              <p className="text-gray-800 mb-4 leading-relaxed">{moment.content}</p>

              {/* Tags */}
              {moment.raveTags && moment.raveTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {moment.raveTags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-black text-white px-3 py-1 rounded-full font-bold">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Collaborators */}
              {moment.isCollabPost && moment.collaborators && (
                <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-600 mb-2">Collaborating with:</p>
                  <div className="flex items-center space-x-2">
                    {moment.collaborators.map((collab, idx) => (
                      <span key={idx} className="text-sm font-bold text-black">
                        {collab.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                <div className="flex items-center space-x-6">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-black transition group">
                    <span className="text-2xl group-hover:scale-125 transition-transform">🔥</span>
                    <span className="font-bold">{moment.raveVibes.length}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-black transition">
                    <span className="text-xl">💬</span>
                    <span className="font-bold">{moment.raveResponses.length}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-black transition">
                    <span className="text-xl">🔗</span>
                    <span className="font-bold text-sm">Share</span>
                  </button>
                </div>
              </div>

              {/* Responses */}
              {moment.raveResponses.length > 0 && (
                <div className="mt-4 space-y-3">
                  {moment.raveResponses.map((resp, idx) => (
                    <div key={idx} className="flex items-start space-x-3 bg-gray-50 p-3 rounded-xl">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-black">
                        {resp.raveHead.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-black">{resp.raveHead.name}</p>
                        <p className="text-gray-700 text-sm">{resp.response}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
