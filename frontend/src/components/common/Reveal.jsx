import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Fade-and-rise reveal when the element scrolls into view.
 * Usage: <Reveal delay={0.1}>...</Reveal>  or  <Reveal as="section">
 */
export default function Reveal({ children, delay = 0, y = 18, as = 'div', className, once = true, ...rest }) {
  const reduce = useReducedMotion();
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};
