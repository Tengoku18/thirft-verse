'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'surface' | 'accent';
}

export default function Section({
  children,
  className = '',
  id,
  background = 'default',
}: SectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // If the URL hash matches this section's id, make it visible immediately and scroll to it
  useEffect(() => {
    if (id && window.location.hash === `#${id}`) {
      setIsVisible(true);
      // Allow a tick for the DOM to render, then scroll
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const backgrounds = {
    default: 'bg-background',
    surface: 'bg-surface',
    accent: 'bg-accent-1/5',
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`${backgrounds[background]} ${className} transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      {children}
    </section>
  );
}
