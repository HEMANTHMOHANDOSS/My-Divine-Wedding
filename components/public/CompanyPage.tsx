
import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Heart, Target, Award, Clock, Star, MapPin } from 'lucide-react';

const TEAM_MEMBERS = [
  { name: "Dr. Lakshmi Narayanan", role: "Chief Astrologer", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" },
  { name: "Sarah Williams", role: "Head of Matchmaking", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop" },
  { name: "Rajesh Kumar", role: "Relationship Manager", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop" },
  { name: "Priya Menon", role: "Trust & Safety Lead", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop" },
];

const TIMELINE = [
  { year: "2018", title: "Inception", desc: "Started as a small community service in Chennai." },
  { year: "2020", title: "Digital Launch", desc: "Launched our first web platform connecting 10k users." },
  { year: "2022", title: "AI Integration", desc: "Introduced AI-driven matchmaking and horoscope compatibility." },
  { year: "2024", title: "Global Reach", desc: "Expanded to serve Tamil communities in USA, UK, and Singapore." },
];

const CompanyPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Hero */}
      <div className="text-center mb-20 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-2xl mb-8 rotate-12"
        >
          <Building2 size={40} />
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 dark:text-white mb-6">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Us</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          We are more than just a matchmaking platform. We are the custodians of tradition, 
          blending ancient values with modern technology to build happy families.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-24">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white/60 dark:bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/20 shadow-xl"
        >
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <Target size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
            To provide a safe, secure, and culturally aligned platform where every Tamilian can find their 
            perfect life partner, irrespective of boundaries.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white/60 dark:bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/20 shadow-xl"
        >
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <Heart size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
            Trust, Transparency, and Tradition. We believe in verifying every profile, respecting privacy, 
            and honoring the astrological traditions that bind our families.
          </p>
        </motion.div>
      </div>

      {/* Team Section */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white">Meet The Team</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Experts dedicated to your happiness.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEAM_MEMBERS.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-white dark:bg-white/5 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-white/10"
            >
              <div className="h-64 overflow-hidden">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0" />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-sm text-purple-600 dark:text-gold-400 font-medium">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white">Our Journey</h2>
        </div>
        
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-200 via-purple-500 to-purple-200 dark:from-white/10 dark:via-purple-500 dark:to-white/10 rounded-full" />
          
          <div className="space-y-12">
            {TIMELINE.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`flex items-center justify-between gap-8 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`w-1/2 ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-3xl font-display font-bold text-purple-600 dark:text-gold-400">{item.year}</h3>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                  <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
                
                <div className="relative z-10 w-8 h-8 bg-white dark:bg-black border-4 border-purple-600 rounded-full shadow-lg shrink-0" />
                
                <div className="w-1/2" /> {/* Spacer */}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default CompanyPage;
