'use client';

import { motion, MotionConfig, type MotionProps } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * Reduced motion-aware motion components
 * Automatically honors prefers-reduced-motion preference
 */

export const reducedMotionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
};

/**
 * Hook to detect prefers-reduced-motion preference
 */
export function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Apply reduced motion logic to motion props
 */
export function withReducedMotion(
  props: MotionProps & { children?: ReactNode },
  isReduced?: boolean
): MotionProps {
  const prefersReduced = isReduced ?? useReducedMotion();
  
  if (prefersReduced) {
    // Replace complex animations with simple fade/simple transitions
    const { initial, animate, exit, transition, ...rest } = props;
    
    return {
      ...rest,
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2, ease: 'easeInOut' },
    };
  }
  
  return props;
}

/**
 * ReducedMotion component that wraps motion.div with reduced motion logic
 */
export const ReducedMotion = ({
  children,
  className,
  ...props
}: MotionProps & { children?: ReactNode; className?: string }) => {
  const prefersReduced = useReducedMotion();
  const motionProps = withReducedMotion(props, prefersReduced);
  
  return (
    <motion.div className={className} {...motionProps}>
      {children}
    </motion.div>
  );
};

/**
 * Motion configuration provider that respects reduced motion
 */
export function ReducedMotionConfig({ children }: { children: ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
        mass: 0.5,
      }}
    >
      {children}
    </MotionConfig>
  );
}

/**
 * Custom variants that respect reduced motion
 */
export function getReducedAwareVariants(variant: keyof typeof reducedMotionVariants) {
  const prefersReduced = useReducedMotion();
  
  if (prefersReduced) {
    return reducedMotionVariants.fadeIn;
  }
  
  return reducedMotionVariants[variant];
}

/**
 * Hook for scroll animations that respect reduced motion
 */
export function useScrollAnimation() {
  const prefersReduced = useReducedMotion();
  
  return {
    target: prefersReduced ? 'entry' : 'exit',
    offset: prefersReduced ? ['start start', 'start start'] : ['start end', 'end start'],
    once: prefersReduced,
  };
}

export default ReducedMotion;