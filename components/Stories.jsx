import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SUCCESS_STORIES } from '../constants';
import { Quote, ArrowRight } from 'lucide-react';
import PremiumButton from './ui/PremiumButton';

const Stories = ({ onAction }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section ref={containerRef} id="stories" className="py-32 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-l from-purple-50/50 to-transparent dark:from-purple-900/10 -z-10" />

      <div className="container mx-auto px-6 mb-16">
        <div className="flex flex-col items-center text-center">
          <span className="text-purple-600 dark:text-gold-400 font-bold uppercase tracking-widest text-sm mb-4">Happily Ever After</span>
          <h2 className="text-5xl md:text-7xl font-display font-bold text-gray-900 dark:text-white mb-6">
            Real Stories
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
            Thousands of couples have found their soulmates here. Yours could be next.
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Area - using flex for simplicity in this constrained environment, 
          but adding parallax to the images inside cards */}
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {SUCCESS_STORIES.map((story, idx) => (
            <StoryCard key={story.id} story={story} index={idx} onClick={onAction} />
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-16">
         <PremiumButton onClick={onAction} variant="outline" icon={<ArrowRight size={18} />}>
            Read All Stories
         </PremiumButton>
      </div>
    </section>
  );
};

const StoryCard = ({ story, index, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.8, type: "spring", bounce: 0.3 }}
      className="group relative h-[600px] rounded-[2.5rem] overflow-hidden cursor-pointer"
    >
      {/* Image with subtle zoom effect */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={story.image} 
          alt={story.couple} 
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-10 transform transition-transform duration-500">
        <Quote className="text-gold-400 w-10 h-10 mb-6 opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out" />
        
        <h3 className="text-3xl font-serif font-bold text-white mb-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          {story.couple}
        </h3>
        
        <div className="overflow-hidden mb-6">
           <p className="text-gray-200 text-lg leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
            \"{story.story}\"
          </p>
        </div>

        <div className="flex items-center gap-4 border-t border-white/20 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
          <span className="text-gold-400 text-sm font-bold uppercase tracking-widest">{story.date}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default Stories;