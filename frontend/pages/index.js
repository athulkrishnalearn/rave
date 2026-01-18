import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const navRef = useRef(null);
  const gridOverlayRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!heroRef.current || !gridOverlayRef.current) return;

    const handleMouseMove = (e) => {
      const heroRect = heroRef.current.getBoundingClientRect();
      const centerX = heroRect.left + heroRect.width / 2;
      const centerY = heroRect.top + heroRect.height / 2;
      const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
      
      if (distance < 200) {
        gridOverlayRef.current.style.opacity = '1';
        gridOverlayRef.current.style.backgroundImage = `radial-gradient(circle at ${e.clientX - heroRect.left}px ${e.clientY - heroRect.top}px, transparent 60px, rgba(0,0,0,0.7) 100px), linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`;
      } else {
        gridOverlayRef.current.style.opacity = '0';
      }
    };

    const heroElement = heroRef.current;
    heroElement.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      heroElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Head>
        <title>Rave - Connect Creators, Sales Agents & Companies</title>
        <meta name="description" content="Join the Rave revolution. Earn through affiliate marketing and sales." />
      </Head>

      {/* Original Navigation */}
      <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/10 backdrop-blur-sm' : 'bg-black/10 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {/* Original Logo */}
            <Link href="/" className="relative group">
              <div className="flex items-center space-x-3">
                <span className="text-white font-bold text-2xl tracking-tight">RAVE</span>
              </div>
            </Link>

            {/* Original Menu Button */}
            <button className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <div className="h-20"></div>

      {/* Original Hero Section with Grid and Stardust */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20 min-h-screen flex items-center overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0">
          <div className="grid-background absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite',
          }}></div>
          
          {/* Star dust particles */}
          {[...Array(50)].map((_, i) => (
            <div 
              key={`stardust-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 5}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
                transform: `scale(${Math.random() * 0.5 + 0.5})`
              }}
            ></div>
          ))}
        </div>
        
        {/* Grid that reveals near cursor */}
        <div ref={gridOverlayRef} className="grid-overlay absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 60px, rgba(0,0,0,0.7) 100px), linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Original badge */}
            <div className="hero-badge inline-block mb-6">
              <span className="bg-white/10 text-white px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase border border-white/20 shadow-lg transition-all duration-300">
                The Future of Affiliate Marketing
              </span>
            </div>
            
            {/* Original title */}
            <h1 className="hero-title text-7xl md:text-8xl font-black mb-6 text-white leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white animate-gradient" style={{backgroundSize: '200% 200%'}}>
                RAVE
              </span>
            </h1>
            
            <p className="hero-subtitle text-2xl md:text-3xl text-gray-300 mb-4 font-light">
              Where Creators, Sales Agents & Companies
            </p>
            <p className="hero-subtitle text-xl text-gray-400 mb-12">
              Connect. Create. Earn.
            </p>
            
            {/* Original CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <button className="bg-white text-black px-8 py-4 rounded-lg font-bold hover:bg-gray-200 transition-all">
                  Join Now
                </button>
              </Link>
              <Link href="/how-it-works">
                <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-black transition-all">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How RAVE Works
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our platform connects creators, sales agents, and companies in a seamless ecosystem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">For Creators</h3>
              <p className="text-gray-400">
                Create compelling content and earn commissions through our affiliate network. Track performance and optimize your strategies.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">For Sales Agents</h3>
              <p className="text-gray-400">
                Connect with companies and leads. Close deals and earn competitive commissions through our streamlined sales process.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">For Companies</h3>
              <p className="text-gray-400">
                Find talented creators and experienced sales agents. Grow your business through our powerful affiliate marketing platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-purple-500 mb-2">10K+</div>
              <div className="text-gray-400">Active Creators</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">5K+</div>
              <div className="text-gray-400">Sales Agents</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">500+</div>
              <div className="text-gray-400">Companies</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">$50M+</div>
              <div className="text-gray-400">Commission Paid</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join thousands of satisfied creators, agents, and companies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  AJ
                </div>
                <div>
                  <div className="font-bold text-white">Alex Johnson</div>
                  <div className="text-gray-400">Content Creator</div>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "RAVE has transformed my content creation career. The commission structure is fair and the platform is incredibly user-friendly."
              </p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  MS
                </div>
                <div>
                  <div className="font-bold text-white">Maria Santos</div>
                  <div className="text-gray-400">Sales Agent</div>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "The lead quality is exceptional and the commission rates are among the best in the industry. Highly recommended!"
              </p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  RT
                </div>
                <div>
                  <div className="font-bold text-white">Robert Thompson</div>
                  <div className="text-gray-400">Company Owner</div>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "Finding quality sales partners has never been easier. RAVE connects us with professionals who truly understand our products."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-blue-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Join the Revolution?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Join thousands of creators, sales agents, and companies already earning through RAVE
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="bg-white text-black px-8 py-4 rounded-lg font-bold hover:bg-gray-200 transition-all text-lg">
                Get Started Today
              </button>
            </Link>
            <Link href="/contact">
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-black transition-all text-lg">
                Contact Sales
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">RAVE</h3>
              <p className="text-gray-400">
                The future of affiliate marketing connecting creators, sales agents, and companies.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
                <li><Link href="/documentation" className="hover:text-white transition-colors">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 RAVE. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Original animations */}
      <style jsx global>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes animate-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          animation: animate-gradient 3s ease infinite;
        }
        
        .grid-background {
          animation: gridMove 20s linear infinite;
        }
      `}</style>
    </div>
  );
}