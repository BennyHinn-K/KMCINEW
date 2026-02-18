import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Youtube } from 'lucide-react';
import { brandLogo } from '../branding';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-white/10 text-white p-2 rounded-lg border border-white/20">
                <img
                  src={brandLogo}
                  alt="KMCI logo"
                  className="w-10 h-10 rounded-md object-contain"
                />
              </div>
              <span className="font-bold text-xl tracking-tight">Kingdom Missions</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              Advancing the Kingdom of God globally through evangelism, discipleship, and humanitarian outreach.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b-2 border-amber-500 inline-block pb-1">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-amber-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-amber-500 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/ministries" className="text-gray-400 hover:text-amber-500 transition-colors">Ministries</Link>
              </li>
              <li>
                <Link to="/announcements" className="text-gray-400 hover:text-amber-500 transition-colors">News & Events</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-amber-500 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Ministries */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b-2 border-amber-500 inline-block pb-1">Ministries</h3>
            <ul className="space-y-3">
              <li className="text-gray-400">Global Missions</li>
              <li className="text-gray-400">Youth & Children</li>
              <li className="text-gray-400">Women's Ministry</li>
              <li className="text-gray-400">School of Ministry</li>
              <li className="text-gray-400">Community Outreach</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white border-b-2 border-amber-500 inline-block pb-1">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>KMCI Center,<br />Kinoo, Gaitumbi</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span>0720757185</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span>info@kmci.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Kingdom Missions Center International. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
