import React from 'react';
import { Tilt } from 'react-tilt';
import { cn } from '../lib/utils';
import type { TiltOptions } from 'react-tilt';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  options?: TiltOptions;
}

const defaultOptions: TiltOptions = {
  reverse:        false,
  max:            5,
  perspective:    1000,
  scale:          1.02,
  speed:          400,
  transition:     true,
  axis:           null,
  reset:          true,
  easing:         "cubic-bezier(.03,.98,.52,.99)",
};

const TiltCard: React.FC<TiltCardProps> = ({ children, className, options }) => {
  return (
    <Tilt options={{ ...defaultOptions, ...options }} className={cn("transform-gpu", className)}>
      {children}
    </Tilt>
  );
};

export default TiltCard;
