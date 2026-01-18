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

      {/* Unique Navigation with New Design Language */}
      <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 unique-header ${
        scrolled ? 'bg-[rgba(13,13,26,0.9)]' : 'bg-[rgba(13,13,26,0.9)]'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {/* Minimal Logo - Just Text with New Design */}
            <Link href="/" className="relative group">
              <div className="flex items-center space-x-3">
                <span className="text-white font-bold text-2xl tracking-tight gradient-text">RAVE</span>
              </div>
            </Link>

            {/* Expandable Menu Button */}
            <button className="unique-button">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <div className="h-20"></div>

      {/* Hero Section with New Design Language */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 pt-20 min-h-screen flex items-center overflow-hidden">
        {/* Animated grid background with new design */}
        <div className="absolute inset-0">
          <div className="grid-background absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite',
          }}></div>
          
          {/* Star dust particles with new design */}
          {[...Array(50)].map((_, i) => (
            <div 
              key={`stardust-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full opacity-70 floating-element"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                transform: `scale(${Math.random() * 0.5 + 0.5})`
              }}
            ></div>
          ))}
        </div>
        
        {/* Grid that reveals near cursor */}
        <div ref={gridOverlayRef} className="grid-overlay absolute inset-0 transition-opacity duration-300 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}></div>
        
        <div className="container mx-auto px-6 relative z-10 fade-in">
          <div className="max-w-4xl mx-auto text-center">
            {/* Static badge with new design */}
            <div className="hero-badge inline-block mb-6">
              <span className="unique-badge badge-primary">
                The Future of Affiliate Marketing
              </span>
            </div>
            
            {/* Static title with new design */}
            <h1 className="hero-title text-7xl md:text-8xl font-black mb-6 gradient-text leading-none">
              RAVE
            </h1>
            
            <p className="hero-subtitle text-2xl md:text-3xl text-gray-300 mb-4 font-light">
              Where Creators, Sales Agents & Companies
            </p>
            <p className="hero-subtitle text-xl text-gray-400 mb-12">
              Connect. Create. Earn.
            </p>
            
            {/* Static CTA Buttons with new design */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <button className="unique-button">
                  Join Now
                </button>
              </Link>
              <Link href="/how-it-works">
                <button className="unique-button unique-card">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Add new animations to styles */}
      <style jsx global>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .grid-background {
          animation: gridMove 20s linear infinite;
        }
        
        .floating-element {
          animation: float 6s ease-in-out infinite;
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }
      `}</style>
    </div>
  );
}
