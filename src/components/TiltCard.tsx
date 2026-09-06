import React, { useState, useEffect } from 'react';
import { Tilt } from 'react-tilt';
import { cn } from '../lib/utils';
import type { TiltOptions } from 'react-tilt';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  options?: TiltOptions;
}

const defaultOptions: TiltOptions = {
  reverse: false,
  max: 5,
  perspective: 1000,
  scale: 1.02,
  speed: 400,
  transition: true,
  axis: null,
  reset: true,
  easing: "cubic-bezier(.03,.98,.52,.99)",
};

const disabledOptions: TiltOptions = {
  reverse: false,
  max: 0,
  perspective: 1000,
  scale: 1,
  speed: 0,
  transition: false,
  axis: null,
  reset: false,
  easing: "linear",
};

const TiltCard: React.FC<TiltCardProps> = ({ children, className, options }) => {
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mql = window.matchMedia('(pointer: fine)');
      setIsFinePointer(mql.matches);
      const handler = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
      if (mql.addEventListener) {
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
      } else {
        mql.addListener(handler);
        return () => mql.removeListener(handler);
      }
    }
    return undefined;
  }, []);

  const activeOptions = isFinePointer
    ? { ...defaultOptions, ...options }
    : disabledOptions;

  return (
    <Tilt
      options={activeOptions}
      className={cn(
        "transform-gpu rounded-2xl shadow-2 ring-1 ring-border/50 overflow-hidden transition-shadow duration-normal ease-standard hover:shadow-3",
        className
      )}
    >
      {children}
    </Tilt>
  );
};

export default TiltCard;
