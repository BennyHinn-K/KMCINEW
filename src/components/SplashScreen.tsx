import React from 'react';
import { motion } from 'framer-motion';
import { HeroGeometric } from './ui/shape-landing-hero';

const SplashScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 z-[100] bg-gray-950 flex items-center justify-center"
    >
        <HeroGeometric badge="Kingdom Missions" title1="KMCI" title2="Welcome Home" />
    </motion.div>
  );
};

export default SplashScreen;
