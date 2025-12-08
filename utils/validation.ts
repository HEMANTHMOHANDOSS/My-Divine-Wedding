
export const PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE_INDIAN: /^[6-9]\d{9}$/, 
  PHONE_INTERNATIONAL: /^\d{7,15}$/,
  NAME: /^[a-zA-Z\s]{2,50}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  OTP: /^\d{6}$/,
  PINCODE: /^[1-9][0-9]{5}$/,
  GST: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  LICENSE: /^[a-zA-Z0-9\-/]{5,20}$/,
  AGENCY_NAME: /^[a-zA-Z0-9\s&.,'-]{3,100}$/,
  YEARS_EXP: /^(?:[0-9]|[1-4][0-9]|50)$/,
  INCOME: /^[0-9,]+$/,
  TEXT_AREA: /^[\s\S]{20,1000}$/,
  ADDRESS: /^[a-zA-Z0-9\s,.\-/#]+$/,
  HEIGHT: /^[4-7]'\d{1,2}"$|^[1-2]\d{2}$/,
  WEIGHT: /^\d{2,3}$/,
  GOTHRAM: /^[a-zA-Z\s]{3,30}$/,
  // New ID Patterns
  AADHAAR: /^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$|^[2-9]{1}[0-9]{11}$/, // 12 digits, optional spaces
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, // Standard PAN format
  PASSPORT: /^[A-Z]{1}[0-9]{7}$/, // Standard Indian Passport
};

export const COUNTRY_CODES = [
  { code: '+91', country: 'IN', label: 'India (+91)' },
  { code: '+1', country: 'US', label: 'USA (+1)' },
  { code: '+44', country: 'UK', label: 'UK (+44)' },
  { code: '+61', country: 'AU', label: 'Australia (+61)' },
  { code: '+971', country: 'AE', label: 'UAE (+971)' },
  { code: '+65', country: 'SG', label: 'Singapore (+65)' },
  { code: '+60', country: 'MY', label: 'Malaysia (+60)' },
  { code: '+1', country: 'CA', label: 'Canada (+1)' },
];

export const formatCurrency = (value: string) => {
  const number = value.replace(/[^0-9]/g, '');
  if (!number) return '';
  return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 20 }).format(Number(number));
};

export const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const validateFile = (file: File) => {
  const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return 'Invalid file type. Allowed: JPG, PNG, PDF, MP4.';
  }
  if (file.size > maxSize) {
    return 'File size too large. Max 10MB allowed.';
  }
  return null;
};

export const validateField = (name: string, value: string, extraData?: any): string | null => {
  if (!value && name !== 'secondaryMobile' && name !== 'introVideo') return `${formatFieldName(name)} is required`;
  if (!value && (name === 'secondaryMobile' || name === 'introVideo')) return null;

  const valStr = String(value).trim();

  switch (name) {
    case 'email':
    case 'professionalEmail':
      return PATTERNS.EMAIL.test(valStr) ? null : 'Invalid email address format';
    
    case 'mobile':
    case 'phone':
    case 'contactNumber':
      if (extraData === '+91') {
        return PATTERNS.PHONE_INDIAN.test(valStr.replace(/\s/g, '')) ? null : 'Invalid India number (10 digits)';
      }
      return PATTERNS.PHONE_INTERNATIONAL.test(valStr.replace(/\s/g, '')) ? null : 'Invalid phone number';

    case 'firstName':
    case 'lastName':
    case 'fullName':
    case 'guardianName':
    case 'fatherName':
    case 'motherName':
      return PATTERNS.NAME.test(valStr) ? null : 'Alphabets only (min 2 chars)';

    case 'password':
      return PATTERNS.PASSWORD.test(valStr) ? null : 'Min 8 chars, 1 letter, 1 number, 1 special char';

    case 'pincode':
      return PATTERNS.PINCODE.test(valStr) ? null : 'Invalid 6-digit Pincode';

    case 'gst':
      return PATTERNS.GST.test(valStr) ? null : 'Invalid GST Number format';
      
    case 'license':
      return PATTERNS.LICENSE.test(valStr) ? null : 'Invalid License ID format';

    case 'agencyName':
      return PATTERNS.AGENCY_NAME.test(valStr) ? null : 'Invalid Agency Name';
      
    case 'yearsExperience':
    case 'siblings':
    case 'weight':
    case 'height':
       if(name === 'height' && valStr.includes("'")) return PATTERNS.HEIGHT.test(valStr) ? null : 'Format: 5\'9" or 175'; 
       return /^\d+$/.test(valStr) ? null : 'Must be a number';

    case 'dob':
      const age = calculateAge(valStr);
      if (age < 18) return 'Must be at least 18 years old';
      if (age > 75) return 'Age cannot exceed 75 years';
      return null;

    case 'income':
    case 'serviceCharges':
      const num = valStr.replace(/,/g, '');
      if (isNaN(Number(num))) return 'Must be a number';
      return null;

    case 'about':
    case 'testimonials':
    case 'message':
    case 'bio':
      return PATTERNS.TEXT_AREA.test(valStr) ? null : 'Must be between 20-1000 characters';
      
    case 'officeAddress':
    case 'city':
    case 'address':
      return PATTERNS.ADDRESS.test(valStr) ? null : 'Invalid characters (no emojis allowed)';
    
    case 'gothram':
        return PATTERNS.GOTHRAM.test(valStr) ? null : 'Invalid format';

    // ID Validation
    case 'aadhaar':
        return PATTERNS.AADHAAR.test(valStr) ? null : 'Invalid Aadhaar (12 digits)';
    case 'pan':
        return PATTERNS.PAN.test(valStr) ? null : 'Invalid PAN format (e.g., ABCDE1234F)';
    case 'passport':
        return PATTERNS.PASSPORT.test(valStr) ? null : 'Invalid Passport Number';

    default:
      return valStr.length > 0 ? null : 'Required';
  }
};

const formatFieldName = (name: string) => {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};
