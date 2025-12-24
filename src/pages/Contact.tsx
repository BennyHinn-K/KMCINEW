import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import TiltCard from '../components/TiltCard';
import ContactMap from '../components/ContactMap';

const Contact = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Connect With Us</h1>
          <p className="text-gray-300">We would love to pray with you and hear from you.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <TiltCard className="h-full">
            <div className="bg-slate-900 text-gray-100 p-6 rounded-xl shadow-2xl h-full flex flex-col items-center text-center">
              <div className="bg-amber-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Call Us</h3>
              <p className="text-gray-300">0720757185</p>
            </div>
          </TiltCard>

          <TiltCard className="h-full">
            <div className="bg-slate-900 text-gray-100 p-6 rounded-xl shadow-2xl h-full flex flex-col items-center text-center">
              <div className="bg-amber-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Email Us</h3>
              <p className="text-gray-300">info@kmci.org</p>
            </div>
          </TiltCard>

          <TiltCard className="h-full">
            <div className="bg-slate-900 text-gray-100 p-6 rounded-xl shadow-2xl h-full flex flex-col items-center text-center">
              <div className="bg-amber-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Visit Us</h3>
              <p className="text-gray-300">Kinoo, Gaitumbi</p>
            </div>
          </TiltCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map Section */}
            <ContactMap />

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 md:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="How can we pray for you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Send Message</span>
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
