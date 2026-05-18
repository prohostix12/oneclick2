"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AnimatedServicesCircle.css';

interface Service {
  name: string;
  img: string;
  link: string;
}

interface AnimatedServicesCircleProps {
  services: Service[];
}

export default function AnimatedServicesCircle({ services }: AnimatedServicesCircleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!services || services.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 3000); // cycle every 3 seconds

    return () => clearInterval(interval);
  }, [services]);

  const orbits = [
    { rotateX: 65, rotateY: 20, rotateZ: 10 },
    { rotateX: -55, rotateY: -30, rotateZ: -15 },
    { rotateX: 75, rotateY: -10, rotateZ: 45 },
    { rotateX: -60, rotateY: 45, rotateZ: -30 },
    { rotateX: 45, rotateY: -50, rotateZ: 25 },
    { rotateX: -45, rotateY: 60, rotateZ: -10 },
  ];
  
  if (!services || services.length === 0) return null;

  const currentOrbit = orbits[currentIndex % orbits.length];

  return (
    <div className="animated-circle-container">
      {/* Outer spinning rings */}
      <div className="spinning-ring-1"></div>
      <div className="spinning-ring-2"></div>
      <div className="spinning-ring-3"></div>
      
      {/* Inner glowing 3D orb */}
      <motion.div 
        className="glowing-orb"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
      >
        <div className="glass-highlight"></div>
        {/* 3D Twisting Ribbons / Threads */}
        <div className="ribbon ribbon-1"></div>
        <div className="ribbon ribbon-2"></div>
        <div className="ribbon ribbon-3"></div>
        <div className="ribbon ribbon-4"></div>
      </motion.div>

      {/* Orbiting Text - Moved outside glowing orb to prevent overflow clipping */}
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          className="service-text-wrapper"
          style={{ position: 'absolute', width: '260px', height: '260px', zIndex: 20 }}
          initial={{ opacity: 0, rotateX: currentOrbit.rotateX, rotateY: currentOrbit.rotateY, rotateZ: currentOrbit.rotateZ }}
          animate={{ opacity: 1, rotateX: currentOrbit.rotateX, rotateY: currentOrbit.rotateY, rotateZ: currentOrbit.rotateZ }}
          exit={{ opacity: 0, rotateX: currentOrbit.rotateX, rotateY: currentOrbit.rotateY, rotateZ: currentOrbit.rotateZ }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <svg width="260" height="260" viewBox="0 0 260 260" style={{ overflow: 'visible' }}>
            <defs>
              <path
                id={`textCurve-${currentIndex}`}
                d="M 30, 130 A 100,100 0 1,1 230,130 A 100,100 0 1,1 30,130"
                fill="transparent"
              />
            </defs>
            <text className="service-name">
              <motion.textPath 
                href={`#textCurve-${currentIndex}`} 
                textAnchor="middle"
                initial={{ startOffset: "10%" }}
                animate={{ startOffset: "90%" }}
                transition={{ duration: 6, ease: "linear" }}
              >
                {services[currentIndex].name}
              </motion.textPath>
            </text>
          </svg>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
