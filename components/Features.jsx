import React from 'react';
import { motion } from 'framer-motion';
import { FEATURES } from '../constants';

const Features = () => {
  return (
    <section id="membership" className="py-32 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-purple-600 dark:text-gold-400 font-bold tracking-widest uppercase text-sm"
          >
            Premium Benefits
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mt-4 mb-6"
          >
            Why Choose Us?
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1 }}
            className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto" 
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.15, duration: 0.8 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card p-10 rounded-3xl relative overflow-hidden group hover:border-purple-500/30 dark:hover:border-gold-500/30 transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-20 h-20 rounded-2xl bg-white dark:bg-white/5 border border-purple-100 dark:border-white/10 flex items-center justify-center mb-8 shadow-xl shadow-purple-500/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10">
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4 relative z-10">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed relative z-10">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;