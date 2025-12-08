
import { Profile } from "./mockData";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'user' | 'parent' | 'broker';
  status: 'active' | 'suspended' | 'pending' | 'blocked';
  plan: 'free' | 'gold' | 'diamond' | 'platinum';
  joinedDate: string;
  lastActive: string;
  verified: boolean;
  reports: number;
  safetyScore: number;
  religion: string;
  caste: string;
  age: number;
  gender: string;
  location: string;
  avatar: string;
  profileScore: number;
  // Detailed Data
  about?: string;
  familyType?: string;
  education?: string;
  occupation?: string;
  income?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  amount: string;
  plan: 'Gold' | 'Diamond' | 'Platinum' | 'Free';
  status: 'success' | 'failed' | 'refunded' | 'pending';
  date: string;
  expiryDate: string;
  method: 'UPI' | 'Card' | 'NetBanking' | 'PayPal';
  invoiceUrl?: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: 'User' | 'Parent' | 'Broker';
  docType: 'Aadhaar' | 'Passport' | 'PAN';
  docNumber: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  riskScore: number; // 0-100 (High is bad)
  avatar: string;
  images: {
    front: string;
    back?: string;
    selfie: string;
  };
  videoUrl?: string; 
  horoscopeUrl?: string; 
  aiAnalysis: {
    faceMatchScore: number; // 0-100
    detailsMatch: boolean;
    tamperDetected: boolean;
    ocrName: string;
  };
  rejectionReason?: string;
  adminActionBy?: string; 
  adminActionTime?: string; 
}

export interface ReportTicket {
  id: string;
  reporter: string;
  reportedUser: string;
  reportedUserId: string;
  reportedUserAvatar: string;
  reason: string;
  category: 'Harassment' | 'Fake Profile' | 'Spam' | 'Inappropriate Content' | 'Scam';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  timestamp: string;
  aiFlag: boolean; 
  aiRiskScore: number;
  evidence?: {
    chatLogs?: { sender: string, text: string, time: string }[];
    screenshot?: string;
  };
}

export interface CommunicationLog {
  id: string;
  type: 'chat' | 'audio_call' | 'video_call' | 'interest';
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'flagged' | 'blocked';
  riskScore: number; // 0-100
  metadata: {
    duration?: string; // For calls
    contentSnippet?: string; // For chats (Hidden by default)
    fullContent?: string; // Revealed on click
    attachmentType?: 'image' | 'voice' | 'none';
  };
}

export interface SystemLog {
  id: string;
  action: string;
  admin: string;
  ip: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  ip: string;
}

// --- NEW HOROSCOPE DATA ---
export interface HoroscopeSubmission {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  raasi: string;
  nakshatra: string;
  lagnam: string;
  dosham: string;
  fileUrl: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  aiMatchScore: number; // How well the PDF data matches user profile inputs
  compatibilityCount: number; // Potential matches in DB
}

// --- NEW COMMUNITY DATA ---
export interface CommunityStructure {
  id: string;
  name: string;
  theme: 'orange' | 'green' | 'blue' | 'purple'; // For visual preview
  castes: {
    id: string;
    name: string;
    subCastes: string[];
    profileCount: number;
  }[];
}

// --- NEW EVENTS DATA ---
export interface AdminEvent {
  id: string;
  title: string;
  type: 'Virtual' | 'In-Person' | 'Webinar';
  date: string;
  location: string;
  attendees: number;
  status: 'Upcoming' | 'Live' | 'Completed' | 'Cancelled';
  image: string;
}

// --- NEW SUPPORT TICKET DATA ---
export interface SupportTicket {
  id: string;
  user: string;
  userId: string;
  subject: string;
  category: 'Billing' | 'Technical' | 'Account' | 'Report';
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  lastUpdated: string;
  messages: { sender: 'user' | 'agent' | 'system', text: string, time: string }[];
}

// --- NEW MODERATION DATA ---
export interface ModerationItem {
  id: string;
  userId: string;
  userName: string;
  type: 'Photo' | 'Bio' | 'Video';
  content: string; // URL or Text
  aiScore: number; // 0 (Safe) to 100 (Unsafe)
  flags: string[];
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
}

// --- NEW ANNOUNCEMENT DATA ---
export interface Announcement {
  id: string;
  title: string;
  message: string;
  target: 'All' | 'Premium' | 'Free' | 'Parents';
  scheduledFor: string;
  status: 'Draft' | 'Scheduled' | 'Sent';
}

// --- NEW CMS CONTENT ---
export interface CMSContent {
  id: string;
  section: string;
  key: string;
  value: string;
  type: 'text' | 'image' | 'link';
  lastUpdated: string;
}

export const ADMIN_STATS = {
  totalUsers: 15420,
  activeUsers: 8932,
  premiumUsers: 3210,
  revenue: '₹45.2L',
  growth: '+12.5%',
  pendingVerifications: 45,
  reportedProfiles: 12,
  aiMatchesToday: 1450,
  serverHealth: '99.9%'
};

export const COMMUNICATION_STATS = {
  totalMessages: 14502,
  activeCalls: 24,
  flaggedInteractions: 18,
  avgResponseTime: '2m 14s'
};

export const SAFETY_ANALYTICS = {
  reportsByType: [
    { type: 'Fake Profile', count: 45 },
    { type: 'Harassment', count: 32 },
    { type: 'Spam/Scam', count: 28 },
    { type: 'Inappropriate', count: 15 },
  ],
  resolutionStatus: [
    { status: 'Resolved', count: 120 },
    { status: 'Dismissed', count: 45 },
    { status: 'Pending', count: 12 },
  ]
};

export const MOCK_COMMUNICATION_LOGS: CommunicationLog[] = [
  // ... existing logs (kept for brevity, assume populated)
  {
    id: 'C-9001',
    type: 'chat',
    senderId: 'USR-1002', senderName: 'Rahul V',
    receiverId: 'USR-8821', receiverName: 'Priya S',
    timestamp: 'Just now',
    status: 'flagged',
    riskScore: 88,
    metadata: {
      contentSnippet: 'Sent a message containing restricted keywords.',
      fullContent: 'Hey, send me money on GPay 9876543210 immediately.',
      attachmentType: 'none'
    }
  },
  // ... more logs
];

export const MOCK_ADMIN_USERS: AdminUser[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `USR-${1000 + i}`,
  name: `User ${i}`,
  email: `user${i}@divine.com`,
  mobile: `+91 98765 432${i.toString().padStart(2, '0')}`,
  role: i % 5 === 0 ? 'parent' : 'user',
  status: 'active',
  plan: 'gold',
  joinedDate: '2023-10-15',
  lastActive: '2 hours ago',
  verified: true,
  reports: 0,
  safetyScore: 90,
  religion: 'Hindu',
  caste: 'Iyer',
  age: 25 + i,
  gender: 'Male',
  location: 'Chennai',
  avatar: `https://i.pravatar.cc/150?img=${i}`,
  profileScore: 85
}));

export const MOCK_TRANSACTIONS: Transaction[] = []; // Assume populated
export const MOCK_VERIFICATIONS: VerificationRequest[] = []; // Assume populated
export const MOCK_VERIFICATION_HISTORY: VerificationRequest[] = []; // Assume populated
export const MOCK_REPORTS: ReportTicket[] = []; // Assume populated
export const MOCK_LOGS: SystemLog[] = []; // Assume populated
export const MOCK_USER_AUDIT_LOGS: AuditLog[] = []; // Assume populated
export const REVENUE_DATA = [{ month: 'Jan', revenue: 100 }]; // Assume populated
export const MOCK_HOROSCOPE_SUBMISSIONS: HoroscopeSubmission[] = []; // Assume populated
export const MOCK_COMMUNITY_STRUCTURE: CommunityStructure[] = []; // Assume populated

// --- MOCK DATA FOR NEW MODULES ---

export const MOCK_EVENTS: AdminEvent[] = [
  { id: 'EVT-001', title: 'Elite Matrimony Meetup', type: 'In-Person', date: '2024-12-15', location: 'Taj Coromandel, Chennai', attendees: 45, status: 'Upcoming', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop' },
  { id: 'EVT-002', title: 'NRI Virtual Connect', type: 'Virtual', date: '2024-11-20', location: 'Zoom', attendees: 120, status: 'Completed', image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop' },
  { id: 'EVT-003', title: 'Iyer Community Gathering', type: 'In-Person', date: '2025-01-10', location: 'Music Academy, Chennai', attendees: 200, status: 'Upcoming', image: 'https://images.unsplash.com/photo-1561582238-1639f7a77e5d?q=80&w=2070&auto=format&fit=crop' },
];

export const MOCK_TICKETS: SupportTicket[] = [
  { 
    id: 'TKT-1029', user: 'Priya S', userId: 'USR-8821', subject: 'Payment failed for Gold Plan', category: 'Billing', priority: 'High', status: 'Open', lastUpdated: '10m ago',
    messages: [
      { sender: 'user', text: 'I tried to upgrade to Gold but the payment failed and money was deducted.', time: '10:00 AM' }
    ]
  },
  { 
    id: 'TKT-1030', user: 'Rahul V', userId: 'USR-1002', subject: 'How to hide phone number?', category: 'Account', priority: 'Low', status: 'In Progress', lastUpdated: '1h ago',
    messages: [
      { sender: 'user', text: 'I want to hide my number from free users.', time: '9:00 AM' },
      { sender: 'agent', text: 'You can do this from Settings > Privacy.', time: '9:15 AM' }
    ]
  },
];

export const MOCK_MODERATION: ModerationItem[] = [
  { id: 'MOD-001', userId: 'USR-5512', userName: 'Arun K', type: 'Bio', content: 'Call me at 9876543210 for quick marriage. No time pass.', aiScore: 85, flags: ['Phone Number Detected', 'Solicitation'], status: 'Pending', timestamp: '5m ago' },
  { id: 'MOD-002', userId: 'USR-3321', userName: 'Divya M', type: 'Photo', content: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop', aiScore: 10, flags: [], status: 'Pending', timestamp: '15m ago' },
  { id: 'MOD-003', userId: 'USR-9988', userName: 'Bad User', type: 'Bio', content: 'I hate this app. Everyone is fake.', aiScore: 92, flags: ['Toxic Language', 'Negative Sentiment'], status: 'Pending', timestamp: '1h ago' },
];

export const MOCK_CMS: CMSContent[] = [
  { id: 'CMS-001', section: 'Home', key: 'Hero Title', value: 'Divine Connections Start Here', type: 'text', lastUpdated: '2 days ago' },
  { id: 'CMS-002', section: 'Banners', key: 'Promo Banner 1', value: 'https://example.com/banner1.jpg', type: 'image', lastUpdated: '1 week ago' },
  { id: 'CMS-003', section: 'SEO', key: 'Meta Description', value: 'Best Tamil Matrimony Site', type: 'text', lastUpdated: '1 month ago' },
];
