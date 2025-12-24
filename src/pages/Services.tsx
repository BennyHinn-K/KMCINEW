import React from 'react';
import { motion } from 'framer-motion';
import { Code, LineChart, Cloud, Database, Lock, Smartphone } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <LineChart className="w-10 h-10 text-white" />,
      title: "Strategic Consulting",
      description: "Data-driven strategies to optimize your business operations and maximize growth potential.",
      color: "bg-blue-500"
    },
    {
      icon: <Code className="w-10 h-10 text-white" />,
      title: "Custom Software Dev",
      description: "Tailor-made software solutions designed to meet your specific business requirements.",
      color: "bg-indigo-500"
    },
    {
      icon: <Cloud className="w-10 h-10 text-white" />,
      title: "Cloud Migration",
      description: "Seamless transition to cloud infrastructure ensuring scalability and reliability.",
      color: "bg-purple-500"
    },
    {
      icon: <Database className="w-10 h-10 text-white" />,
      title: "Data Analytics",
      description: "Turn your raw data into actionable insights with our advanced analytics solutions.",
      color: "bg-pink-500"
    },
    {
      icon: <Lock className="w-10 h-10 text-white" />,
      title: "Cybersecurity",
      description: "Protect your digital assets with our comprehensive security assessments and solutions.",
      color: "bg-red-500"
    },
    {
      icon: <Smartphone className="w-10 h-10 text-white" />,
      title: "Mobile Solutions",
      description: "Engaging mobile applications for iOS and Android that connect you with your customers.",
      color: "bg-teal-500"
    }
  ];

  return (
    <div className="pt-24 pb-16">
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Comprehensive solutions tailored to drive your business forward in the digital age.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
              >
                <div className={`${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {service.description}
                </p>
                <a href="#" className="text-blue-600 font-semibold hover:text-blue-800 flex items-center">
                  Learn more <span className="ml-2">→</span>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
