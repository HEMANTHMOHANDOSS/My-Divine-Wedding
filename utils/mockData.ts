
export interface Profile {
  id: string;
  name: string;
  age: number;
  height: string; // e.g., "5'5""
  heightCm: number;
  img: string;
  matchScore: number; // Legacy field, will be overwritten by algo
  location: string;
  education: string;
  occupation: string;
  income: string;
  religion: string;
  caste: string;
  subCaste?: string;
  gothram: string;
  raasi: string;
  nakshatra: string;
  maritalStatus: string;
  motherTongue: string;
  diet: string;
  smoking: string;
  drinking: string;
  about: string;
  hobbies: string[];
  familyType: string;
  fatherJob: string;
  images: string[];
  isPremium: boolean;
  isVerified: boolean;
  lastActive: string;
  isNew?: boolean; // For 'New Matches'
}

export interface ActivityLog {
  id: string;
  type: 'connect' | 'interest' | 'shortlist' | 'view' | 'message' | 'search' | 'parent_action';
  description: string;
  timestamp: string;
  profileImage?: string;
  profileName?: string;
  actor?: 'You' | 'Parent'; 
}

export interface Visitor {
  id: string;
  profile: Profile;
  visitTime: string;
  visitCount: number;
}

const SAMPLE_NAMES = ["Priya", "Divya", "Ananya", "Lakshmi", "Sneha", "Kavya", "Riya", "Meera", "Swathi", "Shruti", "Varsha", "Nithya", "Deepa", "Keerthi", "Trisha"];
const SAMPLE_JOBS = ["Software Engineer", "Doctor", "Architect", "Bank Manager", "Professor", "Data Scientist", "Entrepreneur", "Civil Servant", "Artist", "Chartered Accountant"];
const SAMPLE_LOCATIONS = ["Chennai, TN", "Bangalore, KA", "Coimbatore, TN", "Madurai, TN", "Mumbai, MH", "Hyderabad, TS", "Trichy, TN", "Salem, TN", "Delhi, NCR", "Pune, MH"];
const SAMPLE_EDUCATION = ["B.Tech", "M.Tech", "MBBS, MD", "B.Com, MBA", "Ph.D", "B.Arch", "M.Sc", "B.A, M.A"];
const IMAGES = [
    "https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?q=80&w=2080&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1616766098956-c81f12114571?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554151228-14d9def656ec?q=80&w=1972&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1621784563330-caee0b138a00?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e28?q=80&w=2088&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595760780346-f972eb49f094?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
];

// Constants for Random Generation
const GOTHRAMS = ["Bharadwaja", "Kashyapa", "Vasishta", "Vishvamitra", "Sandilya", "Koundinya", "Harita", "Srivatsa"];
const RAASIS = ["mesha", "vrishabha", "mithuna", "karka", "simha", "kanya", "tula", "vrishchika", "dhanu", "makara", "kumbha", "meena"];
const NAKSHATRAS = ["ashvini", "bharani", "krithika", "rohini", "mrigashirsha", "ardra", "punarvasu", "pushya", "ashlesha", "magha", "purva_phalguni", "uttara_phalguni", "hasta", "chitra", "swati", "vishakha"];
const DIETS = ["veg", "non_veg", "egg", "vegan"];
const RELIGIONS = ["hindu", "christian", "muslim", "jain"];
const CASTES = ["Iyer", "Iyengar", "Mudaliar", "Vanniyar", "Nadar", "Chettiar", "Gounder", "Pillai"];

// Mock DB for Child Verification
export const MOCK_EXISTING_USERS = [
  { email: 'child@example.com', mobile: '9876543210', name: 'Arjun Kumar', id: 'MDM-8821', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop' },
  { email: 'daughter@example.com', mobile: '9876543211', name: 'Sneha Reddy', id: 'MDM-9932', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop' }
];

export const generateMockProfiles = (count: number): Profile[] => {
  return Array.from({ length: count }).map((_, i) => {
    const isPremium = Math.random() > 0.7;
    const heightCm = 150 + Math.floor(Math.random() * 30);
    const heightFt = Math.floor(heightCm / 30.48);
    const heightIn = Math.round((heightCm % 30.48) / 2.54);

    return {
      id: `MDM-${1000 + i}`,
      name: SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)],
      age: 21 + Math.floor(Math.random() * 12),
      height: `${heightFt}'${heightIn}"`,
      heightCm: heightCm,
      img: IMAGES[Math.floor(Math.random() * IMAGES.length)],
      matchScore: 0, // Calculated dynamically later
      location: SAMPLE_LOCATIONS[Math.floor(Math.random() * SAMPLE_LOCATIONS.length)],
      education: SAMPLE_EDUCATION[Math.floor(Math.random() * SAMPLE_EDUCATION.length)],
      occupation: SAMPLE_JOBS[Math.floor(Math.random() * SAMPLE_JOBS.length)],
      income: `${(Math.floor(Math.random() * 20) + 5)} Lakhs PA`,
      religion: RELIGIONS[Math.floor(Math.random() * RELIGIONS.length)],
      caste: CASTES[Math.floor(Math.random() * CASTES.length)],
      subCaste: "Vadakalai",
      gothram: GOTHRAMS[Math.floor(Math.random() * GOTHRAMS.length)],
      raasi: RAASIS[Math.floor(Math.random() * RAASIS.length)],
      nakshatra: NAKSHATRAS[Math.floor(Math.random() * NAKSHATRAS.length)],
      maritalStatus: Math.random() > 0.9 ? "never_married" : "divorced",
      motherTongue: "Tamil",
      diet: DIETS[Math.floor(Math.random() * DIETS.length)],
      smoking: Math.random() > 0.9 ? "no" : "yes",
      drinking: Math.random() > 0.8 ? "no" : "occasionally",
      about: "I am a warm, caring person looking for a partner who shares my values. I enjoy music, traveling, and spending time with family.",
      hobbies: ["Music", "Reading", "Travel", "Cooking"].sort(() => 0.5 - Math.random()).slice(0, 3),
      familyType: Math.random() > 0.5 ? "nuclear" : "joint",
      fatherJob: "Business",
      images: IMAGES.sort(() => 0.5 - Math.random()).slice(0, 3),
      isPremium: isPremium,
      isVerified: Math.random() > 0.3,
      lastActive: `${Math.floor(Math.random() * 5)} hours ago`,
      isNew: Math.random() > 0.7
    };
  });
};

export const MOCK_REQUESTS = [
  {
    id: 101,
    name: "Swathi M",
    age: 24,
    profession: "Doctor",
    location: "Chennai",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    compatibility: 92,
    time: "2h ago"
  },
  {
    id: 102,
    name: "Nithya K",
    age: 26,
    profession: "Software Engineer",
    location: "Bangalore",
    img: "https://images.unsplash.com/photo-1595760780346-f972eb49f094?q=80&w=1974&auto=format&fit=crop",
    compatibility: 85,
    time: "5h ago"
  }
];

export const MOCK_EVENTS = [
  {
    title: "Elite Professionals Meetup",
    date: "Dec 15, 2024",
    location: "Taj Coromandel, Chennai",
    attendees: "+45",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
    type: "Premium",
    status: "Upcoming"
  },
  {
    title: "USA/Canada NRI Matrimony",
    date: "Jan 10, 2025",
    location: "Virtual Event (Zoom)",
    attendees: "+120",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop",
    type: "Virtual",
    status: "Upcoming"
  },
  {
    title: "Iyer Community Gathering",
    date: "Jan 22, 2025",
    location: "Music Academy, Chennai",
    attendees: "+200",
    image: "https://images.unsplash.com/photo-1561582238-1639f7a77e5d?q=80&w=2070&auto=format&fit=crop",
    type: "Community",
    status: "Past"
  }
];

// --- CHAT & CALL MOCKS ---

export const MOCK_CHATS = [
  {
    id: 'c1',
    user: { id: 'u1', name: 'Lakshmi Priya', img: IMAGES[0], online: true },
    messages: [
      { id: 'm1', text: 'Hi Karthik, I saw your profile and found it interesting.', sender: 'them', time: '10:30 AM', status: 'read' },
      { id: 'm2', text: 'Hello Lakshmi! Thanks for reaching out. I liked your profile too.', sender: 'me', time: '10:32 AM', status: 'read' },
      { id: 'm3', text: 'Are you currently in Chennai?', sender: 'them', time: '10:35 AM', status: 'read' }
    ],
    lastMessage: 'Are you currently in Chennai?',
    lastTime: '10:35 AM',
    unread: 1
  },
  {
    id: 'c2',
    user: { id: 'u2', name: 'Divya S', img: IMAGES[1], online: false },
    messages: [
      { id: 'm1', text: 'Hi, would you be interested in connecting?', sender: 'me', time: 'Yesterday', status: 'delivered' }
    ],
    lastMessage: 'Hi, would you be interested in connecting?',
    lastTime: 'Yesterday',
    unread: 0
  },
  {
    id: 'c3',
    user: { id: 'u3', name: 'Ananya R', img: IMAGES[2], online: true },
    messages: [
      { id: 'm1', text: 'Thanks for accepting my request.', sender: 'them', time: '2 days ago', status: 'read' }
    ],
    lastMessage: 'Thanks for accepting my request.',
    lastTime: '2d ago',
    unread: 0
  }
];

export const MOCK_CALL_LOGS = [
  { id: 'cl1', name: 'Lakshmi Priya', type: 'audio', direction: 'incoming', duration: '5:23', time: 'Today, 11:00 AM' },
  { id: 'cl2', name: 'Divya S', type: 'video', direction: 'outgoing', duration: '0:00', time: 'Yesterday, 6:30 PM', missed: true },
  { id: 'cl3', name: 'Ananya R', type: 'audio', direction: 'outgoing', duration: '12:45', time: 'Mon, 4:15 PM' },
];
