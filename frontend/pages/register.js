import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: router.query.role || '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    nationalIdNo: '',
    nationalIdFile: null
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const selectRole = (role) => {
    setFormData({ ...formData, role });
    setStep(2);
  };

  const sendOTP = async () => {
    if (!formData.email || !formData.phone) {
      setError('Please provide email and phone number');
      return;
    }
    setLoading(true);
    // Simulate OTP send
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      alert('OTP sent to your email and phone!');
    }, 1000);
  };

  const verifyOTP = () => {
    if (otp === '123456') { // Mock OTP
      setStep(3);
      setError('');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Submit to backend
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registration successful! Your account is under review.');
        router.push('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Head>
        <title>Register | Rave</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold">RAVE</Link>
          <h1 className="text-3xl font-bold mt-4 text-black">Join Rave</h1>
          <p className="text-gray-600 mt-2">
            Already have an account? <Link href="/login" className="text-black font-semibold underline">Login</Link>
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-black text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 hidden sm:block">Role</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-black text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 hidden sm:block">Details</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${step >= 3 ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-black text-white' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="ml-2 hidden sm:block">Verification</span>
            </div>
          </div>
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-black text-center">Choose Your Role</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => selectRole('creator')}
                className="p-6 border-2 border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition text-center"
              >
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-xl font-bold mb-2 text-black">Creator</h3>
                <p className="text-gray-600 text-sm">Promote products on social media and earn commissions</p>
              </button>

              <button
                onClick={() => selectRole('sales_agent')}
                className="p-6 border-2 border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition text-center"
              >
                <div className="text-5xl mb-4">📞</div>
                <h3 className="text-xl font-bold mb-2 text-black">Sales Agent</h3>
                <p className="text-gray-600 text-sm">Close deals and earn performance-based commissions</p>
              </button>

              <button
                onClick={() => selectRole('freelancer')}
                className="p-6 border-2 border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition text-center"
              >
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-bold mb-2 text-black">Freelancer</h3>
                <p className="text-gray-600 text-sm">Offer your services (Gigs) and get paid for tasks</p>
              </button>

              <button
                onClick={() => selectRole('client')}
                className="p-6 border-2 border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition text-center"
              >
                <div className="text-5xl mb-4">💼</div>
                <h3 className="text-xl font-bold mb-2 text-black">Client</h3>
                <p className="text-gray-600 text-sm">Hire expert talent for projects and tasks</p>
              </button>

              <button
                onClick={() => selectRole('company')}
                className="p-6 border-2 border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition text-center lg:col-span-1"
              >
                <div className="text-5xl mb-4">🏢</div>
                <h3 className="text-xl font-bold mb-2 text-black">Company</h3>
                <p className="text-gray-600 text-sm">List products and access verified sales channels</p>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Basic Info & OTP */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-black">Basic Information</h2>
            
            {error && (
              <div className="mb-4 bg-red-50 text-red-700 p-3 rounded">{error}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={sendOTP}
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <p className="text-sm text-gray-500 mt-1">Check your email and phone for the OTP (Demo: use 123456)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      minLength="6"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 6 characters required</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      minLength="6"
                      required
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-300 text-black py-3 rounded hover:bg-gray-400 transition"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={verifyOTP}
                      className="flex-1 bg-black text-white py-3 rounded hover:bg-gray-800 transition"
                    >
                      Verify & Continue
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Identity Verification */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-black">Identity Verification</h2>
            
            {error && (
              <div className="mb-4 bg-red-50 text-red-700 p-3 rounded">{error}</div>
            )}

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded border border-gray-300">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Why do we need this?</strong>
                </p>
                <p className="text-sm text-gray-600">
                  National ID verification ensures a safe and trustworthy platform for everyone. Your information is securely encrypted and never shared.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">National ID Number</label>
                <input
                  type="text"
                  name="nationalIdNo"
                  value={formData.nationalIdNo}
                  onChange={handleChange}
                  placeholder="e.g., 1234567890"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload National ID</label>
                <input
                  type="file"
                  name="nationalIdFile"
                  onChange={handleChange}
                  accept="image/*,.pdf"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Accepted formats: JPG, PNG, PDF (Max 5MB)</p>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to Rave's Terms of Service and Privacy Policy. I understand my account will be reviewed before activation.
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-300 text-black py-3 rounded hover:bg-gray-400 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
