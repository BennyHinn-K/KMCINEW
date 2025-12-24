import React from 'react';
import { Link } from 'react-router-dom';
import HomeHero from '../components/home/HomeHero';
import ImpactArea from '../components/home/ImpactArea';

const Home = () => {
  return (
    <div className="overflow-hidden bg-gray-50">
      <HomeHero />
      <ImpactArea />

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Partner with the Vision</h2>
          <p className="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed">
            Your generosity helps us take the Gospel to the nations, support orphans, and build the Kingdom of God.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/donate"
              className="inline-block bg-amber-500 text-white font-bold py-4 px-10 rounded-full hover:bg-amber-600 transition-colors shadow-lg"
            >
              Give
            </Link>
            <Link
              to="/contact"
              className="inline-block bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white hover:text-gray-900 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
