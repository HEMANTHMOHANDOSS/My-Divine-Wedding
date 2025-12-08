import React from 'react';
import { motion } from 'framer-motion';
import { COMMUNITIES } from '../constants';
import { ArrowRight } from 'lucide-react';
import PremiumButton from './ui/PremiumButton';

interface CategoriesProps {
  onAction: () => void;
}

const Categories: React.FC<CategoriesProps> = ({ onAction }) => {
  return (
    <section id="communities" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-2">
              Browse by Community
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Find your perfect match from your community.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <PremiumButton onClick={onAction} variant="secondary" icon={<ArrowRight size={20} />}>
              View All Communities
            </PremiumButton>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {COMMUNITIES.map((community, idx) => (
            <motion.div
              onClick={onAction}
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="group relative h-40 rounded-3xl overflow-hidden cursor-pointer"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-white dark:from-white/10 dark:to-white/5 group-hover:from-purple-600 group-hover:to-pink-600 transition-colors duration-500" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                 <h3 className="text-2xl font-serif font-bold text-gray-800 dark:text-white group-hover:text-white transition-colors duration-300">
                   {community.name}
                 </h3>
                 <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2 group-hover:text-white/80 transition-colors duration-300">
                   {community.count} Profiles
                 </span>
              </div>
              
              {/* Glass Shine Effect on Hover */}
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-shine skew-x-12" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;