import React from 'react';
import { Heart, Smartphone, Check } from 'lucide-react';
import TiltCard from '../components/TiltCard';

const Donate = () => {
  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Give Online</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." — 2 Corinthians 9:7
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Donation Options */}
          <div className="flex justify-center">
            <TiltCard className="w-full max-w-md">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-2.5 rounded-full mr-3">
                    <Smartphone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                    <h3 className="text-xl font-bold text-gray-900">M-Pesa</h3>
                    <p className="text-sm text-gray-500">Fast and secure mobile money transfer</p>
                    </div>
                </div>
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-4 space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-600 font-medium text-sm">Paybill Number:</span>
                    <span className="text-lg font-bold text-gray-900">400200</span>
                    </div>
                    <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-sm">Account Number:</span>
                    <span className="text-lg font-bold text-gray-900">169111</span>
                    </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                    Go to M-Pesa &gt; Lipa na M-Pesa &gt; Paybill &gt; Enter Business No. (400200) &gt; Enter Account No. (169111) &gt; Enter Amount &gt; Enter PIN.
                </p>
                </div>
            </TiltCard>
          </div>

          {/* Impact Section */}
          <div className="bg-amber-500 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
            
            <Heart className="w-16 h-16 mb-6 text-white fill-white/20" />
            <h2 className="text-3xl font-bold mb-6">Your Giving Makes a Difference</h2>
            <p className="text-lg mb-8 leading-relaxed opacity-90">
              Every contribution helps us to continue our mission of spreading the Gospel and serving our community. Here is how your giving helps:
            </p>
            
            <ul className="space-y-4">
              {[
                "Supporting local and international missions",
                "Feeding programs for the needy in Kinoo",
                "Youth and Children's ministry resources",
                "Church maintenance and development",
                "Community outreach events"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="bg-white/20 p-1 rounded-full mr-3 mt-1">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
