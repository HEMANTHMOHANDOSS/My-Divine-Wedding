
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ChevronDown, ChevronUp, Shield, User, CreditCard, 
  CheckCircle, Lock, HelpCircle, AlertTriangle, FileText
} from 'lucide-react';

// --- DATA ---
const FAQ_DATA = [
  {
    id: 'account',
    title: 'Account & Login',
    icon: <User className="w-6 h-6" />,
    color: 'text-blue-500',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    questions: [
      { q: "How do I create an account?", a: "Click on 'Join for Free' or 'Register' on the homepage. You can sign up using your email address or mobile number. We also offer specific registration flows for Parents and Brokers." },
      { q: "I forgot my password. How can I reset it?", a: "Go to the Login screen and click 'Forgot Password'. Enter your registered email address, and we will send you a secure link to reset your password." },
      { q: "Can I have multiple profiles with one number?", a: "No, to ensure authenticity, we allow only one profile per mobile number. Parents managing multiple children should create separate profiles for each child, though they can manage them under a unified Parent Dashboard if linked." },
      { q: "How do I delete my account?", a: "You can request account deletion from the 'Settings' tab in your dashboard. Please note this action is permanent and all your chats, matches, and data will be removed." }
    ]
  },
  {
    id: 'verification',
    title: 'Verification & Trust',
    icon: <CheckCircle className="w-6 h-6" />,
    color: 'text-green-500',
    bg: 'bg-green-100 dark:bg-green-900/20',
    questions: [
      { q: "Why is Government ID verification mandatory?", a: "To maintain a safe and trustworthy platform, we require Government ID (Aadhaar/Passport/PAN) to verify the identity and age of every user. This prevents fake profiles and fraud." },
      { q: "Is my ID proof visible to others?", a: "Absolutely not. Your ID proof is encrypted and stored securely. It is only used by our AI system and Admin team for verification purposes. Other users only see a 'Verified' badge." },
      { q: "What is the Selfie Verification process?", a: "We use AI to compare a real-time selfie with your profile photos and ID proof. This ensures that the person operating the account is genuine." },
      { q: "How long does verification take?", a: "AI verification is usually instant (under 2 minutes). If manual review is required, it may take up to 24 hours." }
    ]
  },
  {
    id: 'payment',
    title: 'Membership & Payments',
    icon: <CreditCard className="w-6 h-6" />,
    color: 'text-amber-500',
    bg: 'bg-amber-100 dark:bg-amber-900/20',
    questions: [
      { q: "What are the benefits of Premium Membership?", a: "Premium members can send unlimited messages, view contact numbers, get profile boosts, access detailed horoscope reports, and receive priority support." },
      { q: "Is payment secure?", a: "Yes, we use 256-bit SSL encryption. We support all major payment methods including UPI, Credit/Debit Cards, and Net Banking via secure gateways like Razorpay and Stripe." },
      { q: "Can I get a refund?", a: "We offer a 7-day money-back guarantee if you have not used any premium contacts or messages. Please contact support@divinematrimony.com for assistance." },
      { q: "Does the subscription auto-renew?", a: "You can choose to enable or disable auto-renewal during checkout or anytime from your Membership settings." }
    ]
  },
  {
    id: 'profile',
    title: 'Profile & Privacy',
    icon: <Lock className="w-6 h-6" />,
    color: 'text-purple-500',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    questions: [
      { q: "Who can see my phone number?", a: "You have full control. You can set it to be visible to 'All Premium Members', 'Only Verified Members', or 'Hide from All'. By default, it is hidden until you accept a connection request." },
      { q: "Can I hide my photos?", a: "Yes, you can use the 'Photo Blur' feature in Privacy Settings. Your photos will be blurred to public users and only visible to those whose requests you accept." },
      { q: "How do I edit my horoscope details?", a: "Go to the 'Horoscope' tab in your dashboard. You can manually edit details or re-upload your Jathagam PDF for AI extraction." }
    ]
  },
  {
    id: 'safety',
    title: 'Safety Guidelines',
    icon: <Shield className="w-6 h-6" />,
    color: 'text-red-500',
    bg: 'bg-red-100 dark:bg-red-900/20',
    questions: [
      { q: "How do I report a suspicious profile?", a: "Click on the 'Report' icon (flag) on the user's profile. Select the reason, and our trust and safety team will investigate immediately." },
      { q: "What should I do if someone asks for money?", a: "Never send money to anyone you meet online. Report the user immediately. My Divine Matrimony will never ask for money transfers outside the subscription page." },
      { q: "How do I block a user?", a: "You can block a user from their profile page or chat window. Once blocked, they cannot contact you or view your profile." }
    ]
  }
];

const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (category: string, index: number) => {
    const key = `${category}-${index}`;
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter Logic
  const filteredData = FAQ_DATA.map(category => {
    const filteredQuestions = category.questions.filter(
      item => 
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...category, questions: filteredQuestions };
  }).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-sm font-bold uppercase tracking-wider"
        >
          <HelpCircle size={16} /> Help Center
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white"
        >
          Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Questions</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
        >
          Find answers to common questions about your account, safety, and our premium services.
        </motion.p>

        {/* Floating Search Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative max-w-xl mx-auto z-20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-20" />
          <div className="relative bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full px-6 py-4 flex items-center shadow-2xl">
            <Search className="text-gray-400 mr-4" size={24} />
            <input 
              type="text" 
              placeholder="Search for keywords (e.g., 'refund', 'privacy')..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-lg text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
        </motion.div>
      </div>

      {/* FAQ Content */}
      <div className="space-y-12">
        <AnimatePresence>
          {filteredData.length > 0 ? (
            filteredData.map((category, catIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: catIndex * 0.1 }}
                className="bg-white/60 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-xl"
              >
                <div className="flex items-center gap-4 mb-8 border-b border-gray-100 dark:border-white/5 pb-4">
                  <div className={`p-3 rounded-2xl ${category.bg} ${category.color}`}>
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{category.title}</h3>
                </div>

                <div className="space-y-4">
                  {category.questions.map((item, qIndex) => {
                    const isOpen = expandedItems[`${category.id}-${qIndex}`];
                    return (
                      <motion.div 
                        key={qIndex}
                        layout
                        className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${isOpen ? 'bg-white dark:bg-white/5 border-purple-200 dark:border-purple-500/30 shadow-md' : 'bg-transparent border-transparent hover:bg-white/40 dark:hover:bg-white/5'}`}
                      >
                        <button 
                          onClick={() => toggleItem(category.id, qIndex)}
                          className="w-full flex justify-between items-center text-left p-4 md:p-6 cursor-pointer"
                        >
                          <span className={`font-bold text-base md:text-lg transition-colors ${isOpen ? 'text-purple-700 dark:text-purple-300' : 'text-gray-800 dark:text-gray-200'}`}>
                            {item.q}
                          </span>
                          <div className={`p-1 rounded-full transition-transform duration-300 ${isOpen ? 'rotate-180 bg-purple-100 dark:bg-purple-900/30 text-purple-600' : 'text-gray-400'}`}>
                            <ChevronDown size={20} />
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base border-t border-gray-100 dark:border-white/5 pt-4">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">No results found</h3>
              <p className="text-gray-500">Try adjusting your search query.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="mt-20 text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold">Still have questions?</h2>
          <p className="text-purple-100 text-lg max-w-xl mx-auto">
            Our support team is available 24/7 to assist you with any queries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button className="px-8 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
              Contact Support
            </button>
            <button className="px-8 py-3 bg-purple-700 text-white rounded-xl font-bold hover:bg-purple-800 transition-colors shadow-lg border border-purple-500">
              WhatsApp Us
            </button>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default FAQPage;
