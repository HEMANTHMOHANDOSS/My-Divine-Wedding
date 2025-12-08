
import { Profile } from './mockData';

// --- CONFIGURATION ---

export interface UserPreferences {
  ageRange: [number, number];
  heightRange: [number, number]; // in cm
  maritalStatus: string[];
  religion: string[];
  caste: string[];
  education: string[];
  occupationType: string[];
  minIncome: number;
  diet: string[];
  location: string[];
  smoking: string;
  drinking: string;
  starPreference: string[]; // Nakshatras
}

export interface MatchResult {
  profile: Profile;
  score: number; // 0 to 100
  breakdown: {
    basic: number; // Age, Height
    social: number; // Religion, Caste
    career: number; // Education, Job, Income
    lifestyle: number; // Diet, Habits
    horoscope: number; // Star matching
  };
  tags: string[]; // "Top Education Match", "Horoscope Compatible", "Near Match"
  isFallback?: boolean; // If strict filters were relaxed
}

const WEIGHTS = {
  AGE: 15,
  HEIGHT: 10,
  RELIGION_CASTE: 20,
  CAREER_FINANCE: 20,
  LIFESTYLE: 15,
  HOROSCOPE: 10,
  LOCATION: 5,
  BEHAVIORAL_BOOST: 5,
  PREMIUM_BOOST: 5,
};

// --- HELPER FUNCTIONS ---

const getAgeScore = (age: number, range: [number, number]): number => {
  if (age >= range[0] && age <= range[1]) return 1;
  // Linear decay: lose 20% score for every year outside range
  const diff = Math.min(Math.abs(age - range[0]), Math.abs(age - range[1]));
  return Math.max(0, 1 - (diff * 0.2));
};

const getHeightScore = (heightCm: number, range: [number, number]): number => {
  if (heightCm >= range[0] && heightCm <= range[1]) return 1;
  const diff = Math.min(Math.abs(heightCm - range[0]), Math.abs(heightCm - range[1]));
  // Lose 10% per 2cm difference
  return Math.max(0, 1 - (diff * 0.05));
};

const getHoroscopeCompatibility = (userStar: string, matchStar: string): number => {
  // SIMPLIFIED MOCK LOGIC: In reality, this would use a complex chart matching library
  if (!userStar || !matchStar) return 0.5; // Neutral if unknown
  
  // Mock 'Great Matches'
  if (userStar === matchStar) return 0.8; // Same star is okay sometimes
  return 0.6; // Base score for mock
};

// --- CORE ALGORITHM ---

export const calculateCompatibility = (
  userProfile: any, // The logged-in user details
  preferences: UserPreferences,
  candidates: Profile[],
  interactions?: { viewed: string[], liked: string[] } // Mock user behavior data
): MatchResult[] => {
  
  const results: MatchResult[] = candidates.map(candidate => {
    let tags: string[] = [];
    
    // 1. HARD FILTERS (Gatekeepers) - Skip logic applied outside usually, but we check critical mismatches here
    
    // 2. SCORING CATEGORIES

    // A. Basic Stats (Age & Height) - 25% Total
    const ageScoreRaw = getAgeScore(candidate.age, preferences.ageRange);
    const heightScoreRaw = getHeightScore(candidate.heightCm, preferences.heightRange);
    const basicScore = ((ageScoreRaw * WEIGHTS.AGE) + (heightScoreRaw * WEIGHTS.HEIGHT));

    // B. Social & Cultural (Religion, Caste) - 20% Total
    let socialScoreRaw = 0;
    if (preferences.religion.length === 0 || preferences.religion.includes(candidate.religion)) socialScoreRaw += 0.5;
    if (preferences.caste.length === 0 || preferences.caste.includes(candidate.caste) || preferences.caste.includes('Any')) socialScoreRaw += 0.5;
    const socialScore = socialScoreRaw * WEIGHTS.RELIGION_CASTE;

    // C. Career & Finance - 20% Total
    let careerScoreRaw = 0.2; // Base
    // Education match (fuzzy)
    if (preferences.education.length === 0 || preferences.education.some(edu => candidate.education.includes(edu) || candidate.education.includes("Ph.D") || candidate.education.includes("Masters"))) careerScoreRaw += 0.4;
    
    // Income check
    const candIncome = parseInt(candidate.income.replace(/[^0-9]/g, '')) * (candidate.income.includes('Lakhs') ? 100000 : 1);
    if (candIncome >= preferences.minIncome) careerScoreRaw += 0.4;
    const careerScore = careerScoreRaw * WEIGHTS.CAREER_FINANCE;

    // D. Lifestyle (Diet, Habits) - 15% Total
    let lifestyleScoreRaw = 0.2;
    if (preferences.diet.length === 0 || preferences.diet.includes(candidate.diet) || preferences.diet.includes('Any')) lifestyleScoreRaw += 0.4;
    if (candidate.smoking === preferences.smoking || preferences.smoking === 'Any') lifestyleScoreRaw += 0.2;
    if (candidate.drinking === preferences.drinking || preferences.drinking === 'Any') lifestyleScoreRaw += 0.2;
    const lifestyleScore = lifestyleScoreRaw * WEIGHTS.LIFESTYLE;

    // E. Horoscope - 10% Total
    const astroScoreRaw = getHoroscopeCompatibility(userProfile.nakshatra, candidate.nakshatra);
    const horoscopeScore = astroScoreRaw * WEIGHTS.HOROSCOPE;

    // F. Location - 5% Total
    let locationScore = 0;
    if (preferences.location.length === 0 || preferences.location.some(loc => candidate.location.includes(loc))) {
      locationScore = WEIGHTS.LOCATION;
      tags.push("Nearby Match");
    }

    // G. Behavioral Boost (Machine Learning Simulation)
    let behaviorScore = 0;
    if (interactions) {
        // If user likes Doctors, boost Doctors
        if (interactions.liked.includes(candidate.occupation)) behaviorScore += 2;
    }
    
    // H. Premium & Trust Boost
    let trustScore = 0;
    if (candidate.isVerified) trustScore += 3;
    if (candidate.isPremium) trustScore += 2;

    // --- FINAL CALCULATION ---
    let totalScore = basicScore + socialScore + careerScore + lifestyleScore + horoscopeScore + locationScore + behaviorScore + trustScore;
    
    // Normalize to 100 max
    totalScore = Math.min(100, Math.round(totalScore));

    // --- TAG GENERATION ---
    if (socialScoreRaw >= 0.8) tags.push("Community Match");
    if (careerScoreRaw >= 0.8) tags.push("Career Match");
    if (totalScore > 90) tags.push("Super Match");
    if (candidate.isVerified) tags.push("Verified");

    return {
      profile: { ...candidate, matchScore: totalScore }, // Inject calculated score
      score: totalScore,
      breakdown: {
        basic: basicScore,
        social: socialScore,
        career: careerScore,
        lifestyle: lifestyleScore,
        horoscope: horoscopeScore
      },
      tags
    };
  });

  // Sort by score desc
  return results.sort((a, b) => b.score - a.score);
};

export const getFallbackMatches = (
  userProfile: any,
  preferences: UserPreferences,
  candidates: Profile[]
): MatchResult[] => {
  // Relax constraints: Widen age range by 2 years, height by 5cm, ignore income
  const relaxedPrefs = {
    ...preferences,
    ageRange: [preferences.ageRange[0] - 2, preferences.ageRange[1] + 2] as [number, number],
    heightRange: [preferences.heightRange[0] - 5, preferences.heightRange[1] + 5] as [number, number],
    minIncome: 0,
    religion: [], // Relax religion
    caste: [] // Relax caste
  };
  
  const results = calculateCompatibility(userProfile, relaxedPrefs, candidates);
  
  return results.map(r => ({
    ...r,
    tags: [...r.tags, "Flexible Match"],
    isFallback: true
  }));
};
