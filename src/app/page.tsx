"use client";

import React, { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence, Variants, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, MapPin, Phone, Mail, ChevronDown, Sparkles, Megaphone } from 'lucide-react';
import Link from 'next/link';
import AnimatedHeroHeading from '@/components/AnimatedHeroHeading';
import MysteryBoxSection from '@/components/MysteryBoxSection';
import PremiumScratchCard from '@/components/PremiumScratchCard';
import EnquireNowModal from '@/components/EnquireNowModal';

import './black-cards.css';
import './home.css';


const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } as any }
};

const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } as any }
};

const slideDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } as any }
};

const dropIn: Variants = {
  hidden: { opacity: 0, y: -200 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 25, stiffness: 180 } as any }
};

const bounceInDown: Variants = {
  hidden: { opacity: 0, y: -60 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 20, stiffness: 150 } as any }
};

const revealDown: Variants = {
  hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
  visible: { opacity: 1, clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.4 } as any }
};

const swipeLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } as any }
};

const swipeRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } as any }
};

const swipeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } as any }
};

const swipeDown: Variants = {
  hidden: { opacity: 0, y: -60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } as any }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 } as any
  }
};

/*
 * SCRATCH CARD PLACEMENT GUIDE
 * ============================
 * 
 * To change the scratch card placement, modify the SCRATCH_CARD_CONFIG below:
 * 
 * 1. BELOW HERO SECTION (Default - Recommended for lead generation):
 *    placement: 'below-hero'
 *    - Shows prominently after hero section
 *    - High visibility and conversion
 *    - Best for capturing immediate attention
 * 
 * 2. FLOATING POPUP (Attention-grabbing):
 *    placement: 'floating-popup'
 *    - Shows as modal popup after delay
 *    - Can be closed by user
 *    - Good for re-engagement
 * 
 * 3. STICKY CORNER (Non-intrusive):
 *    placement: 'sticky-corner'
 *    - Shows in bottom-right corner
 *    - Can be minimized
 *    - Least intrusive option
 * 
 * Additional Options:
 * - autoShow: true/false (for popup and sticky)
 * - delay: milliseconds (for popup and sticky)
 * - useModalVersion: true to use old modal, false for new inline
 */

const heroServices = [
  { name: 'Branding', img: '/signage-branding.png', link: '/services/branding' },
  { name: 'Digital Printing', img: '/signage-digital-print.png', link: '/services/digital-graphics' },
  { name: 'Vehicle Branding', img: '/signage-vehicle.png', link: '/services/vehicle-branding' },
  { name: 'Signage', img: '/signage-production.png', link: '/services/signage' },
  { name: 'Exhibition Stands', img: '/signage-exhibition.png', link: '/services/exhibition' },
  { name: 'Facade Cladding', img: '/signage-cladding.png', link: '/services/cladding' },
];

// Two groups of 4 for the paginated carousel
const carouselPages = [
  heroServices.slice(0, 4),
  [...heroServices.slice(4), ...heroServices.slice(0, 2)],
];

export default function Home() {
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'whyus' | 'reach' | 'solutions'>('whyus');
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [openBrandAccordion, setOpenBrandAccordion] = useState<number | null>(0);
  const [isScratchCardOpen, setIsScratchCardOpen] = useState(false);
  const [enquireItem, setEnquireItem] = useState<string | null>(null);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [carouselPage, setCarouselPage] = useState(0);
  


  // 3D Parallax Mouse Tracking
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { damping: 20, stiffness: 100 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  const rotateX = useTransform(springY, [0, 1], [10, -10]);
  const rotateY = useTransform(springX, [0, 1], [-10, 10]);
  // bgX / bgY kept for when the building-image background is restored
  // const bgX = useTransform(springX, [0, 1], [-20, 20]);
  // const bgY = useTransform(springY, [0, 1], [-20, 20]);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const locations = [
    { 
      name: 'Dubai Marina', 
      image: '/projects-hero-bg.png'
    },
    { 
      name: 'Abu Dhabi Corniche', 
      image: '/services-hero-bg.png'
    },
    { 
      name: 'Downtown Dubai', 
      image: '/home-hero-bg.png'
    },
    { 
      name: 'Jumeirah Beach', 
      image: '/about-hero-bg.png'
    }
  ];

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroServices.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselPage((prev) => (prev + 1) % carouselPages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLocationIndex((prev) => (prev + 1) % locations.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [locations.length]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        setSubmitStatus({ success: true, message: 'Message sent successfully!' });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus({ success: false, message: data.error || 'Something went wrong.' });
      }
    } catch (_error) {
      setSubmitStatus({ success: false, message: 'Failed to connect to the server.' });
    }
    
    setIsSubmitting(false);
  };

  return (
    <>
      {isScratchCardOpen && (
        <PremiumScratchCard
          onClose={() => setIsScratchCardOpen(false)}
          onClaim={() => {
            console.log("Offer Claimed - Showing success message");
          }}
        />
      )}

      {enquireItem && (
        <EnquireNowModal
          serviceName={enquireItem}
          source="home-page"
          onClose={() => setEnquireItem(null)}
        />
      )}
      


      {/* Hero Section */}
      <section className="hero-section" onMouseMove={handleHeroMouseMove}>

        {/* ── ORIGINAL building image — uncomment to restore ──────────────────
        <motion.div
          className="hero-background"
          style={{ x: bgX, y: bgY }}
        >
          <img
            src="/dubai-hero-building.jpg"
            alt="One Click Advertisement - Dubai Professional Buildings"
          />
        </motion.div>
        ─────────────────────────────────────────────────────────────────────── */}

        {/* Service image slideshow background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
          {heroServices.map((service, index) => (
            <motion.div
              key={service.link}
              animate={{
                opacity: heroSlideIndex === index ? 1 : 0,
                scale:   heroSlideIndex === index ? 1 : 1.06,
              }}
              initial={{ opacity: 0, scale: 1.06 }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <img
                src={service.img}
                alt={service.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.72) saturate(1.15)' }}
              />
            </motion.div>
          ))}
        </div>

        <div className="hero-overlay"></div>

        {/* Slide indicators — must be above overlay (z-index > 1) and above hero-content (z-index > 2), below claim-btn */}
        <div style={{ position: 'absolute', bottom: '11rem', left: '2rem', zIndex: 4, display: 'flex', flexDirection: 'column', gap: '0.55rem', pointerEvents: 'auto' }}>
          {heroServices.map((service, index) => (
            <div
              key={index}
              onClick={() => setHeroSlideIndex(index)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                opacity: heroSlideIndex === index ? 1 : 0.45,
                transition: 'opacity 0.4s ease',
              }}
            >
              <div style={{
                width: heroSlideIndex === index ? '28px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: heroSlideIndex === index ? '#e61e25' : 'rgba(255,255,255,0.8)',
                transition: 'all 0.4s ease',
                boxShadow: heroSlideIndex === index ? '0 0 10px rgba(230,30,37,0.8)' : 'none',
                flexShrink: 0,
              }} />
              {heroSlideIndex === index && (
                <span style={{ color: 'white', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.9)', whiteSpace: 'nowrap' }}>
                  {service.name}
                </span>
              )}
            </div>
          ))}
        </div>

        <motion.div 
          className="hero-content"
          style={{ rotateX, rotateY }}
          initial={{ opacity: 0, rotateX: 20, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          transition={{ duration: 1.0, type: "spring", bounce: 0.3 }}
        >
          <AnimatedHeroHeading 
            onReveal={() => {}}
            onTagClick={() => {}}
          />
          <motion.div className="hero-buttons" variants={fadeInUp} style={{ marginBottom: '2rem' }}>
            <Link href="/contact#campaign" className="btn btn-primary">
              Let's build your campaign <ArrowRight size={20} />
            </Link>
            <Link href="/about" className="btn btn-secondary">
              Learn More <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className="claim-btn-floating-container"
          initial={{ opacity: 0, y: 100, scale: 0 }}
          animate={{ opacity: 1, y: 0, scale: 0.45 }}
          transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 20 }}
          style={{ 
            position: 'absolute', 
            bottom: '1rem', 
            right: '1rem', 
            zIndex: 99999, 
            pointerEvents: 'auto',
            transformStyle: 'preserve-3d',
            transform: 'translateZ(500px)',
            width: 'fit-content',
            margin: 0,
            left: 'auto',
            top: 'auto',
            transformOrigin: 'bottom right'
          }}
        >
          <style jsx>{`
            @media (max-width: 768px) {
              .claim-btn-floating-container {
                right: 0.5rem !important;
                bottom: 0.5rem !important;
                transform: scale(0.35) translateZ(500px) !important;
                transform-origin: bottom right;
              }
            }
            @media (max-width: 480px) {
              .claim-btn-floating-container {
                right: 0 !important;
                bottom: 0 !important;
                transform: scale(0.25) translateZ(600px) !important;
                transform-origin: bottom right;
              }
            }
          `}</style>
          {/* Comic-Style Starburst Teaser */}
          <motion.div
            onTap={() => {
              console.log("Home Badge Tapped");
              setIsScratchCardOpen(true);
            }}
            initial={{ scale: 0 }}
            animate={{ 
              scale: [0.75, 1.1, 1],
              rotate: [-2, 2, -2]
            }}
            transition={{ 
              duration: 0.5,
              delay: 1.5,
              scale: { duration: 0.4 },
              rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            style={{
                position: 'relative',
                width: '180px',
                height: '180px',
                minWidth: '180px',
                minHeight: '180px',
                flexShrink: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto',
                WebkitTapHighlightColor: 'transparent'
            }}
          >
              {/* White Starburst Shape */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))'
              }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: '#e61e25' }}>
                   <path d="M50 2 L56 18 L70 8 L72 25 L88 20 L82 35 L98 40 L88 50 L98 60 L82 65 L88 80 L72 75 L70 92 L56 82 L50 98 L44 82 L30 92 L28 75 L12 80 L18 65 L2 60 L12 50 L2 40 L18 35 L12 20 L28 25 L30 8 L44 18 Z" />
                </svg>
              </div>

              {/* Megaphone Icon */}
              <div style={{
                position: 'absolute',
                top: '-5px',
                right: '5px',
                background: 'white',
                padding: '8px',
                borderRadius: '50%',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                zIndex: 15,
                transform: 'rotate(15deg)',
                pointerEvents: 'none'
              }}>
                <Megaphone size={24} color="#000" fill="#000" />
              </div>

              {/* Text Content Overlay */}
              <div style={{
                  position: 'relative',
                  zIndex: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  pointerEvents: 'none'
              }}>
                  <span style={{ 
                      color: '#fff', 
                      fontSize: '18px', 
                      fontWeight: 950, 
                      lineHeight: 1, 
                      letterSpacing: '-0.5px',
                  }}>
                      EXTENDED
                  </span>
                  
                  <span style={{ 
                      color: '#fff', 
                      fontSize: '32px', 
                      fontWeight: 950, 
                      lineHeight: 0.9, 
                      letterSpacing: '-1px',
                  }}>
                      OFFER
                  </span>
              </div>
          </motion.div>
        </motion.div>

        {/* Services Paginated Carousel */}
        <div className="hero-services-strip">
          <AnimatePresence mode="wait">
            <motion.div
              key={carouselPage}
              className="hero-services-ticker"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            >
              {carouselPages[carouselPage].map((service, i) => (
                <Link key={i} href={service.link} className="hero-service-chip">
                  <img src={service.img} alt={service.name} className="hero-service-chip-img" />
                  <div className="hero-service-chip-overlay" />
                  <span className="hero-service-dot" />
                  <div className="hero-service-chip-name">{service.name}</div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Page dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.75rem', paddingBottom: '0.25rem' }}>
            {carouselPages.map((_, i) => (
              <div
                key={i}
                onClick={() => setCarouselPage(i)}
                style={{
                  width: carouselPage === i ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: carouselPage === i ? '#e61e25' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.35s ease',
                  boxShadow: carouselPage === i ? '0 0 8px rgba(230,30,37,0.7)' : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </section>


      {/* We Build Section */}
      <section className="we-build-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container"
        >
          <motion.h2 className="we-build-title" variants={bounceInDown} style={{
            fontWeight: 950,
            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            letterSpacing: '-1px',
            textTransform: 'uppercase',
            lineHeight: 1.1
          }}>
            We build <span style={{
              color: '#e61e25',
              fontWeight: 950,
              textTransform: 'uppercase'
            }}>signs that people actually see</span>
          </motion.h2>
          <motion.p className="we-build-subtitle" variants={slideDown}>
            From simple shop signs to massive city-wide campaigns, we help you get your brand in front of the right people.
          </motion.p>
          
          <motion.div className="portfolio-grid" variants={staggerContainer}>
            {[
               { 
                id: 1, 
                icon: <MapPin size={32} color="#e61e25" />, 
                title: 'Branding for everyone',
                desc: 'We’ll help you create a look that people remember. (Think: Like that local cafe everyone knows by its logo.)',
                image: '/signage-branding.png'
              },
              { 
                id: 2, 
                icon: <Mail size={32} color="#e61e25" />, 
                title: 'Big, bold printing',
                desc: 'High-resolution prints that look sharp from across the street. Perfect for windows and banners.',
                image: '/signage-digital-print.png'
              },
              { 
                id: 3, 
                icon: <Phone size={32} color="#e61e25" />, 
                title: 'Ads on the move',
                desc: 'Turn your car or van into a mobile billboard. One of the best ways to get seen all over town.',
                image: '/signage-vehicle.png'
              },
              { 
                id: 4, 
                icon: <ArrowRight size={32} color="#e61e25" />, 
                title: 'Signs that last',
                desc: 'Indoor, outdoor, or glowing neon. We use tough materials that handle the UAE sun without fading.',
                image: '/signage-production.png'
              },
              { 
                id: 5, 
                icon: <MapPin size={32} color="#e61e25" />, 
                title: 'Pop-up displays',
                desc: 'Exhibition booths and kiosks that make people want to walk over and say hi.',
                image: '/signage-exhibition.png'
              },
              { 
                id: 6, 
                icon: <ArrowRight size={32} color="#e61e25" />, 
                title: 'Facade makeovers',
                desc: 'Give your building a fresh, modern look. Turning old storefronts into local landmarks.',
                image: '/signage-cladding.png'
              }
            ].map((item, index) => (
              <motion.div 
                key={item.id} 
                className="portfolio-item" 
                variants={swipeUp}
                whileHover={{ scale: 1.02 }}
                style={{
                  backgroundImage: `linear-gradient(rgba(12, 12, 12,0.6), rgba(12, 12, 12,0.85)), url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <h3 className="portfolio-title">
                  {item.title.includes('&') ? (
                    <>
                      <span style={{ color: 'white' }}>{item.title.split('&')[0].trim()}</span>
                      <span style={{ color: 'white' }}> & </span>
                      <span style={{ color: 'white' }}>{item.title.split('&')[1]?.trim()}</span>
                    </>
                  ) : item.title}
                </h3>

                <div className="portfolio-divider"></div>
                
                <p className="portfolio-desc" style={{ marginBottom: '1.4rem' }}>{item.desc}</p>

                <button
                  onClick={() => setEnquireItem(item.title)}
                  style={{
                    alignSelf: 'flex-start',
                    padding: '0.6rem 1.3rem',
                    background: 'transparent',
                    color: '#e61e25',
                    border: '2px solid #e61e25',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit',
                    marginBottom: '3.5rem',
                    position: 'relative',
                    zIndex: 20,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#e61e25'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#e61e25'; }}
                >
                  Enquire Now
                </button>

                <div className="portfolio-scallop">
                  <div className="portfolio-number">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Link href="/services" className="btn btn-primary">
              Explore Services <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* For Brands Section */}
      <section className="section section-dark">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="for-brands-section container"
        >
          <motion.div 
            className="for-brands-content" 
            variants={swipeLeft}
          >
            <h2>For Businesses Large & Small</h2>
            <p>
              We make outdoor advertising easy for everyone. Whether you're a startup or a global brand, we help you find the best spots to get noticed across the city.
            </p>
          </motion.div>
          
          <motion.div 
            className="for-brands-accordion"
            variants={swipeRight}
          >
            {[
              { 
                title: 'We handle the hard stuff', 
                desc: 'From the first sketch to the final screw, we take care of everything so you don\'t have to worry about the details.' 
              },
              { 
                title: 'Quality you can trust', 
                desc: 'We use premium materials that stay looking fresh, even in the middle of a UAE summer.' 
              },
              { 
                title: 'No permit headaches', 
                desc: 'We know the RTA and local rules inside out. We\'ll handle all the paperwork and approvals for you.' 
              },
              { 
                title: 'Always on time', 
                desc: 'When we say it\'ll be ready, it\'ll be ready. We deliver and install across the UAE, exactly when you need us.' 
              }
            ].map((item, index) => (
              <div
                key={index}
                className="accordion-item-brand"
              >
                <div
                  className="accordion-header-brand"
                  onClick={() => setOpenBrandAccordion(openBrandAccordion === index ? null : index)}
                >
                  <span>{item.title}</span>
                  <ChevronDown
                    size={20}
                    className={`accordion-icon-brand ${openBrandAccordion === index ? 'open' : ''}`}
                  />
                </div>
                <div className={`accordion-content-brand ${openBrandAccordion === index ? 'open' : ''}`}>
                  <div className="accordion-content-inner-brand">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Prime Locations */}
      <section className="section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="prime-locations container"
        >
          <motion.div 
            className="prime-locations-image" 
            variants={swipeLeft}
            whileHover={{ scale: 1.02, x: 5, transition: { duration: 0.6 } }}
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            {locations.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }}
                animate={{ 
                  opacity: currentLocationIndex === index ? 1 : 0,
                  x: currentLocationIndex === index ? 0 : currentLocationIndex > index ? -100 : 100,
                  scale: currentLocationIndex === index ? 1 : 1.1
                }}
                transition={{ 
                  duration: 0.6, 
                  ease: "easeInOut",
                  delay: currentLocationIndex === index ? 0 : 0
                }}
                style={{
                  position: index === 0 ? 'relative' : 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
              >
                <img 
                  src={location.image}
                  alt={location.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                
                {/* Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(12, 12, 12,0.7) 0%, rgba(12, 12, 12,0.3) 50%, transparent 100%)'
                }} />

                {/* Location Name */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ 
                    opacity: currentLocationIndex === index ? 1 : 0,
                    y: currentLocationIndex === index ? 0 : 30
                  }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '2rem',
                    right: '2rem',
                    color: 'white',
                    zIndex: 2
                  }}
                >
                  <h3 style={{
                    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                    fontWeight: 900,
                    marginBottom: '0.5rem',
                    textShadow: '0 4px 12px rgba(12, 12, 12,0.5)',
                    letterSpacing: '-0.5px'
                  }}>
                    {location.name}
                  </h3>
                  <div style={{
                    width: '60px',
                    height: '4px',
                    background: '#e61e25',
                    borderRadius: '2px',
                    boxShadow: '0 0 10px rgba(230, 30, 37, 0.6)'
                  }} />
                </motion.div>
              </motion.div>
            ))}
            
            {/* Location indicators */}
            <div style={{
              position: 'absolute',
              bottom: '1.5rem',
              right: '2rem',
              display: 'flex',
              gap: '0.5rem',
              zIndex: 10
            }}>
              {locations.map((_, index) => (
                <motion.div
                  key={index}
                  onClick={() => setCurrentLocationIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: currentLocationIndex === index ? '2.5rem' : '0.6rem',
                    height: '0.6rem',
                    borderRadius: '0.3rem',
                    background: currentLocationIndex === index 
                      ? '#e61e25' 
                      : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: currentLocationIndex === index 
                      ? '0 0 12px rgba(230, 30, 37, 0.8)' 
                      : 'none'
                  }}
                />
              ))}
            </div>
          </motion.div>
          <motion.div 
            className="prime-locations-content" 
            variants={swipeRight}
            whileHover={{ x: -5, transition: { duration: 0.6 } }}
          >
            <h2>Right where your customers are</h2>
            <p>
              We’ve picked the best spots in high-traffic areas to make sure people see your brand. From the busiest streets in Dubai to the main hubs in Abu Dhabi, we’ve got the UAE covered.
            </p>
          </motion.div>
        </motion.div>
      </section>




      {/* We Reach Section */}
      <section className="we-reach-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="we-reach-content container"
        >
          <motion.div 
            className="we-reach-text" 
            variants={swipeLeft}
            whileHover={{ x: 5, transition: { duration: 0.6 } }}
          >
            <h2>We’re all over the city</h2>
            <p>
              With teams in Dubai, Abu Dhabi, and across the UAE, we’re ready to help you reach your customers wherever they are.
            </p>
            <Link href="/contact" className="btn btn-primary">
              Let's chat <ArrowRight size={20} />
            </Link>
          </motion.div>
          <motion.div 
            className="we-reach-image" 
            variants={swipeRight}
            whileHover={{ scale: 1.02, x: -5, transition: { duration: 0.6 } }}
          >
            <img 
              src="/images/cities_reach.png"
              alt="Cities"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Tabbed Section - Why Us, Reach, Solutions */}
      <section className="section" style={{ background: 'rgba(12, 12, 12, 0.9)', backdropFilter: 'blur(10px)', padding: 'clamp(4rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem)' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container"
        >
          {/* Tabs */}
          <motion.div 
            variants={fadeInDown}
            className="tabs-nav-wrapper"
            style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginBottom: '3rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              width: '100%'
            }}
          >
            <div 
              onClick={() => setActiveTab('whyus')}
              className={`tabs-nav-item ${activeTab === 'whyus' ? 'active' : ''}`}
              style={{ 
                padding: '1rem 3rem', 
                background: activeTab === 'whyus' ? '#e61e25' : 'rgba(255,255,255,0.1)', 
                color: 'white', 
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
            >
              Why Us
            </div>
            <div 
              onClick={() => setActiveTab('reach')}
              className={`tabs-nav-item ${activeTab === 'reach' ? 'active' : ''}`}
              style={{ 
                padding: '1rem 3rem', 
                background: activeTab === 'reach' ? '#e61e25' : 'rgba(255,255,255,0.1)', 
                color: 'white', 
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
            >
              Reach
            </div>
            <div 
              onClick={() => setActiveTab('solutions')}
              className={`tabs-nav-item ${activeTab === 'solutions' ? 'active' : ''}`}
              style={{ 
                padding: '1rem 3rem', 
                background: activeTab === 'solutions' ? '#e61e25' : 'rgba(255,255,255,0.1)', 
                color: 'white', 
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
            >
              Solutions
            </div>
          </motion.div>

          {/* Content */}
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            className="tabs-content-grid"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '4rem', 
              alignItems: 'center' 
            }}
          >
            {activeTab === 'whyus' && (
              <>
                <div>
                  <h2 style={{ 
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                    fontWeight: 900, 
                    marginBottom: '1.5rem',
                    lineHeight: 1.2,
                    color: 'white'
                  }}>
                    Get Seen
                  </h2>
                  <p style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '1.1rem', 
                    lineHeight: 1.8,
                    marginBottom: '2rem'
                  }}>
                    We’re here to help you get your business in front of the right people. We design, print, and install high-quality ads that people actually notice while they're out and about. No stress, no confusion.
                  </p>
                  <Link 
                    href="/about" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    See our story <ArrowRight size={20} />
                  </Link>
                </div>
                <div className="leaf-image-container">
                  <div className="leaf-image-wrapper">
                    <img 
                      src="/signage-branding.png"
                      alt="Built for Visibility"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'reach' && (
              <>
                <div>
                  <h2 style={{ 
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                    fontWeight: 900, 
                    marginBottom: '1.5rem',
                    lineHeight: 1.2,
                    color: 'white'
                  }}>
                    We’ve got the UAE covered
                  </h2>
                  <p style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '1.1rem', 
                    lineHeight: 1.8,
                    marginBottom: '2rem'
                  }}>
                    Whether you're looking to reach people on the main streets of Dubai or in the business hubs of Abu Dhabi, we’ve got spots in all seven emirates. Your message goes exactly where it needs to be.
                  </p>
                  <Link 
                    href="/contact" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Drop us a message <ArrowRight size={20} />
                  </Link>
                </div>
                <div className="leaf-image-container">
                  <div className="leaf-image-wrapper">
                    <img 
                      src="/about-hero-bg.png"
                      alt="Nationwide Coverage"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'solutions' && (
              <>
                <div>
                  <h2 style={{ 
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                    fontWeight: 900, 
                    marginBottom: '1.5rem',
                    lineHeight: 1.2,
                    color: 'white'
                  }}>
                    Everything you need
                  </h2>
                  <p style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '1.1rem', 
                    lineHeight: 1.8,
                    marginBottom: '2rem'
                  }}>
                    From the first sketch to the final install, we handle it all. Branding, printing, vehicle wraps, and signs—we make sure your business looks professional and gets noticed.
                  </p>
                  <Link 
                    href="/services" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    See what we can do <ArrowRight size={20} />
                  </Link>
                </div>
                <div className="leaf-image-container">
                  <div className="leaf-image-wrapper">
                    <img 
                      src="/services-hero-bg.png"
                      alt="Complete Solutions"
                    />
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Responsive styles */}
          <style jsx>{`
            @media (max-width: 1024px) {
              div[style*="gridTemplateColumns"] {
                grid-template-columns: 1fr !important;
                gap: 2.5rem !important;
              }
            }
          `}</style>
        </motion.div>
      </section>

      {/* CTA Section with Background */}
      <section style={{ 
        position: 'relative', 
        minHeight: '70vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        overflow: 'hidden',
        backgroundImage: "url('/cta-campaign-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#111'
      }}>
        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(12, 12, 12, 0.4) 0%, rgba(12, 12, 12, 0.85) 100%)', zIndex: 1 }}></div>
        
        {/* Content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', padding: 'clamp(3rem, 6vw, 4rem) clamp(1.5rem, 4vw, 2rem)', maxWidth: '900px', width: '100%' }}
        >
          <motion.h2 variants={bounceInDown} style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.2 }}>
            Ready to get your brand <span style={{ fontStyle: 'italic' }}>really noticed?</span>
          </motion.h2>
          <motion.p variants={slideDown} style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2rem', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', maxWidth: '700px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            No pressure, let's just have a quick chat about your ideas. We'll help you figure out the best way to stand out.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link href="/contact#campaign" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 2.5rem', background: '#e61e25', color: 'white', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', transition: 'all 0.3s ease', fontSize: '1rem', boxShadow: '0 4px 20px rgba(230,30,37,0.4)' }}>
              Let's talk <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </>
  );
}
