import { Heart, Shield, Users, Smartphone, Star, Search, Sparkles, Lock, Zap } from 'lucide-react';
import React from 'react';

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Communities', href: '#communities' },
  { label: 'Membership', href: '#membership' },
  { label: 'Success Stories', href: '#stories' },
  { label: 'Contact', href: '#contact' },
];

export const FEATURES = [
  {
    icon: <Shield className="w-8 h-8 text-gold-500" />,
    title: '100% Verified',
    description: 'Every profile is manually screened with Government ID verification.',
  },
  {
    icon: <Users className="w-8 h-8 text-purple-500" />,
    title: 'Community First',
    description: 'Specialized matchmaking for Iyer, Iyengar, Mudaliar, and 50+ communities.',
  },
  {
    icon: <Sparkles className="w-8 h-8 text-pink-500" />,
    title: 'AI Matchmaking',
    description: 'Next-gen algorithms that understand your values, horoscope, and lifestyle.',
  },
  {
    icon: <Lock className="w-8 h-8 text-blue-500" />,
    title: 'Privacy Controlled',
    description: 'You control who sees your photo and contact details. Safe & Secure.',
  },
];

export const COMMUNITIES = [
  { name: 'Iyer', count: '12k+' },
  { name: 'Iyengar', count: '10k+' },
  { name: 'Mudaliar', count: '25k+' },
  { name: 'Vanniyar', count: '30k+' },
  { name: 'Nadar', count: '18k+' },
  { name: 'Chettiar', count: '8k+' },
  { name: 'Pillai', count: '15k+' },
  { name: 'Gounder', count: '22k+' },
];

export const SUCCESS_STORIES = [
  {
    id: 1,
    couple: "Karthik & Lakshmi",
    image: "https://images.unsplash.com/photo-1621621667797-e06afc217fb0?q=80&w=2070&auto=format&fit=crop",
    story: "We met through My Divine Matrimony. The horoscope matching feature was spot on!",
    date: "Married Oct 2023"
  },
  {
    id: 2,
    couple: "Vikram & Ananya",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop",
    story: "Distance was never an issue. Thanks to the platform for bridging Chennai to Singapore.",
    date: "Married Dec 2023"
  },
  {
    id: 3,
    couple: "Arjun & Divya",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1974&auto=format&fit=crop",
    story: "Finding a partner who understands my career aspirations was important. I found him here.",
    date: "Married Jan 2024"
  }
];

export const RAASI_LIST = [
  { id: 'mesha', sanskrit: 'Mesha', english: 'Aries', tamil: 'Mesham', script: 'மேஷம்' },
  { id: 'vrishabha', sanskrit: 'Vrishabha', english: 'Taurus', tamil: 'Rishabam', script: 'ரிஷபம்' },
  { id: 'mithuna', sanskrit: 'Mithuna', english: 'Gemini', tamil: 'Midhunam', script: 'மிதுனம்' },
  { id: 'karka', sanskrit: 'Karka', english: 'Cancer', tamil: 'Kadagam', script: 'கடகம்' },
  { id: 'simha', sanskrit: 'Simha', english: 'Leo', tamil: 'Simmam', script: 'சிம்மம்' },
  { id: 'kanya', sanskrit: 'Kanya', english: 'Virgo', tamil: 'Kanni', script: 'கன்னி' },
  { id: 'tula', sanskrit: 'Tula', english: 'Libra', tamil: 'Thulam', script: 'துலாம்' },
  { id: 'vrishchika', sanskrit: 'Vrishchika', english: 'Scorpio', tamil: 'Viruchigam', script: 'விருச்சிகம்' },
  { id: 'dhanu', sanskrit: 'Dhanu', english: 'Sagittarius', tamil: 'Dhanusu', script: 'தனுசு' },
  { id: 'makara', sanskrit: 'Makara', english: 'Capricorn', tamil: 'Magaram', script: 'மகரம்' },
  { id: 'kumbha', sanskrit: 'Kumbha', english: 'Aquarius', tamil: 'Kumbam', script: 'கும்பம்' },
  { id: 'meena', sanskrit: 'Meena', english: 'Pisces', tamil: 'Meenam', script: 'மீனம்' },
];

export const NAKSHATRA_LIST = [
  { id: 'ashvini', sanskrit: 'Ashvini', english: 'Aswini', script: 'அசுவினி' },
  { id: 'bharani', sanskrit: 'Bharani', english: 'Bharani', script: 'பரணி' },
  { id: 'krithika', sanskrit: 'Krithika', english: 'Karthigai', script: 'கார்த்திகை' },
  { id: 'rohini', sanskrit: 'Rohini', english: 'Rohini', script: 'ரோகிணி' },
  { id: 'mrigashirsha', sanskrit: 'Mrigashirsha', english: 'Mirugaseersham', script: 'மிருகசீரிடம்' },
  { id: 'ardra', sanskrit: 'Ardra', english: 'Thiruvathirai', script: 'திருவாதிரை' },
  { id: 'punarvasu', sanskrit: 'Punarvasu', english: 'Punarpoosam', script: 'புனர்பூசம்' },
  { id: 'pushya', sanskrit: 'Pushya', english: 'Poosam', script: 'பூசம்' },
  { id: 'ashlesha', sanskrit: 'Ashlesha', english: 'Aayilyam', script: 'ஆயில்யம்' },
  { id: 'magha', sanskrit: 'Magha', english: 'Magam', script: 'மகம்' },
  { id: 'purva_phalguni', sanskrit: 'Purva Phalguni', english: 'Pooram', script: 'பூரம்' },
  { id: 'uttara_phalguni', sanskrit: 'Uttara Phalguni', english: 'Uthiram', script: 'உத்திரம்' },
  { id: 'hasta', sanskrit: 'Hasta', english: 'Hastham', script: 'அஸ்தம்' },
  { id: 'chitra', sanskrit: 'Chitra', english: 'Chithirai', script: 'சித்திரை' },
  { id: 'swati', sanskrit: 'Swati', english: 'Swathi', script: 'சுவாதி' },
  { id: 'vishakha', sanskrit: 'Vishakha', english: 'Visaakam', script: 'விசாகம்' },
  { id: 'anuradha', sanskrit: 'Anuradha', english: 'Anusham', script: 'அனுஷம்' },
  { id: 'jyeshtha', sanskrit: 'Jyeshtha', english: 'Kettai', script: 'கேட்டை' },
  { id: 'mula', sanskrit: 'Mula', english: 'Moolam', script: 'மூலம்' },
  { id: 'purva_ashadha', sanskrit: 'Purva Ashadha', english: 'Pooraadam', script: 'பூராடம்' },
  { id: 'uttara_ashadha', sanskrit: 'Uttara Ashadha', english: 'Uthiraadam', script: 'உத்திராடம்' },
  { id: 'shravana', sanskrit: 'Shravana', english: 'Thiruvonam', script: 'திருவோணம்' },
  { id: 'dhanishtha', sanskrit: 'Dhanishtha', english: 'Avittam', script: 'அவிட்டம்' },
  { id: 'shatabhisha', sanskrit: 'Shatabhisha', english: 'Sadhayam', script: 'சதயம்' },
  { id: 'purva_bhadrapada', sanskrit: 'Purva Bhadrapada', english: 'Poorattathi', script: 'பூரட்டாதி' },
  { id: 'uttara_bhadrapada', sanskrit: 'Uttara Bhadrapada', english: 'Uthirattathi', script: 'உத்திரட்டாதி' },
  { id: 'revathi', sanskrit: 'Revathi', english: 'Revathi', script: 'ரேவதி' },
];