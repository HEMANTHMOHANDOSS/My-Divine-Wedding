
import { Profile, generateMockProfiles, MOCK_EXISTING_USERS } from './mockData';

export const analyzePhotoQuality = async (file: File): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock random score between 60 and 98 based on file size/randomness
      const score = Math.floor(Math.random() * (98 - 60 + 1) + 60);
      resolve(score);
    }, 1500);
  });
};

export const simulateEnhancement = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2000);
  });
};

export const verifySelfieMatch = async (): Promise<'matched' | 'failed'> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 90% chance of success for demo
      const success = Math.random() > 0.1;
      resolve(success ? 'matched' : 'failed');
    }, 2500);
  });
};

export const checkContentSafety = async (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true); // Assume safe for demo
    }, 1000);
  });
};

// --- NEW ID VERIFICATION MOCKS ---

export interface OCRResult {
  name: string;
  dob: string;
  idNumber: string;
  confidence: number;
}

export const performOcrScan = async (file: File, type: 'aadhaar' | 'pan' | 'passport'): Promise<OCRResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock Data Extraction
      resolve({
        name: "Karthik Ramaswamy",
        dob: "1995-05-20",
        idNumber: type === 'aadhaar' ? '4521 8956 2314' : type === 'pan' ? 'ABCDE1234F' : 'P1234567',
        confidence: 95
      });
    }, 3000); // 3 second scan delay
  });
};

export const verifyFaceMatch = async (idPhoto: File | null, selfie: File | null): Promise<{ match: boolean, score: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock comparison
      const score = Math.floor(Math.random() * (99 - 85 + 1) + 85); // High match score for demo
      resolve({
        match: score > 75,
        score
      });
    }, 2500);
  });
};

// --- HOROSCOPE MOCKS ---

export interface HoroscopeData {
  raasi: string;
  nakshatra: string;
  lagnam: string;
  dosham: string[];
}

export const extractHoroscopeData = async (file: File): Promise<HoroscopeData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        raasi: 'simha',
        nakshatra: 'magha',
        lagnam: 'thula',
        dosham: ['chevvai']
      });
    }, 2500);
  });
};

export interface MatchReport {
  totalScore: number; // out of 10
  poruthams: {
    dina: boolean;
    gana: boolean;
    mahendra: boolean;
    streeDeergha: boolean;
    yoni: boolean;
    rasi: boolean;
    rasiAdhipathi: boolean;
    vasya: boolean;
    rajju: boolean;
    vedha: boolean;
  };
  doshamStatus: string;
  verdict: 'excellent' | 'good' | 'average' | 'poor';
}

export const compareHoroscopes = async (p1: any, p2: any): Promise<MatchReport> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock Match Logic
      const score = Math.floor(Math.random() * 4) + 6; // 6 to 9 points
      resolve({
        totalScore: score,
        poruthams: {
          dina: Math.random() > 0.3,
          gana: Math.random() > 0.2,
          mahendra: Math.random() > 0.4,
          streeDeergha: true,
          yoni: Math.random() > 0.3,
          rasi: true,
          rasiAdhipathi: Math.random() > 0.2,
          vasya: Math.random() > 0.5,
          rajju: true, // Most important
          vedha: true,
        },
        doshamStatus: "No major Dosham matches found. Chevvai Dosham is compatible.",
        verdict: score > 7 ? 'excellent' : 'good'
      });
    }, 3000);
  });
};

// --- PROFILE ENHANCEMENT AI ---

export interface ProfileAnalysis {
  overallScore: number;
  breakdown: {
    basic: number;
    photos: number;
    bio: number;
    preferences: number;
  };
  suggestions: {
    id: string;
    category: 'photo' | 'bio' | 'basic' | 'preferences';
    text: string;
    impact: 'high' | 'medium' | 'low';
    action: string;
  }[];
}

export const getProfileAnalysis = async (): Promise<ProfileAnalysis> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        overallScore: 78,
        breakdown: {
          basic: 100,
          photos: 65,
          bio: 80,
          preferences: 70
        },
        suggestions: [
          { id: '1', category: 'photo', text: 'Upload at least 3 photos to increase visibility by 40%.', impact: 'high', action: 'Upload Photos' },
          { id: '2', category: 'bio', text: 'Your bio is a bit short. Add details about your hobbies.', impact: 'medium', action: 'Edit Bio' },
          { id: '3', category: 'preferences', text: 'Broaden your age preference by 2 years to see 15+ more matches.', impact: 'medium', action: 'Update Prefs' },
          { id: '4', category: 'photo', text: 'Your primary photo has low lighting. Consider using our AI Enhancer.', impact: 'low', action: 'Enhance' }
        ]
      });
    }, 1500);
  });
};

export const getAiMatchRecommendations = async (context: string): Promise<Profile[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return 3 random profiles as recommendations
      const matches = generateMockProfiles(3);
      // Inject fake AI match reasons
      matches.forEach(m => {
        m.matchScore = Math.floor(Math.random() * (99 - 85) + 85);
        m.about = `AI Reason: Matches your preference for ${context.includes('engineer') ? 'Engineers' : 'Music and Travel'}.`;
      });
      resolve(matches);
    }, 1000);
  });
};

// --- PARENT / CHILD VERIFICATION ---
export const verifyChildAccount = async (email: string, mobile: string): Promise<{ found: boolean, child?: any }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const match = MOCK_EXISTING_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() || u.mobile === mobile
      );
      resolve({
        found: !!match,
        child: match
      });
    }, 2000);
  });
};
