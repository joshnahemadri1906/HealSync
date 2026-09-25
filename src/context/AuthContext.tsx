import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, DoctorStatus } from '../types';
import { INITIAL_PHYSIOTHERAPISTS } from '../data/physiotherapists';

export const ADMIN_EMAILS = [
  'lakshanakvs08@gmail.com',
  'joshnahemadri1906@gmail.com',
  'jebagracy123@gmail.com',
  'jebajbin123@gmail.com',
];

export interface DoctorApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  speciality: string;
  clinicName: string;
  experience: number;
  fee: number;
  qualification: string;
  status: DoctorStatus;
  appliedAt: string;
  notes?: string;
  location?: string;
  city?: string;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  isAdmin: boolean;
  isDoctor: boolean;
  isPatient: boolean;
  doctorStatus: DoctorStatus | null;
  doctorApplications: DoctorApplication[];
  loginAsPatient: (name: string, email: string, condition?: string) => void;
  loginAsDoctor: (email: string) => { success: boolean; status?: DoctorStatus; message?: string };
  registerDoctor: (app: Omit<DoctorApplication, 'id' | 'status' | 'appliedAt'>) => { id: string; status: DoctorStatus };
  approveDoctorApplication: (id: string) => void;
  rejectDoctorApplication: (id: string) => void;
  logout: () => void;
  quickSwitchRole: (role: 'patient' | 'pending_doctor' | 'approved_doctor' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// INITIAL APPLICATIONS GENERATED EXCLUSIVELY FROM USER'S 13 DOCTORS
// Approved doctors are ready to login; Pending doctors require Admin authorization
const INITIAL_APPLICATIONS: DoctorApplication[] = [
  {
    id: 'pt-1',
    name: 'Dr. S Sivabalan',
    email: 'dr.sivabalan@gmail.com',
    phone: '+91 98401 23456',
    speciality: 'Musculoskeletal Rehabilitation & Sports Injuries',
    clinicName: 'BEE Health Studio + 1 more',
    location: 'Thiruvanmiyur, Chennai',
    city: 'Chennai',
    experience: 17,
    fee: 800,
    qualification: 'Senior Consultant Physiotherapist',
    status: 'approved',
    appliedAt: '2026-09-10T10:00:00Z',
  },
  {
    id: 'pt-2',
    name: 'Dr. Aishvarya B',
    email: 'dr.aishvarya.b@gmail.com',
    phone: '+91 98402 34567',
    speciality: 'Postural Correction & Ergonomic Therapy',
    clinicName: 'BEE Health Studio',
    location: 'Thiruvanmiyur, Chennai',
    city: 'Chennai',
    experience: 3,
    fee: 800,
    qualification: 'Consultant Physiotherapist',
    status: 'approved',
    appliedAt: '2026-09-12T10:00:00Z',
  },
  {
    id: 'pt-3',
    name: 'Dr. R. Harish Kumar',
    email: 'dr.harishkumar@gmail.com',
    phone: '+91 98403 45678',
    speciality: 'Orthopedic & Geriatric Physical Therapy',
    clinicName: 'Sai Healthcare Foundation + 3 more',
    location: 'Porur, Chennai',
    city: 'Chennai',
    experience: 21,
    fee: 600,
    qualification: 'Lead Physiotherapist & Rehabilitation Director',
    status: 'approved',
    appliedAt: '2026-09-15T09:00:00Z',
  },
  {
    id: 'pt-4',
    name: 'Dr Rajeev Harshe S',
    email: 'dr.rajeev.harshe@gmail.com',
    phone: '+91 79 6670 1800',
    speciality: 'Pain & Rehabilitation Medicine, Pain Management',
    clinicName: 'Apollo Hospitals International Ltd',
    location: 'Gandhinagar Road, Ahmedabad',
    city: 'Ahmedabad',
    experience: 34,
    fee: 1500,
    qualification: 'MD ANAESTHESIA',
    status: 'approved',
    appliedAt: '2026-09-16T11:00:00Z',
  },
  {
    id: 'pt-5',
    name: 'Dr Seema Grover',
    email: 'dr.seema.grover@gmail.com',
    phone: '+91 11 2692 5858',
    speciality: 'Pain & Rehabilitation Medicine',
    clinicName: 'Apollo Hospitals',
    location: 'Sarita Vihar, Delhi',
    city: 'Delhi',
    experience: 29,
    fee: 1400,
    qualification: 'Masters in Physiotherapy',
    status: 'approved',
    appliedAt: '2026-09-18T14:30:00Z',
  },
  {
    id: 'pt-6',
    name: 'Dr Yogesh Mandhyan',
    email: 'dr.yogesh.mandhyan@gmail.com',
    phone: '+91 522 6677 777',
    speciality: 'Pain & Rehabilitation Medicine',
    clinicName: 'Apollo Hospitals',
    location: 'Kanpur Road, Lucknow',
    city: 'Lucknow',
    experience: 25,
    fee: 1200,
    qualification: 'Diploma in Physiotherapy',
    status: 'approved',
    appliedAt: '2026-09-19T08:00:00Z',
  },
  {
    id: 'pt-7',
    name: 'Dr Raj Prasanna',
    email: 'dr.raj.prasanna@gmail.com',
    phone: '+91 44 2829 0200',
    speciality: 'Pain & Rehabilitation Medicine',
    clinicName: 'Apollo Hospitals',
    location: 'Greams Road, Chennai',
    city: 'Chennai',
    experience: 25,
    fee: 1200,
    qualification: 'MPT, M.B.A (Physiotherapy)',
    status: 'approved',
    appliedAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'pt-8',
    name: 'Dr. G. Sakthivelan',
    email: 'dr.sakthivelan@gmail.com',
    phone: '+91 98405 67890',
    speciality: 'Manual Therapy & Neuro-Muscular Relief',
    clinicName: 'GVS Physiotherapy Clinic + 2 more',
    location: 'Choolaimedu, Chennai',
    city: 'Chennai',
    experience: 23,
    fee: 500,
    qualification: 'Principal Physiotherapist',
    status: 'approved',
    appliedAt: '2026-09-21T09:15:00Z',
  },
  {
    id: 'pt-9',
    name: 'Dr. Nirmala Ekambaram',
    email: 'dr.nirmala.ekambaram@gmail.com',
    phone: '+91 98406 78901',
    speciality: 'Pelvic Floor Therapy & Postnatal Rehab',
    clinicName: 'Promise Physiotherapy And Fitness Care Clinic',
    location: 'Mylapore, Chennai',
    city: 'Chennai',
    experience: 21,
    fee: 500,
    qualification: 'Clinical Director & Women Health Specialist',
    status: 'approved',
    appliedAt: '2026-09-22T13:40:00Z',
  },
  {
    id: 'pt-10',
    name: 'Dr. K Shanmuganandan',
    email: 'dr.shanmuganandan@gmail.com',
    phone: '+91 44 2829 3333',
    speciality: 'Complex Geriatric & Joint Rehabilitation',
    clinicName: 'Apollo Hospital + 1 more',
    location: 'Greams Road, Chennai',
    city: 'Chennai',
    experience: 39,
    fee: 1000,
    qualification: 'Chief Physical Therapy Specialist',
    status: 'approved',
    appliedAt: '2026-09-23T11:00:00Z',
  },
  // PENDING DOCTORS (Require Admin Approval before they can enter)
  {
    id: 'pt-11',
    name: 'Dr. K. Poongodi',
    email: 'dr.poongodi@gmail.com',
    phone: '+91 98408 90123',
    speciality: 'Vestibular & Balance Rehabilitation',
    clinicName: 'Sugam Physiotherapy Clinic + 1 more',
    location: 'Porur, Chennai',
    city: 'Chennai',
    experience: 22,
    fee: 450,
    qualification: 'Senior Physical Therapist',
    status: 'pending',
    appliedAt: '2026-09-24T15:20:00Z',
  },
  {
    id: 'pt-12',
    name: 'Dr. Rathna Pandi',
    email: 'dr.rathnapandi@gmail.com',
    phone: '+91 98409 01234',
    speciality: 'Sports Taping & Myofascial Therapy',
    clinicName: 'V V Physio Care',
    location: 'Thiruvottiyur, Chennai',
    city: 'Chennai',
    experience: 7,
    fee: 500,
    qualification: 'Consultant Physiotherapist',
    status: 'pending',
    appliedAt: '2026-09-24T18:05:00Z',
  },
  {
    id: 'pt-13',
    name: 'Dr. Bakthaprabhudas N',
    email: 'dr.bakthaprabhudas@gmail.com',
    phone: '+91 98410 12345',
    speciality: 'Electrophysical Agents & Lumbar Stabilization',
    clinicName: 'Prema Physiotherapy Clinic + 1 more',
    location: 'Sembakkam, Chennai',
    city: 'Chennai',
    experience: 21,
    fee: 400,
    qualification: 'Lead Physiotherapist',
    status: 'pending',
    appliedAt: '2026-09-25T01:00:00Z',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('physiocare_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Default user logged in as patient for immediate explore
    return {
      id: 'patient-guest-1',
      name: 'Ananya Sharma',
      email: 'joshnahemadri1906@gmail.com',
      role: 'patient',
      condition: 'Lower Back & Knee Stiffness',
      phone: '+91 98400 12345',
    };
  });

  const [doctorApplications, setDoctorApplications] = useState<DoctorApplication[]>(() => {
    try {
      const saved = localStorage.getItem('physiocare_doc_apps_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_APPLICATIONS;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('physiocare_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('physiocare_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('physiocare_doc_apps_v2', JSON.stringify(doctorApplications));
  }, [doctorApplications]);

  const isAdmin = currentUser
    ? currentUser.role === 'admin' || ADMIN_EMAILS.includes(currentUser.email.toLowerCase().trim())
    : false;

  const isDoctor = currentUser ? currentUser.role === 'doctor' : false;
  const isPatient = currentUser ? currentUser.role === 'patient' : false;

  const currentDoctorApp = currentUser && currentUser.role === 'doctor'
    ? doctorApplications.find((d) => d.email.toLowerCase() === currentUser.email.toLowerCase())
    : null;

  const doctorStatus: DoctorStatus | null = currentUser?.role === 'doctor'
    ? currentDoctorApp?.status || currentUser.doctorStatus || 'pending'
    : null;

  const loginAsPatient = (name: string, email: string, condition?: string) => {
    const cleanEmail = email.toLowerCase().trim();
    // If logging in with one of the 4 admin emails, upgrade to admin role
    const role: UserRole = ADMIN_EMAILS.includes(cleanEmail) ? 'admin' : 'patient';
    const user: UserProfile = {
      id: 'pat-' + Date.now(),
      name: name || 'Patient',
      email: cleanEmail,
      role: role,
      condition: condition || 'General Mobility Care',
    };
    setCurrentUser(user);
  };

  const loginAsDoctor = (email: string) => {
    const cleanEmail = email.toLowerCase().trim();

    // Check if email matches one of the 4 admins
    if (ADMIN_EMAILS.includes(cleanEmail)) {
      const user: UserProfile = {
        id: 'admin-' + Date.now(),
        name: 'Administrator',
        email: cleanEmail,
        role: 'admin',
      };
      setCurrentUser(user);
      return { success: true, status: 'approved' as DoctorStatus };
    }

    const docApp = doctorApplications.find((d) => d.email.toLowerCase() === cleanEmail);

    if (!docApp) {
      return {
        success: false,
        message: 'No doctor registered with this email. Please check your email or register your clinic details.',
      };
    }

    const user: UserProfile = {
      id: docApp.id,
      name: docApp.name,
      email: cleanEmail,
      role: 'doctor',
      doctorStatus: docApp.status,
      doctorDetails: {
        speciality: docApp.speciality,
        clinicName: docApp.clinicName,
        experience: docApp.experience,
        fee: docApp.fee,
        city: docApp.city || 'Chennai',
        qualification: docApp.qualification,
      },
    };

    setCurrentUser(user);
    return { success: true, status: docApp.status };
  };

  const registerDoctor = (app: Omit<DoctorApplication, 'id' | 'status' | 'appliedAt'>) => {
    const newId = 'doc-app-' + Date.now();
    const cleanEmail = app.email.toLowerCase().trim();

    // If email is an admin email, auto-approve
    const isAutoAdmin = ADMIN_EMAILS.includes(cleanEmail);
    const initialStatus: DoctorStatus = isAutoAdmin ? 'approved' : 'pending';

    const newApp: DoctorApplication = {
      ...app,
      email: cleanEmail,
      id: newId,
      status: initialStatus,
      appliedAt: new Date().toISOString(),
    };

    setDoctorApplications((prev) => [newApp, ...prev.filter((d) => d.email.toLowerCase() !== cleanEmail)]);

    const user: UserProfile = {
      id: newId,
      name: app.name,
      email: cleanEmail,
      role: isAutoAdmin ? 'admin' : 'doctor',
      doctorStatus: initialStatus,
      doctorDetails: {
        speciality: app.speciality,
        clinicName: app.clinicName,
        experience: app.experience,
        fee: app.fee,
        city: app.city || 'Chennai',
        qualification: app.qualification,
      },
    };

    setCurrentUser(user);
    return { id: newId, status: initialStatus };
  };

  const approveDoctorApplication = (id: string) => {
    setDoctorApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'approved' as DoctorStatus } : app))
    );

    // If current logged-in user is that doctor, update their status
    setCurrentUser((prev) => {
      if (prev && prev.id === id) {
        return { ...prev, doctorStatus: 'approved' };
      }
      return prev;
    });
  };

  const rejectDoctorApplication = (id: string) => {
    setDoctorApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'rejected' as DoctorStatus } : app))
    );

    setCurrentUser((prev) => {
      if (prev && prev.id === id) {
        return { ...prev, doctorStatus: 'rejected' };
      }
      return prev;
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('physiocare_user');
  };

  const quickSwitchRole = (role: 'patient' | 'pending_doctor' | 'approved_doctor' | 'admin') => {
    if (role === 'patient') {
      loginAsPatient('Ananya Sharma', 'joshnahemadri1906@gmail.com', 'Lower Back & Knee Stiffness');
    } else if (role === 'approved_doctor') {
      loginAsDoctor('dr.sivabalan@gmail.com');
    } else if (role === 'pending_doctor') {
      loginAsDoctor('dr.poongodi@gmail.com');
    } else if (role === 'admin') {
      loginAsPatient('System Admin', 'joshnahemadri1906@gmail.com');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isDoctor,
        isPatient,
        doctorStatus,
        doctorApplications,
        loginAsPatient,
        loginAsDoctor,
        registerDoctor,
        approveDoctorApplication,
        rejectDoctorApplication,
        logout,
        quickSwitchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
