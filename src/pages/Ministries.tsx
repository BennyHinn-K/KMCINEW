import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';

type Ministry = {
  id: number;
  title: string;
  tagline: string;
  description: string;
  details: string;
  image: string;
  accent: string;
  meetTime: string;
};

const ministries: Ministry[] = [
  {
    id: 1,
    title: "Men's Ministry",
    tagline: "Raising spiritual leaders",
    description:
      "Empowering men to lead their homes and communities with integrity, faith and courage through fellowship and mentorship.",
    details:
      "Monthly breakfast fellowships, annual retreats, and one-on-one mentorship for young men stepping into leadership.",
    image:
      'https://images.pexels.com/photos/33679989/pexels-photo-33679989.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: 'from-sky-600/80 to-sky-900/90',
    meetTime: 'Monthly · Saturday mornings',
  },
  {
    id: 2,
    title: "Women's Ministry",
    tagline: "A sisterhood of faith",
    description:
      "Supporting women to grow in grace, wisdom and purpose — a safe place to belong, heal and flourish.",
    details:
      "Weekly prayer meetings, 'Daughters of the King' conferences, and community support groups.",
    image:
      'https://images.pexels.com/photos/34505719/pexels-photo-34505719.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: 'from-rose-600/80 to-rose-900/90',
    meetTime: 'Weekly · Tuesday evenings',
  },
  {
    id: 3,
    title: 'Children & Youth',
    tagline: 'The next generation',
    description:
      "Raising Kingdom giants through engaging biblical teaching, worship and activities designed for every age.",
    details:
      "Sunday school for ages 3–12, Teen Church (13–19), and an annual Vacation Bible School every August.",
    image:
      'https://images.pexels.com/photos/21782665/pexels-photo-21782665.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: 'from-amber-500/80 to-orange-800/90',
    meetTime: 'Sundays · 9:00 AM',
  },
  {
    id: 4,
    title: 'Missions & Outreach',
    tagline: 'Hope to the nations',
    description:
      "Taking the Gospel to the streets and the nations — bringing aid to the needy and hope to the hopeless.",
    details:
      "Quarterly mission trips, hospital visitations, street evangelism drives and disaster-response support.",
    image:
      'https://images.pexels.com/photos/6646880/pexels-photo-6646880.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: 'from-emerald-600/80 to-emerald-900/90',
    meetTime: 'Quarterly missions',
  },
  {
    id: 5,
    title: 'School of Ministry',
    tagline: 'Equipped for the call',
    description:
      "In-depth theological training and practical ministry preparation for aspiring leaders and pastors.",
    details:
      "Six-month certificate courses in Theology, Leadership and Church Planting, taught by seasoned ministers.",
    image:
      'https://images.pexels.com/photos/21782665/pexels-photo-21782665.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: 'from-teal-600/80 to-teal-900/90',
    meetTime: 'Cohorts · 6-month program',
  },
  {
    id: 6,
    title: 'Worship Arts',
    tagline: 'Heaven on earth',
    description:
      "Cultivating an atmosphere of heaven on earth through music, dance and the creative arts.",
    details:
      "Choir practice on Saturdays, a dedicated dance ministry, and technical production team training.",
    image:
      'https://images.pexels.com/photos/8815031/pexels-photo-8815031.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    accent: 'from-indigo-600/80 to-indigo-900/90',
    meetTime: 'Saturdays · 2:00 PM',
  },
];

const Ministries = () => {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="relative pt-20">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/14587105/pexels-photo-14587105.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="Worship gathering"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/75 to-slate-950/95" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 text-sm font-bold tracking-wider uppercase mb-6">
              Our Ministries
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              A place to serve, <span className="text-amber-400">grow and belong</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
              There is a place for everyone at KMCI. Discover where your gifts meet God's purpose.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ministry cards */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministries.map((m, idx) => (
              <motion.article
                key={m.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.08 }}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-white flex flex-col"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={m.image}
                    alt={m.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${m.accent} mix-blend-multiply`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                      {m.tagline}
                    </span>
                    <h3 className="text-2xl font-bold text-white leading-tight">{m.title}</h3>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex-grow flex flex-col">
                  <p className="text-gray-600 leading-relaxed mb-5">{m.description}</p>

                  <div className="mt-auto">
                    <button
                      onClick={() => setActiveId(activeId === m.id ? null : m.id)}
                      className="text-gray-900 font-bold hover:text-amber-600 flex items-center uppercase text-sm tracking-wide focus:outline-none transition-colors"
                    >
                      Get Involved
                      <ChevronDown
                        className={`ml-2 w-4 h-4 transition-transform duration-300 ${activeId === m.id ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {activeId === m.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700">
                            <p className="font-semibold mb-1 text-amber-600">Impact & Engagement</p>
                            <p className="mb-3">{m.details}</p>
                            <p className="text-xs text-gray-500 mb-3">{m.meetTime}</p>
                            <Link
                              to="/contact"
                              className="w-full inline-flex items-center justify-center bg-slate-900 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                            >
                              Sign Up Now <ArrowRight className="ml-2 w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/8815031/pexels-photo-8815031.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Not sure where to start?</h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            We'd love to help you find your place. Reach out and we'll walk with you into your next step.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center bg-amber-500 text-white font-bold py-4 px-10 rounded-full hover:bg-amber-600 transition-colors shadow-lg"
          >
            Talk to a Pastor <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Ministries;
