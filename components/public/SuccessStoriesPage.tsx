
import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Heart, Calendar, MapPin } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';

const STORIES = [
  {
    id: 1,
    couple: "Karthik & Lakshmi",
    location: "Chennai, India",
    date: "Married Oct 2023",
    image: "https://images.unsplash.com/photo-1621621667797-e06afc217fb0?q=80&w=2070&auto=format&fit=crop",
    quote: "We met through My Divine Matrimony. The horoscope matching feature was spot on! Our families connected instantly.",
    fullStory: "We were both skeptical about online matrimony, but the detailed profiles here helped us understand each other before meeting."
  },
  {
    id: 2,
    couple: "Vikram & Ananya",
    location: "Singapore & Bangalore",
    date: "Married Dec 2023",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop",
    quote: "Distance was never an issue. Thanks to the platform for bridging Chennai to Singapore. The video calling feature helped a lot.",
    fullStory: "I was in Singapore and she was in Bangalore. The verified profiles gave us the confidence to proceed."
  },
  {
    id: 3,
    couple: "Arjun & Divya",
    location: "Mumbai, India",
    date: "Married Jan 2024",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1974&auto=format&fit=crop",
    quote: "Finding a partner who understands my career aspirations was important. I found him here.",
    fullStory: "Both of us being in IT, we wanted someone who understood the work-life balance. Perfect match!"
  },
  {
    id: 4,
    couple: "Suresh & Meena",
    location: "Coimbatore, India",
    date: "Married Feb 2024",
    image: "https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?q=80&w=2070&auto=format&fit=crop",
    quote: "The advanced search filters helped me find someone from my specific community and profession.",
    fullStory: "My parents were very particular about Gothram and community. The filters made it so easy."
  },
  {
    id: 5,
    couple: "Rahul & Priya",
    location: "USA & Chennai",
    date: "Married Mar 2024",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop",
    quote: "A true divine connection. We are grateful to the support team for guiding us.",
    fullStory: "The relationship manager feature in the Diamond plan was a game changer for us."
  }
];

interface SuccessStoriesPageProps {
  onLogin: () => void;
}

const SuccessStoriesPage: React.FC<SuccessStoriesPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Hero */}
      <div className="text-center mb-16 space-y-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Heart size={32} className="fill-pink-600" />
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white">
          Happily <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Ever After</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Read the inspiring stories of couples who found their soulmates on Divine Matrimony.
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {STORIES.map((story, idx) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-white dark:bg-white/5 rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 dark:border-white/10 hover:shadow-2xl transition-all duration-500"
          >
            {/* Image Container */}
            <div className="h-64 overflow-hidden relative">
              <img 
                src={story.image} 
                alt={story.couple} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-display font-bold">{story.couple}</h3>
                <div className="flex items-center gap-2 text-xs font-medium opacity-90 mt-1">
                  <MapPin size={12} /> {story.location}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <Quote className="text-gold-500 mb-4 opacity-50" size={32} />
              <p className="text-gray-600 dark:text-gray-300 italic mb-6 leading-relaxed">
                "{story.quote}"
              </p>
              
              <div className="pt-6 border-t border-gray-100 dark:border-white/10">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">
                  {story.fullStory}
                </p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-gold-400 bg-purple-50 dark:bg-white/5 px-3 py-1 rounded-full">
                    <Calendar size={12} /> {story.date}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Your story could be next</h2>
        <PremiumButton onClick={onLogin} variant="gradient" className="!px-10 !py-4 text-lg">
          Create Your Profile Today
        </PremiumButton>
      </div>

    </div>
  );
};

export default SuccessStoriesPage;
