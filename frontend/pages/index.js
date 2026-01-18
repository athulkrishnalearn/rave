import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [navExpanded, setNavExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const navRef = useRef(null);
  const gridOverlayRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const raveHeadsRef = useRef(null);
  const creatorsRef = useRef(null);
  const salesRef = useRef(null);
  const companiesRef = useRef(null);
  const freelanceRef = useRef(null);
  const contestsRef = useRef(null);
  const testimonialsRef = useRef(null);

  useEffect(() => {
    // Handle scroll for navbar
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Check if elements exist before animating
      const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-cta');
      if (heroElements.length === 0) {
        console.warn('Hero elements not found, skipping animations');
        return;
      }

        // Hero Section Animations - Improved smooth animations
    const heroTimeline = gsap.timeline({ 
      defaults: { ease: 'power3.out' },
      onStart: () => {
        // Ensure elements are visible before animation
        gsap.set('.hero-badge, .hero-title, .hero-subtitle, .hero-cta', { opacity: 1, visibility: 'visible' });
      }
    });
    
    heroTimeline
      .from('.hero-badge', {
        y: -30,
        duration: 0.6,
        ease: 'back.out(1.4)'
      })
      .from('.hero-title', {
        scale: 0.9,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.2')
      .from('.hero-subtitle', {
        y: 20,
        stagger: 0.15,
        duration: 0.6
      }, '-=0.4')
      .from('.hero-cta', {
        y: 20,
        scale: 0.95,
        stagger: 0.15,
        duration: 0.5,
        ease: 'back.out(1.2)'
      }, '-=0.3');

    // Floating shapes animation - smoother
    gsap.to('.floating-shape', {
      y: '+=20',
      rotation: '+=3',
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: {
        each: 0.3,
        from: 'random'
      }
    });

    // Rave Heads Section - smoother
    if (raveHeadsRef.current) {
      gsap.from(raveHeadsRef.current.querySelector('h2'), {
        scrollTrigger: {
          trigger: raveHeadsRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        y: 30,
        duration: 0.8,
        ease: 'power2.out'
      });

      gsap.from(raveHeadsRef.current.querySelectorAll('p'), {
        scrollTrigger: {
          trigger: raveHeadsRef.current,
          start: 'top 75%'
        },
        y: 20,
        stagger: 0.15,
        duration: 0.6,
        ease: 'power2.out'
      });
    }

    // Creators Section with card reveal
    if (creatorsRef.current) {
      gsap.from(creatorsRef.current.querySelector('.creator-emoji'), {
        scrollTrigger: {
          trigger: creatorsRef.current,
          start: 'top 70%'
        },
        scale: 0,
        rotation: 360,
        duration: 1,
        ease: 'back.out(1.7)'
      });

      gsap.from(creatorsRef.current.querySelectorAll('.creator-feature'), {
        scrollTrigger: {
          trigger: creatorsRef.current,
          start: 'top 70%'
        },
        x: -50,
        stagger: 0.15,
        duration: 0.6
      });

      gsap.from(creatorsRef.current.querySelector('.creator-card'), {
        scrollTrigger: {
          trigger: creatorsRef.current,
          start: 'top 70%'
        },
        x: 100,
        duration: 1,
        ease: 'power3.out'
      });
    }

    // Sales Agents Section
    if (salesRef.current) {
      gsap.from(salesRef.current.querySelector('.sales-card'), {
        scrollTrigger: {
          trigger: salesRef.current,
          start: 'top 70%'
        },
        x: -100,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.from(salesRef.current.querySelectorAll('.sales-feature'), {
        scrollTrigger: {
          trigger: salesRef.current,
          start: 'top 70%'
        },
        x: 50,
        stagger: 0.15,
        duration: 0.6
      });
    }

    // Companies Section
    if (companiesRef.current) {
      gsap.from(companiesRef.current.querySelectorAll('.company-feature'), {
        scrollTrigger: {
          trigger: companiesRef.current,
          start: 'top 70%'
        },
        x: -50,
        stagger: 0.15,
        duration: 0.6
      });

      gsap.from(companiesRef.current.querySelector('.company-card'), {
        scrollTrigger: {
          trigger: companiesRef.current,
          start: 'top 70%'
        },
        scale: 0.8,
        duration: 1,
        ease: 'back.out(1.2)'
      });
    }

    // Freelance Section with 3D card effect
    if (freelanceRef.current) {
      const freelanceCards = freelanceRef.current.querySelectorAll('.freelance-card');
      
      gsap.from(freelanceCards, {
        scrollTrigger: {
          trigger: freelanceRef.current,
          start: 'top 70%'
        },
        y: 100,
        rotationX: -15,
        stagger: 0.3,
        duration: 1,
        ease: 'power3.out'
      });
    }

    // Contests Section with stagger reveal
    if (contestsRef.current) {
      gsap.from(contestsRef.current.querySelectorAll('.contest-card'), {
        scrollTrigger: {
          trigger: contestsRef.current,
          start: 'top 70%'
        },
        y: 80,
        scale: 0.9,
        stagger: 0.2,
        duration: 0.8,
        ease: 'back.out(1.3)'
      });

      // Sparkle animation for contest cards
      gsap.to(contestsRef.current.querySelectorAll('.contest-sparkle'), {
        scale: 1.5,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: 'power1.out',
        stagger: {
          each: 0.5,
          from: 'random'
        }
      });
    }

    // Testimonials Section
    if (testimonialsRef.current) {
      gsap.from(testimonialsRef.current.querySelectorAll('.testimonial-card'), {
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: 'top 70%'
        },
        y: 60,
        rotation: -5,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out'
      });
    }

    // Parallax effect for background shapes
    gsap.utils.toArray('.parallax-shape').forEach((shape) => {
      gsap.to(shape, {
        scrollTrigger: {
          trigger: shape,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        y: (i, target) => -ScrollTrigger.maxScroll(window) * target.dataset.speed,
        ease: 'none'
      });
    });

    }, 100);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Effect for cursor-revealing grid
  useEffect(() => {
    const gridOverlay = document.querySelector('.grid-overlay');
    
    if (!gridOverlay) return;
    
    const handleMouseMove = (e) => {
      const rect = gridOverlay.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Create radial gradient to reveal grid around cursor
      const radius = 100; // Radius of the reveal effect
      const gradient = `radial-gradient(circle at ${x}px ${y}px, transparent ${radius * 0.6}px, rgba(0,0,0,0.7) ${radius}px)`;
      
      gridOverlay.style.backgroundImage = `${gradient}, linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`;
      gridOverlay.style.backgroundSize = '50px 50px';
      gridOverlay.style.opacity = '1';
    };
    
    const handleMouseEnter = () => {
      gridOverlay.style.opacity = '1';
    };
    
    const handleMouseLeave = () => {
      gridOverlay.style.opacity = '0';
    };
    
    const heroSection = heroRef.current;
    if (heroSection) {
      heroSection.addEventListener('mousemove', handleMouseMove);
      heroSection.addEventListener('mouseenter', handleMouseEnter);
      heroSection.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (heroSection) {
        heroSection.removeEventListener('mousemove', handleMouseMove);
        heroSection.removeEventListener('mouseenter', handleMouseEnter);
        heroSection.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Rave - Connect Creators, Sales Agents & Companies</title>
        <meta name="description" content="Join the Rave revolution. Earn through affiliate marketing and sales." />
      </Head>

      {/* Unique Expandable/Shrinkable Navigation - No Logo */}
      <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/10 backdrop-blur-sm' : 'bg-black/10 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {/* Minimal Logo - Just Text */}
            <Link href="/" className="relative group">
              <div className="flex items-center space-x-3">
                <span className="text-white font-bold text-2xl tracking-tight">RAVE</span>
              </div>
            </Link>

            {/* Expandable Menu Button */}
            <button
              onClick={() => setNavExpanded(!navExpanded)}
              className="relative w-12 h-12 flex items-center justify-center group"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-5 flex flex-col justify-between">
                <span className={`block h-0.5 w-full bg-white transform transition-all duration-300 ${
                  navExpanded ? 'rotate-45 translate-y-2' : ''
                }`}></span>
                <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                  navExpanded ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`block h-0.5 w-full bg-white transform transition-all duration-300 ${
                  navExpanded ? '-rotate-45 -translate-y-2' : ''
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Expandable Menu Panel */}
        <div className={`overflow-hidden transition-all duration-500 ease-out ${
          navExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="container mx-auto px-6 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quick Links */}
              <div className="space-y-3">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Explore</p>
                <a href="#who-are-rave-heads" onClick={() => setNavExpanded(false)} className="block text-white hover:text-gray-300 transition-colors py-2 font-medium">
                  About Rave Heads
                </a>
                <a href="#for-creators" onClick={() => setNavExpanded(false)} className="block text-white hover:text-gray-300 transition-colors py-2 font-medium">
                  For Creators
                </a>
                <a href="#for-sales-agents" onClick={() => setNavExpanded(false)} className="block text-white hover:text-gray-300 transition-colors py-2 font-medium">
                  For Sales Agents
                </a>
                <a href="#for-companies" onClick={() => setNavExpanded(false)} className="block text-white hover:text-gray-300 transition-colors py-2 font-medium">
                  For Companies
                </a>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Features</p>
                <Link href="/rave-feed" onClick={() => setNavExpanded(false)} className="block text-white hover:text-gray-300 transition-colors py-2 font-medium">
                  The Rave Feed
                </Link>
                <Link href="/rave-ideas" onClick={() => setNavExpanded(false)} className="block text-white hover:text-gray-300 transition-colors py-2 font-medium">
                  Launchpad
                </Link>
                <Link href="/freelance" onClick={() => setNavExpanded(false)} className="block text-white hover:text-gray-300 transition-colors py-2 font-medium">
                  Freelance Marketplace
                </Link>
                <a href="#contests" onClick={() => setNavExpanded(false)} className="block text-white hover:text-gray-300 transition-colors py-2 font-medium">
                  Contests
                </a>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Get Started</p>
                <Link href="/register?role=creator" onClick={() => setNavExpanded(false)} className="block bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition text-center">
                  Join as Creator
                </Link>
                <Link href="/register?role=sales" onClick={() => setNavExpanded(false)} className="block bg-gray-800 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-700 transition text-center">
                  Join as Sales Agent
                </Link>
                <Link href="/login" onClick={() => setNavExpanded(false)} className="block border-2 border-white text-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-black transition text-center">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding under fixed nav */}

      {/* Hero Section with CTA - Grid and Stardust Only */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20 min-h-screen flex items-center overflow-hidden">
        {/* Animated grid background - extends to navbar area */}
        <div className="absolute inset-0">
          <div className="grid-background absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite',
          }}></div>
                
          {/* Star dust particles - only stardust */}
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
        <div className="grid-overlay absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 60px, rgba(0,0,0,0.7) 100px), linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}></div>
              
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Static badge - simplified */}
            <div className="hero-badge inline-block mb-6">
              <span className="bg-white/10 text-white px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase border border-white/20 shadow-lg transition-all duration-300">
                The Future of Affiliate Marketing
              </span>
            </div>
                  
            {/* Static title - simplified */}
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
            
            {/* Static CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Link href="/register?role=creator" className="hero-cta group relative bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-full text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-white/20 overflow-hidden border border-white/20">
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/30 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="relative flex items-center justify-center">
                  Join as Creator
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              
              <Link href="/register?role=sales" className="hero-cta group relative bg-white/5 backdrop-blur-md text-white px-10 py-5 rounded-full text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-white/20 overflow-hidden border border-white/20">
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="relative flex items-center justify-center">
                  Join as Sales Agent
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              
              <Link href="/register?role=freelancer" className="hero-cta group relative bg-transparent backdrop-blur-md text-white px-10 py-5 rounded-full text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-white/20 overflow-hidden border border-white/20">
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="relative flex items-center justify-center">
                  Join as Freelancer
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </div>

            <div className="hero-subtitle mb-12">
              <p className="text-gray-400">
                Are you a company looking to hire? <Link href="/register?role=company" className="text-white font-bold hover:underline hover:text-gray-200 transition">Sign up as a Company</Link>
              </p>
            </div>

            <p className="hero-subtitle text-gray-400 text-sm">
              Already a member? <Link href="/login" className="text-white font-bold underline hover:no-underline transition-all duration-300 hover:tracking-wide hover:text-gray-200">Sign in</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Add custom animations in style tag */}
      <style jsx>{`
        /* Ensure content is visible by default */
        .hero-badge,
        .hero-title,
        .hero-subtitle,
        .hero-cta,
        .creator-emoji,
        .creator-feature,
        .creator-card,
        .sales-card,
        .sales-feature,
        .company-feature,
        .company-card,
        .freelance-card,
        .contest-card,
        .testimonial-card {
          opacity: 1 !important;
          visibility: visible !important;
        }

        /* Starlight animations */
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .star {
          animation: twinkle ease-in-out infinite;
        }

        @keyframes shooting {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(300px) translateY(300px);
            opacity: 0;
          }
        }

        .shooting-star {
          width: 100px;
          top: 20%;
          left: 10%;
          animation: shooting 3s ease-in-out infinite;
          animation-delay: 2s;
        }

        .shooting-star-2 {
          width: 80px;
          top: 40%;
          right: 20%;
          animation: shooting 4s ease-in-out infinite;
          animation-delay: 4s;
        }

        .shooting-star-3 {
          width: 120px;
          top: 60%;
          left: 30%;
          animation: shooting 5s ease-in-out infinite;
          animation-delay: 6s;
        }
        
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(-5deg); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.05); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
+       @keyframes gridMove {
+         0% { transform: translate(0, 0); }
+         100% { transform: translate(50px, 50px); }
+       }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>

      {/* Who Are Rave Heads? */}
      <section ref={raveHeadsRef} id="who-are-rave-heads" className="py-24 bg-black text-white relative overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-ping"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-black mb-8 animate-fade-in-up">
              Who Are <span className="inline-block hover:scale-110 transition-transform duration-300 cursor-default">Rave</span> <span className="inline-block hover:scale-110 transition-transform duration-300 cursor-default">Heads?</span>
            </h2>
            <div className="w-24 h-1 bg-white mx-auto mb-8 transform hover:w-32 transition-all duration-300"></div>
            <p className="text-xl text-gray-300 mb-6 leading-relaxed animate-fade-in-up animation-delay-200">
              <strong className="text-white hover:tracking-wide transition-all duration-300">Rave Heads</strong> are our elite community of passionate <strong className="text-white hover:tracking-wide transition-all duration-300">Creators</strong> and <strong className="text-white hover:tracking-wide transition-all duration-300">Sales Agents</strong> who drive growth and earn rewards.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed animate-fade-in-up animation-delay-400">
              Whether you're promoting products on social media or closing deals over the phone, Rave empowers you to maximize your earnings through performance-based incentives and exciting contests.
            </p>
          </div>
        </div>
      </section>

      {/* For Creators */}
      <section ref={creatorsRef} id="for-creators" className="py-24 bg-white relative overflow-hidden">
        {/* Subtle animated background */}
        <div className="parallax-shape absolute top-0 right-0 w-96 h-96 bg-gray-100 rounded-full filter blur-3xl opacity-50" data-speed="0.2"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <div className="creator-emoji inline-block mb-4">
                <span className="text-6xl hover:scale-125 transition-transform duration-300 inline-block cursor-pointer">🎨</span>
              </div>
              <h2 className="text-5xl font-black mb-6 text-black group cursor-default">
                For <span className="inline-block group-hover:rotate-3 transition-transform duration-300">Creators</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Turn your social media influence into income. Get verified, access exclusive products, and earn commissions on every sale.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="creator-feature flex items-start group hover:translate-x-2 transition-transform duration-300">
                  <span className="text-2xl mr-4 mt-1 group-hover:scale-125 transition-transform duration-300">→</span>
                  <span className="text-gray-700 text-lg"><strong className="text-black">Generate affiliate links</strong> for any product</span>
                </li>
                <li className="creator-feature flex items-start group hover:translate-x-2 transition-transform duration-300">
                  <span className="text-2xl mr-4 mt-1 group-hover:scale-125 transition-transform duration-300">→</span>
                  <span className="text-gray-700 text-lg"><strong className="text-black">Track performance</strong> in real-time</span>
                </li>
                <li className="creator-feature flex items-start group hover:translate-x-2 transition-transform duration-300">
                  <span className="text-2xl mr-4 mt-1 group-hover:scale-125 transition-transform duration-300">→</span>
                  <span className="text-gray-700 text-lg"><strong className="text-black">Compete in contests</strong> for bonus rewards</span>
                </li>
                <li className="creator-feature flex items-start group hover:translate-x-2 transition-transform duration-300">
                  <span className="text-2xl mr-4 mt-1 group-hover:scale-125 transition-transform duration-300">→</span>
                  <span className="text-gray-700 text-lg"><strong className="text-black">Get paid</strong> for clicks and conversions</span>
                </li>
              </ul>
              <Link href="/register?role=creator" className="inline-block relative bg-black text-white px-8 py-4 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-2xl group overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-gray-700 via-black to-gray-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                <span className="relative">Become a Creator →</span>
              </Link>
            </div>
            <div className="creator-card bg-gray-50 p-10 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-6 border-b-2 border-gray-200 group hover:border-black transition-colors duration-300">
                  <span className="text-gray-600 font-medium">Commission Rate</span>
                  <span className="font-black text-2xl text-black group-hover:scale-110 transition-transform duration-300">Up to 20%</span>
                </div>
                <div className="flex justify-between items-center pb-6 border-b-2 border-gray-200 group hover:border-black transition-colors duration-300">
                  <span className="text-gray-600 font-medium">Payout Frequency</span>
                  <span className="font-black text-2xl text-black group-hover:scale-110 transition-transform duration-300">Weekly</span>
                </div>
                <div className="flex justify-between items-center pb-6 border-b-2 border-gray-200 group hover:border-black transition-colors duration-300">
                  <span className="text-gray-600 font-medium">Products Available</span>
                  <span className="font-black text-2xl text-black group-hover:scale-110 transition-transform duration-300">500+</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-gray-600 font-medium">Verification</span>
                  <span className="font-black text-2xl text-black group-hover:scale-110 transition-transform duration-300">Required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
+       @keyframes shimmer {
+         0% { transform: translateX(-100%); }
+         100% { transform: translateX(100%); }
+       }
        
        .animate-fade-in-left {
          animation: fade-in-left 1s ease-out;
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 1s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
+       .animate-shimmer {
+         animation: shimmer 2s linear infinite;
+       }
      `}</style>

      {/* For Sales Agents */}
      <section ref={salesRef} id="for-sales-agents" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="sales-card bg-white p-10 rounded-3xl shadow-xl border border-gray-200 order-2 md:order-1 hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-6 border-b-2 border-gray-200">
                  <span className="text-gray-600 font-medium">Base Commission</span>
                  <span className="font-black text-2xl text-black">5-15%</span>
                </div>
                <div className="flex justify-between items-center pb-6 border-b-2 border-gray-200">
                  <span className="text-gray-600 font-medium">Bonus Incentives</span>
                  <span className="font-black text-2xl text-black">Yes</span>
                </div>
                <div className="flex justify-between items-center pb-6 border-b-2 border-gray-200">
                  <span className="text-gray-600 font-medium">Weekly Test</span>
                  <span className="font-black text-2xl text-black">Required</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Companies Available</span>
                  <span className="font-black text-2xl text-black">50+</span>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-block mb-4">
                <span className="text-6xl">📞</span>
              </div>
              <h2 className="text-5xl font-black mb-6 text-black">For Sales Agents</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Prove your skills, access high-quality leads, and earn commissions on every successful conversion.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="sales-feature flex items-start group hover:translate-x-2 transition-transform duration-300">
                  <span className="text-2xl mr-4 mt-1 group-hover:scale-125 transition-transform duration-300">→</span>
                  <span className="text-gray-700 text-lg"><strong className="text-black">Weekly skill tests</strong> to prove your ability</span>
                </li>
                <li className="sales-feature flex items-start group hover:translate-x-2 transition-transform duration-300">
                  <span className="text-2xl mr-4 mt-1 group-hover:scale-125 transition-transform duration-300">→</span>
                  <span className="text-gray-700 text-lg"><strong className="text-black">Access verified leads</strong> from top companies</span>
                </li>
                <li className="sales-feature flex items-start group hover:translate-x-2 transition-transform duration-300">
                  <span className="text-2xl mr-4 mt-1 group-hover:scale-125 transition-transform duration-300">→</span>
                  <span className="text-gray-700 text-lg"><strong className="text-black">Track your performance</strong> and improve</span>
                </li>
                <li className="sales-feature flex items-start group hover:translate-x-2 transition-transform duration-300">
                  <span className="text-2xl mr-4 mt-1 group-hover:scale-125 transition-transform duration-300">→</span>
                  <span className="text-gray-700 text-lg"><strong className="text-black">Earn incentives</strong> for top performance</span>
                </li>
              </ul>
              <Link href="/register?role=sales" className="inline-block bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition transform hover:scale-105 shadow-lg">
                Become a Sales Agent →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Companies */}
      <section ref={companiesRef} id="for-companies" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <div className="inline-block mb-4">
                <span className="text-6xl">🏢</span>
              </div>
              <h2 className="text-5xl font-black mb-6 text-black">For Companies</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Scale your business with a network of verified creators and skilled sales agents. Pay only for results.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="company-feature flex items-start group hover:translate-x-2 transition-transform duration-300">
                  <span className="text-2xl mr-4 mt-1 group-hover:scale-125 transition-transform duration-300">→</span>
                  <span className="text-gray-700 text-lg"><strong className="text-black">Upload your products</strong> and set commission rates</span>
                </li>
                <li className="company-feature flex items-start group hover:translate-x-2 transition-transform duration-300">
                  <span className="text-2xl mr-4 mt-1 group-hover:scale-125 transition-transform duration-300">→</span>
                  <span className="text-gray-700 text-lg"><strong className="text-black">Access thousands</strong> of verified creators</span>
                </li>
                <li className="company-feature flex items-start group hover:translate-x-2 transition-transform duration-300">
                  <span className="text-2xl mr-4 mt-1 group-hover:scale-125 transition-transform duration-300">→</span>
                  <span className="text-gray-700 text-lg"><strong className="text-black">Approve sales agents</strong> for your leads</span>
                </li>
                <li className="company-feature flex items-start group hover:translate-x-2 transition-transform duration-300">
                  <span className="text-2xl mr-4 mt-1 group-hover:scale-125 transition-transform duration-300">→</span>
                  <span className="text-gray-700 text-lg"><strong className="text-black">Track conversions</strong> and ROI in real-time</span>
                </li>
              </ul>
              <Link href="/register?role=company" className="inline-block bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition transform hover:scale-105 shadow-lg">
                Register Your Company →
              </Link>
            </div>
            <div className="company-card bg-gray-50 p-10 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-6 border-b-2 border-gray-200">
                  <span className="text-gray-600 font-medium">Setup Fee</span>
                  <span className="font-black text-2xl text-black">Free</span>
                </div>
                <div className="flex justify-between items-center pb-6 border-b-2 border-gray-200">
                  <span className="text-gray-600 font-medium">Commission Based</span>
                  <span className="font-black text-2xl text-black">Yes</span>
                </div>
                <div className="flex justify-between items-center pb-6 border-b-2 border-gray-200">
                  <span className="text-gray-600 font-medium">Analytics Dashboard</span>
                  <span className="font-black text-2xl text-black">Included</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Support</span>
                  <span className="font-black text-2xl text-black">24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Freelance Marketplace Section */}
      <section ref={freelanceRef} id="freelance-marketplace" className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Animated background element */}
        <div className="parallax-shape absolute top-1/2 left-0 w-64 h-64 bg-black opacity-5 rounded-full filter blur-3xl" data-speed="0.3"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-black">
              Freelance <span className="inline-block hover:scale-110 transition-transform duration-300 cursor-default">Marketplace</span>
            </h2>
            <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">Connect with expert talent or start your freelance journey</p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="freelance-card bg-white p-10 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
              <div className="mb-8 flex items-center justify-between">
                <span className="text-4xl">🚀</span>
                <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Fiverr Style</span>
              </div>
              <h3 className="text-3xl font-black mb-4 text-black">For Freelancers</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Build your profile, create "Gigs", and start earning from global clients. RAVE handles the escrow, payments, and disputes.
              </p>
              <ul className="space-y-3 mb-10">
                {['Create & Publish Gigs', 'Set Your Own Pricing', 'Real-time Order Tracking', 'Escrow Protected Payments'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700 group">
                    <span className="text-black mr-3 transform group-hover:scale-125 transition-transform duration-300">→</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register?role=freelancer" className="inline-block bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition-all duration-300 shadow-lg transform hover:scale-105">
                Start Selling →
              </Link>
            </div>

            <div className="freelance-card bg-white p-10 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
              <div className="mb-8 flex items-center justify-between">
                <span className="text-4xl">💼</span>
                <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Upwork Ready</span>
              </div>
              <h3 className="text-3xl font-black mb-4 text-black">For Clients</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Browse expert freelancers, place orders instantly, or post your custom jobs. Quality work guaranteed with our dispute system.
              </p>
              <ul className="space-y-3 mb-10">
                {['Browse & Filter Gigs', 'Secure Checkout (Escrow)', 'Manage Active Orders', 'Raise Disputes if Needed'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700 group">
                    <span className="text-black mr-3 transform group-hover:scale-125 transition-transform duration-300">→</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/freelance/gigs" className="inline-block bg-white text-black px-8 py-4 rounded-full font-bold border-2 border-black hover:bg-black hover:text-white transition-all duration-300 shadow-lg transform hover:scale-105">
                Browse Talent →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rave Feed Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <span className="inline-block bg-black text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
              🔥 Social Platform
            </span>
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-black">
              The <span className="inline-block hover:scale-110 transition-transform duration-300 cursor-default">Rave</span> Feed
            </h2>
            <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Share your wins, progress, and collaborate with other Rave Heads. Build your brand and grow together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {/* Feed Features */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200 hover:shadow-2xl hover:border-black transition-all duration-300">
              <div className="text-5xl mb-6">🎭</div>
              <h3 className="text-3xl font-black text-black mb-4">Rave Moments</h3>
              <p className="text-gray-600 mb-6">Share your journey, celebrate wins, and document progress</p>
              <ul className="space-y-3">
                {[
                  '🏆 Rave Wins - Celebrate achievements',
                  '📈 Rave Progress - Track your growth',
                  '🎯 Rave Sessions - Share work updates',
                  '🤝 Rave Collabs - Team up with others',
                  '🎉 Rave Milestones - Mark big moments'
                ].map((item, i) => (
                  <li key={i} className="flex items-start group">
                    <span className="text-black mr-3 transform group-hover:scale-125 transition-transform duration-300">→</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Engagement Features */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200 hover:shadow-2xl hover:border-black transition-all duration-300">
              <div className="text-5xl mb-6">🔥</div>
              <h3 className="text-3xl font-black text-black mb-4">Rave Vibes</h3>
              <p className="text-gray-600 mb-6">Engage with the community using unique reactions</p>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <span className="text-3xl">🔥</span>
                  <span className="font-bold text-black">Fire Vibe</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <span className="text-3xl">🚀</span>
                  <span className="font-bold text-black">Rocket Vibe</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <span className="text-3xl">⭐</span>
                  <span className="font-bold text-black">Star Vibe</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <span className="text-3xl">👏</span>
                  <span className="font-bold text-black">Clap Vibe</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <span className="text-3xl">❤️</span>
                  <span className="font-bold text-black">Heart Vibe</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/rave-feed" className="inline-block bg-black text-white px-10 py-5 rounded-full font-bold hover:bg-gray-900 transition-all duration-300 shadow-2xl transform hover:scale-105">
              Explore The Rave Feed →
            </Link>
          </div>
        </div>
      </section>

      {/* Rave Ideas / Launchpad Section */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-500 opacity-5 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <span className="inline-block bg-white text-black px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
              🚀 Startup Hub
            </span>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Rave <span className="inline-block hover:scale-110 transition-transform duration-300 cursor-default">Launchpad</span>
            </h2>
            <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Turn your startup ideas into reality. Find co-founders, build your squad, and distribute equity to contributors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {/* Idea Posting */}
            <div className="bg-gray-900 rounded-3xl p-8 border-2 border-gray-800 hover:border-white transition-all duration-300 hover:shadow-2xl">
              <div className="text-5xl mb-6">💡</div>
              <h3 className="text-2xl font-black mb-4">Post Your Idea</h3>
              <p className="text-gray-400 mb-6">
                Share your startup vision, describe what you're building, and what skills you need
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Detailed idea descriptions</li>
                <li>• Skills & roles needed</li>
                <li>• Funding goals</li>
                <li>• Equity distribution</li>
              </ul>
            </div>

            {/* Build Squad */}
            <div className="bg-gray-900 rounded-3xl p-8 border-2 border-gray-800 hover:border-white transition-all duration-300 hover:shadow-2xl">
              <div className="text-5xl mb-6">🤝</div>
              <h3 className="text-2xl font-black mb-4">Build Your Squad</h3>
              <p className="text-gray-400 mb-6">
                Find talented contributors, accept applications, and build your dream team
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Browse applications</li>
                <li>• Review skills & portfolios</li>
                <li>• Invite collaborators</li>
                <li>• Manage your team</li>
              </ul>
            </div>

            {/* Equity Sharing */}
            <div className="bg-gray-900 rounded-3xl p-8 border-2 border-gray-800 hover:border-white transition-all duration-300 hover:shadow-2xl">
              <div className="text-5xl mb-6">💰</div>
              <h3 className="text-2xl font-black mb-4">Share Equity</h3>
              <p className="text-gray-400 mb-6">
                Distribute equity to contributors, set vesting periods, and track ownership
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Flexible equity splits</li>
                <li>• Vesting schedules</li>
                <li>• Transparent tracking</li>
                <li>• Legal framework ready</li>
              </ul>
            </div>
          </div>

          {/* Featured Ideas Preview */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-800 max-w-4xl mx-auto mb-12">
            <h3 className="text-2xl font-black mb-6 text-center">Active Rave Ideas</h3>
            <div className="space-y-4">
              {[
                { title: 'AI-Powered Fitness App', founder: 'Sarah Tech', equity: '15%', applicants: 12, funding: '$50k' },
                { title: 'Sustainable Fashion Platform', founder: 'Green Team', equity: '20%', applicants: 8, funding: '$30k' },
                { title: 'EdTech for Remote Learning', founder: 'Learn Hub', equity: '10%', applicants: 15, funding: '$75k' }
              ].map((idea, i) => (
                <div key={i} className="bg-black/50 rounded-xl p-4 flex justify-between items-center hover:bg-black/70 transition">
                  <div>
                    <h4 className="font-bold text-lg">{idea.title}</h4>
                    <p className="text-sm text-gray-400">by {idea.founder}</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-green-400">{idea.equity}</div>
                      <div className="text-gray-500">Equity</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{idea.applicants}</div>
                      <div className="text-gray-500">Applicants</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-400">{idea.funding}</div>
                      <div className="text-gray-500">Goal</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link href="/rave-ideas" className="inline-block bg-white text-black px-10 py-5 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 shadow-2xl transform hover:scale-105">
              Explore Launchpad →
            </Link>
          </div>
        </div>
      </section>

      {/* Active Contests */}
      <section ref={contestsRef} id="contests" className="py-24 bg-black text-white relative overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="parallax-shape absolute top-0 left-1/4 w-96 h-96 bg-white opacity-5 rounded-full filter blur-3xl" data-speed="0.4"></div>
        <div className="parallax-shape absolute bottom-0 right-1/4 w-96 h-96 bg-gray-500 opacity-5 rounded-full filter blur-3xl" data-speed="0.6"></div>
        
        {/* Sparkle effects */}
        <div className="contest-sparkle absolute top-20 left-20 w-1 h-1 bg-white rounded-full"></div>
        <div className="contest-sparkle absolute top-40 right-40 w-1 h-1 bg-white rounded-full"></div>
        <div className="contest-sparkle absolute bottom-40 left-1/3 w-1 h-1 bg-white rounded-full"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              Active <span className="inline-block hover:scale-110 transition-transform duration-300 cursor-default">Contests</span>
            </h2>
            <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-xl text-gray-400">Compete with the best and win big prizes</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'Top Creator Challenge',
                prize: '$5,000',
                ends: '15 days left',
                participants: 234,
                description: 'Top 3 creators with highest conversions win cash prizes'
              },
              {
                title: 'Sales Sprint',
                prize: '$3,000',
                ends: '22 days left',
                participants: 156,
                description: 'Close the most deals in 30 days and win'
              },
              {
                title: 'New Product Launch',
                prize: '$2,500',
                ends: '8 days left',
                participants: 189,
                description: 'Promote our newest product line for exclusive rewards'
              }
            ].map((contest, idx) => (
              <div key={idx} className="contest-card group relative bg-gray-900 rounded-2xl p-8 hover:bg-gray-800 transition-all duration-500 transform hover:scale-105 border border-gray-800 hover:border-white">
                {/* Glowing effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                
                <div className="flex justify-between items-start mb-6 relative">
                  <h3 className="text-2xl font-bold text-white group-hover:tracking-wide transition-all duration-300">{contest.title}</h3>
                  <span className="text-3xl animate-bounce-slow group-hover:rotate-12 transition-transform duration-300">🏆</span>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{contest.description}</p>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm group/prize">
                    <span className="text-gray-500">Prize Pool</span>
                    <span className="font-black text-xl text-white group-hover/prize:scale-110 group-hover/prize:text-gray-100 transition-all duration-300">{contest.prize}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Participants</span>
                    <span className="font-bold text-white">{contest.participants}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Time Remaining</span>
                    <span className="font-bold text-white animate-pulse">{contest.ends}</span>
                  </div>
                </div>
                <button className="w-full relative bg-white text-black py-3 rounded-full font-bold transition-all duration-300 overflow-hidden group/btn">
                  <span className="absolute inset-0 bg-gradient-to-r from-gray-300 via-white to-gray-300 transform translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"></span>
                  <span className="relative">View Contest</span>
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <p className="text-gray-400 mb-6 text-lg">Want to participate in contests?</p>
            <Link href="/register" className="inline-block relative bg-white text-black px-10 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 group overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-gray-100 via-white to-gray-100 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
              <span className="relative">Join Rave Today →</span>
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes expand {
          0% { width: 0; }
          100% { width: 6rem; }
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-expand {
          animation: expand 1s ease-out;
        }
      `}</style>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-black">What Rave Heads Say</h2>
            <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">Real people, real results</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Sarah Williams',
                role: 'Creator',
                quote: 'I\'ve earned over $15,000 in just 3 months! Rave makes it so easy to monetize my content.',
                earnings: '$15,234'
              },
              {
                name: 'Mike Johnson',
                role: 'Sales Agent',
                quote: 'The weekly tests keep me sharp, and the leads are high quality. Best decision I made.',
                earnings: '$8,450'
              },
              {
                name: 'Tech Solutions Inc.',
                role: 'Company',
                quote: 'We scaled from 50 to 500 sales per month using Rave. The ROI is incredible.',
                earnings: '+900% ROI'
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="testimonial-card bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 hover:border-black transition hover:shadow-lg">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-black rounded-full mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <p className="font-black text-xl text-black">{testimonial.name}</p>
                  <p className="text-sm text-gray-500 uppercase tracking-wide">{testimonial.role}</p>
                </div>
                <p className="text-gray-700 italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="border-t-2 border-gray-200 pt-6">
                  <p className="text-3xl font-black text-black">{testimonial.earnings}</p>
                  <p className="text-sm text-gray-500 uppercase tracking-wide">Total Earnings</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <img src="/logo.png" alt="RAVE Logo" className="h-8 w-auto mb-4 hover:scale-105 transition-transform duration-300" />
              <p className="text-gray-400 leading-relaxed">
                Empowering creators, sales agents, and companies to grow together.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 uppercase tracking-wide">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
                <li><Link href="/how-it-works" className="text-gray-400 hover:text-white transition">How It Works</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition">FAQs</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 uppercase tracking-wide">Get Started</h4>
              <ul className="space-y-3">
                <li><Link href="/login" className="text-gray-400 hover:text-white transition">Login</Link></li>
                <li><Link href="/register" className="text-gray-400 hover:text-white transition">Sign Up</Link></li>
                <li><Link href="/register?role=creator" className="text-gray-400 hover:text-white transition">Become a Creator</Link></li>
                <li><Link href="/register?role=sales" className="text-gray-400 hover:text-white transition">Become a Sales Agent</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 uppercase tracking-wide">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li>hello@rave.com</li>
                <li>+1 (555) 123-4567</li>
                <li>San Francisco, CA</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm">&copy; 2026 Rave. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-500 hover:text-white transition">Privacy</a>
                <a href="#" className="text-gray-500 hover:text-white transition">Terms</a>
                <a href="#" className="text-gray-500 hover:text-white transition">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
