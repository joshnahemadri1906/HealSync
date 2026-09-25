export type UserRole = 'patient' | 'doctor' | 'admin';

export type DoctorStatus = 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  condition?: string; // e.g. "Lower Back Pain", "Frozen Shoulder"
  doctorStatus?: DoctorStatus; // only relevant for doctors
  doctorDetails?: {
    speciality: string;
    clinicName: string;
    experience: number;
    fee: number;
    city: string;
    qualification: string;
  };
}

export interface Physiotherapist {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  experience: number;
  clinicName: string;
  location: string;
  city: string;
  fee: number;
  rating: number; // e.g., 98 for 98%
  patientStoriesCount: number;
  availability: string;
  speciality: string;
  photoUrl: string;
  bio: string;
  isCustomAdded?: boolean;
}

export interface BodySystem {
  id: string;
  name: string;
  tamilName: string;
  hindiName: string;
  teluguName: string;
  iconName: string;
  whyItMatters: string;
  commonConditions: string[];
  anatomicalParts: string[];
  dietRecommendations: {
    title: string;
    keyNutrients: string[];
    foodsToEat: string[];
    foodsToAvoid: string[];
    dailyHydrationTip: string;
    clinicalRationale: string;
  };
  rehabilitationExercises: {
    name: string;
    targetMuscleOrJoint: string;
    reps: string;
    frequency: string;
    instructions: string[];
    precautions: string;
    difficulty: 'Gentle / Beginner' | 'Moderate' | 'Advanced';
  }[];
  interactiveHotspots: {
    part: string;
    x: number; // percentage on diagram
    y: number;
    description: string;
  }[];
}

export interface HealthReminder {
  id: string;
  patientEmail: string;
  type: 'water' | 'breakfast' | 'lunch' | 'dinner' | 'exercise' | 'custom';
  title: string;
  time: string; // e.g., "08:30" or "Every 1 hour"
  notes: string;
  isActive: boolean;
  frequency: string;
}

export interface DispatchedEmail {
  id: string;
  to: string;
  patientName: string;
  type: string;
  subject: string;
  body: string;
  sentAt: string;
  status: 'delivered' | 'queued';
}

export type SupportedLanguage = 'en' | 'ta' | 'hi' | 'te' | 'ml' | 'kn';

export interface VoicePersona {
  id: string;
  name: string;
  gender: 'female' | 'male';
  tag: string;
  rate: number;
  pitch: number;
  langCode: string;
}
