import React from 'react';
import { motion } from 'framer-motion';
import { brandLogo } from '../branding';

const SplashScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] bg-gray-950 flex items-center justify-center"
    >
      <div className="flex flex-col items-center space-y-4">
        <img
          src={brandLogo}
          alt="KMCI logo"
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full object-contain shadow-2xl"
        />
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-amber-400">Kingdom Missions Centre Int&apos;l</p>
          <p className="text-lg sm:text-xl text-gray-300 mt-2">The Centre of Transformation for Missions</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
