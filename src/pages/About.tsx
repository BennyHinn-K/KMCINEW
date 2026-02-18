import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Shield, Users, HandHeart, Target, ThumbsUp, Cross } from 'lucide-react';
import RadialOrbitalTimeline, { TimelineItem } from '../components/ui/radial-orbital-timeline';
import missionLogo from '../../docs/kmci about.jpeg';

const timelineData: TimelineItem[] = [
  {
    id: 1,
    title: 'Servant hood',
    date: 'Core Value',
    content: 'We follow Christ by serving God and people with humility.',
    category: 'Values',
    icon: HandHeart,
    relatedIds: [2, 3],
    status: 'completed',
    energy: 90,
  },
  {
    id: 2,
    title: 'Accountability',
    date: 'Core Value',
    content: 'We walk in openness, stewardship and responsibility in all we do.',
    category: 'Values',
    icon: Shield,
    relatedIds: [1, 4],
    status: 'completed',
    energy: 85,
  },
  {
    id: 3,
    title: 'Team-work & Fellowship',
    date: 'Core Value',
    content: 'We labour together in unity as one body in Christ.',
    category: 'Values',
    icon: Users,
    relatedIds: [1, 5],
    status: 'completed',
    energy: 88,
  },
  {
    id: 4,
    title: 'Integrity',
    date: 'Core Value',
    content: 'We uphold honesty, truth and Biblical ethics in life and ministry.',
    category: 'Values',
    icon: Shield,
    relatedIds: [2, 6],
    status: 'completed',
    energy: 92,
  },
  {
    id: 5,
    title: 'Unity, Love & Harmony',
    date: 'Core Value',
    content: 'We pursue love, peace and oneness in our families and communities.',
    category: 'Values',
    icon: Heart,
    relatedIds: [3, 7],
    status: 'completed',
    energy: 87,
  },
  {
    id: 6,
    title: 'Mentorship',
    date: 'Core Value',
    content: 'We intentionally raise and equip believers for Kingdom service.',
    category: 'Values',
    icon: Target,
    relatedIds: [4, 8],
    status: 'completed',
    energy: 86,
  },
  {
    id: 7,
    title: 'Excellence',
    date: 'Core Value',
    content: 'We offer our very best to God in ministry and stewardship.',
    category: 'Values',
    icon: ThumbsUp,
    relatedIds: [5, 8],
    status: 'completed',
    energy: 89,
  },
  {
    id: 8,
    title: 'Christ-Like',
    date: 'Core Value',
    content: 'We model the character, love and mission of Jesus Christ.',
    category: 'Values',
    icon: Cross,
    relatedIds: [1, 7],
    status: 'completed',
    energy: 95,
  },
];

const About = () => {
  return (
    <div className="bg-gray-50">
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507692049790-de58293a469d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Purpose</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            To be a centre of transformation, missions, spiritual nourishment and holistic growth for families and communities.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative max-w-xl mx-auto">
                <img 
                  src={missionLogo}
                  alt="KMCI Mission Strategy Logo"
                  className="rounded-2xl shadow-2xl z-10 relative w-full h-auto object-contain bg-white"
                />
                <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-amber-500 rounded-2xl -z-0 hidden md:block"></div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-2">Vision, Mission & Values</h2>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Kingdom Missions Centre Int&apos;l</h3>

              <div className="space-y-6 text-gray-700">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Vision</h4>
                  <p className="leading-relaxed">
                    To be a Missionary Church Base, teaching God&apos;s Word to disciple communities,
                    transformed for Christ&apos;s service and ready for His glorious return.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Mission</h4>
                  <p className="leading-relaxed">
                    To be a centre of transformation, missions, spiritual nourishment and holistic growth
                    for families and communities, anchored on biblical principles and values.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Our Core Values (SATIUMEC)</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <li>Servant hood</li>
                    <li>Accountability</li>
                    <li>Team-work and Fellowship</li>
                    <li>Integrity</li>
                    <li>Unity, Love and harmony</li>
                    <li>Mentorship</li>
                    <li>Excellence</li>
                    <li>Christ-Like</li>
                  </ul>
                </div>
              </div>

              <Link 
                to="/contact" 
                className="inline-block bg-amber-500 text-white px-8 py-3 rounded-full font-bold hover:bg-amber-600 transition-colors shadow-lg mt-6"
              >
                Connect With Us
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-2">Our DNA</h2>
            <h3 className="text-3xl font-bold text-white">Core Values & Journey</h3>
          </div>

          <div className="relative h-[600px] w-full">
            <RadialOrbitalTimeline timelineData={timelineData} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
