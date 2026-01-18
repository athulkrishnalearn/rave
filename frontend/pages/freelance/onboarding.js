import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function FreelancerOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    portfolioUrl: '',
    experience: 'Entry'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert('Profile submitted for review! You will be notified once approved.');
    router.push('/freelance/freelancer/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-6">
      <Head>
        <title>Become a Freelancer | RAVE</title>
      </Head>

      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="bg-black p-10 text-white text-center">
          <h1 className="text-4xl font-black mb-2 tracking-tight">Become a Freelancer</h1>
          <p className="text-gray-400">Join the elite network of RAVE talent</p>
        </div>

        <div className="p-10">
          <div className="flex justify-between mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {s}
                </div>
                {s < 3 && <div className={`w-12 h-0.5 mx-2 ${step > s ? 'bg-black' : 'bg-gray-200'}`}></div>}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="animate-fade-in-right">
              <h2 className="text-2xl font-black text-black mb-6">Professional Bio</h2>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell clients about your expertise and what makes you unique..."
                className="w-full h-40 p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black mb-8"
              />
              <button onClick={handleNext} className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-gray-900 transition shadow-lg">
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-right">
              <h2 className="text-2xl font-black text-black mb-6">Skills & Expertise</h2>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Skills (comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, UI Design, Copywriting..."
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Experience Level</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  >
                    <option>Entry</option>
                    <option>Intermediate</option>
                    <option>Expert</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4">
                <button onClick={handleBack} className="flex-1 bg-gray-100 text-black py-4 rounded-full font-bold hover:bg-gray-200 transition">
                  Back
                </button>
                <button onClick={handleNext} className="flex-1 bg-black text-white py-4 rounded-full font-bold hover:bg-gray-900 transition">
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in-right">
              <h2 className="text-2xl font-black text-black mb-6">Identity Check</h2>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8">
                <p className="text-gray-600 text-sm leading-relaxed">
                  To maintain the quality of RAVE, we reuse your <strong>National ID verification</strong>. By continuing, you agree to let our staff review your profile against your verified identity.
                </p>
              </div>
              <div className="flex space-x-4">
                <button onClick={handleBack} className="flex-1 bg-gray-100 text-black py-4 rounded-full font-bold hover:bg-gray-200 transition">
                  Back
                </button>
                <button onClick={handleSubmit} className="flex-1 bg-black text-white py-4 rounded-full font-bold hover:bg-gray-900 transition shadow-lg">
                  Submit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fade-in-right { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-fade-in-right { animation: fade-in-right 0.5s ease-out; }
      `}</style>
    </div>
  );
}
