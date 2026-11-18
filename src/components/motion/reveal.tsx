'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import React from 'react';

export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export function Reveal({ 
  children, 
  delay = 0, 
  y = 24,
  as = 'div',
  className 
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const MotionComponent = motion[as];

  if (prefersReducedMotion) {
    return React.createElement(as, { className }, children);
  }

  return (
    <MotionComponent
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={cn(className)}
    >
      {children}
    </MotionComponent>
  );
}