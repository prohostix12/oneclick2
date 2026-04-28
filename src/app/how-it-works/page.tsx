"use client";

import { motion } from 'framer-motion';
import { Search, Palette, ClipboardCheck, Factory, Truck, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: <Search size={32} />,
    title: 'Consultation & Strategy',
    description: 'We start by understanding your brand vision and business goals to develop a targeted advertising strategy that maximizes impact.'
  },
  {
    icon: <Palette size={32} />,
    title: 'Design & Visualisation',
    description: 'Our creative team brings your ideas to life with high-impact designs, providing detailed 3D visualisations of your signage or campaign.'
  },
  {
    icon: <ClipboardCheck size={32} />,
    title: 'Authority Approvals',
    description: 'We handle all necessary permits and approvals from RTA, Dubai Municipality, and other relevant authorities across the UAE.'
  },
  {
    icon: <Factory size={32} />,
    title: 'Precision Fabrication',
    description: 'Using high-grade materials and state-of-the-art technology, we manufacture your signage with absolute precision and quality control.'
  },
  {
    icon: <Truck size={32} />,
    title: 'Installation & Logistics',
    description: 'Our professional team ensures safe transportation and precise installation of your advertising media at the chosen locations.'
  },
  {
    icon: <CheckCircle2 size={32} />,
    title: 'Maintenance & Support',
    description: 'We provide ongoing maintenance and technical support to ensure your campaign continues to look stunning and perform reliably.'
  }
];

export default function HowItWorks() {
  return (
    <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', paddingTop: '120px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 900, letterSpacing: '-2px', marginBottom: '20px' }}
          >
            How It <span style={{ color: '#e61e25' }}>Works</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontSize: '1.2rem', color: '#888', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}
          >
            A seamless, end-to-end process from initial concept to high-impact physical execution across the UAE.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, backgroundColor: 'rgba(230, 30, 37, 0.05)', borderColor: '#e61e25' }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                padding: '40px',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ color: '#e61e25', marginBottom: '24px' }}>
                {step.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>
                {index + 1}. {step.title}
              </h3>
              <p style={{ color: '#888', lineHeight: 1.7, fontSize: '1.05rem' }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          h1 { font-size: 3rem !important; }
          div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
