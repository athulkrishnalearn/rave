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

      {/* Simple Navigation */}
      <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/90 backdrop-blur-sm' : 'bg-black/90 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {/* Simple Logo */}
            <Link href="/" className="relative group">
              <div className="flex items-center space-x-3">
                <span className="text-white font-bold text-2xl tracking-tight">RAVE</span>
              </div>
            </Link>

            {/* Simple Menu Button */}
            <button className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <div className="h-20"></div>

      {/* Simple Hero Section */}
      <section ref={heroRef} className="relative bg-black pt-20 min-h-screen flex items-center">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Simple badge */}
            <div className="hero-badge inline-block mb-6">
              <span className="bg-white/10 text-white px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase border border-white/20">
                The Future of Affiliate Marketing
              </span>
            </div>
            
            {/* Simple title */}
            <h1 className="hero-title text-7xl md:text-8xl font-black mb-6 text-white leading-none">
              RAVE
            </h1>
            
            <p className="hero-subtitle text-2xl md:text-3xl text-gray-300 mb-4 font-light">
              Where Creators, Sales Agents & Companies
            </p>
            <p className="hero-subtitle text-xl text-gray-400 mb-12">
              Connect. Create. Earn.
            </p>
            
            {/* Simple CTA Buttons */}
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
    </div>
  );
}
