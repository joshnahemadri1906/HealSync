import React, { useState } from 'react';
import {
  User,
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  Building,
  Award,
  IndianRupee,
  Clock,
  ArrowRight,
  Sparkles,
  Lock,
  Unlock,
  Check,
  X,
} from 'lucide-react';
import { useAuth, ADMIN_EMAILS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { INITIAL_PHYSIOTHERAPISTS } from '../data/physiotherapists';

interface SignInPageProps {
  onSuccessNavigate?: (tab: string) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onSuccessNavigate }) => {
  const {
    currentUser,
    doctorApplications,
    loginAsPatient,
    loginAsDoctor,
    registerDoctor,
    logout,
  } = useAuth();
  const { t } = useLanguage();

  const [activeRoleTab, setActiveRoleTab] = useState<'patient' | 'doctor' | 'admin'>('patient');

  // Patient Form State
  const [patientName, setPatientName] = useState('Ananya Sharma');
  const [patientEmail, setPatientEmail] = useState('joshnahemadri1906@gmail.com');
  const [patientPhone, setPatientPhone] = useState('+91 98400 12345');
  const [patientCondition, setPatientCondition] = useState('Lower Back & Knee Stiffness');
  const [patientSuccess, setPatientSuccess] = useState(false);

  // Doctor Form State
  const [selectedDoctorEmail, setSelectedDoctorEmail] = useState('dr.sivabalan@gmail.com');
  const [customDoctorEmail, setCustomDoctorEmail] = useState('');
  const [doctorAuthMessage, setDoctorAuthMessage] = useState<{
    type: 'success' | 'error' | 'pending';
    title: string;
    text: string;
  } | null>(null);

  // Doctor Registration Modal / Toggle
  const [isDoctorRegistering, setIsDoctorRegistering] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regClinic, setRegClinic] = useState('');
  const [regSpeciality, setRegSpeciality] = useState('');
  const [regQual, setRegQual] = useState('');
  const [regExp, setRegExp] = useState(10);
  const [regFee, setRegFee] = useState(600);

  // Admin Custom Input
  const [customAdminEmail, setCustomAdminEmail] = useState('');
  const [adminError, setAdminError] = useState('');

  // Handle Patient Direct Login
  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsPatient(patientName, patientEmail, patientCondition);
    setPatientSuccess(true);
    setTimeout(() => {
      if (onSuccessNavigate) {
        onSuccessNavigate('directory');
      }
    }, 700);
  };

  // Handle Doctor Login
  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailToUse = customDoctorEmail.trim() || selectedDoctorEmail;

    if (!emailToUse) {
      setDoctorAuthMessage({
        type: 'error',
        title: 'Email Required',
        text: 'Please select a doctor or enter a registered doctor email address.',
      });
      return;
    }

    const res = loginAsDoctor(emailToUse);

    if (!res.success) {
      setDoctorAuthMessage({
        type: 'error',
        title: 'Doctor Account Not Found',
        text: res.message || 'No registered doctor found with this email.',
      });
      return;
    }

    if (res.status === 'pending') {
      setDoctorAuthMessage({
        type: 'pending',
        title: 'Access Restricted: Approval Required',
        text: 'Your doctor account has not been approved yet. The administrator must review and approve your application before you can enter the portal. Please contact one of the 4 administrators.',
      });
    } else if (res.status === 'approved') {
      setDoctorAuthMessage({
        type: 'success',
        title: 'Doctor Authorization Verified',
        text: 'Welcome back! You have been granted access to the Doctor Workspace.',
      });
      setTimeout(() => {
        if (onSuccessNavigate) {
          onSuccessNavigate('doctor_portal');
        }
      }, 800);
    } else {
      setDoctorAuthMessage({
        type: 'error',
        title: 'Application Rejected',
        text: 'This doctor application was rejected by the administration.',
      });
    }
  };

  // Handle New Doctor Registration
  const handleDoctorRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) {
      alert('Please fill out your name and email address.');
      return;
    }

    const res = registerDoctor({
      name: regName.startsWith('Dr.') ? regName : `Dr. ${regName}`,
      email: regEmail,
      phone: regPhone || '+91 98400 00000',
      clinicName: regClinic || 'Physiotherapy Clinic',
      speciality: regSpeciality || 'General Physiotherapy',
      qualification: regQual || 'BPT / MPT',
      experience: Number(regExp) || 5,
      fee: Number(regFee) || 500,
    });

    if (res.status === 'pending') {
      setDoctorAuthMessage({
        type: 'pending',
        title: 'Registration Submitted - Pending Admin Approval',
        text: 'Your registration is submitted! However, as per medical governance, you can only enter once an admin approves your profile.',
      });
      setIsDoctorRegistering(false);
    }
  };

  // Handle Admin Login
  const handleAdminLogin = (email: string) => {
    const clean = email.toLowerCase().trim();
    if (!ADMIN_EMAILS.includes(clean)) {
      setAdminError(`"${email}" is not one of the 4 authorized administrator accounts.`);
      return;
    }
    setAdminError('');
    loginAsPatient('Platform Administrator', clean);
    if (onSuccessNavigate) {
      onSuccessNavigate('admin_panel');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4">
      {/* Top Banner / Heading */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-black uppercase tracking-wider mb-2">
          <Lock className="w-3.5 h-3.5 text-teal-700" /> Secure Role-Based Authentication
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Sign In to PhysioCare Portal
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto mt-1">
          Select your portal below. Patients enter directly, doctors require admin approval, and admins manage medical verifications.
        </p>
      </div>

      {/* 3 Main Role Selection Tabs */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 p-1.5 bg-slate-200/80 rounded-2xl mb-8">
        <button
          type="button"
          onClick={() => {
            setActiveRoleTab('patient');
            setDoctorAuthMessage(null);
          }}
          className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeRoleTab === 'patient'
              ? 'bg-white text-teal-800 shadow-md ring-2 ring-teal-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="text-center sm:text-left">
            <div>Patient / User</div>
            <div className="text-[10px] text-teal-700 hidden sm:block font-medium">Direct Access</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveRoleTab('doctor');
            setDoctorAuthMessage(null);
          }}
          className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeRoleTab === 'doctor'
              ? 'bg-white text-teal-800 shadow-md ring-2 ring-teal-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div className="text-center sm:text-left">
            <div>Physiotherapist</div>
            <div className="text-[10px] text-amber-700 hidden sm:block font-medium">Requires Approval</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveRoleTab('admin');
            setDoctorAuthMessage(null);
          }}
          className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeRoleTab === 'admin'
              ? 'bg-white text-indigo-800 shadow-md ring-2 ring-indigo-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-center sm:text-left">
            <div>Administrator</div>
            <div className="text-[10px] text-indigo-600 hidden sm:block font-medium">4 Admin Accounts</div>
          </div>
        </button>
      </div>

      {/* TAB 1: PATIENT / USER SIGN IN */}
      {activeRoleTab === 'patient' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1">
                <Check className="w-3.5 h-3.5" /> Instant Direct Access
              </div>
              <h2 className="text-xl font-bold text-slate-900">Patient & User Sign In</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Users can directly go inside the website. Enter your email to receive hydration & meal reminders.
              </p>
            </div>
            <div className="hidden sm:block text-right">
              <span className="text-[11px] font-semibold text-slate-400">No waiting list</span>
            </div>
          </div>

          {patientSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Signed in successfully! Redirecting you into the portal...</span>
            </div>
          )}

          <form onSubmit={handlePatientSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Gmail / Email *</span>
                  <span className="text-[10px] text-teal-700 lowercase font-normal">Reminders sent here</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+91 98400 12345"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Issue or Muscle Area
                </label>
                <input
                  type="text"
                  value={patientCondition}
                  onChange={(e) => setPatientCondition(e.target.value)}
                  placeholder="e.g. Knee stiffness, Lower Back Pain, Frozen Shoulder"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50/80 border border-teal-200 text-xs text-teal-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong>Automated Health Reminders:</strong> By signing in with your email (<code>{patientEmail}</code>), you will be able to receive automated reminders to drink water every hour and eat meals on time.
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-95 text-white font-extrabold text-sm shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Enter PhysioCare Website Directly</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: DOCTOR SIGN IN & APPROVAL CHECK */}
      {activeRoleTab === 'doctor' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold mb-1">
                <Lock className="w-3.5 h-3.5 text-amber-700" /> Admin Approval Required
              </div>
              <h2 className="text-xl font-bold text-slate-900">Physiotherapist Sign In</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                The doctor can go inside only if he gets approval from the admin. The admin will allow the doctor and then only they can go inside.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsDoctorRegistering(!isDoctorRegistering)}
              className="px-3 py-1.5 rounded-xl border border-teal-600 text-teal-700 hover:bg-teal-50 text-xs font-bold transition-all shrink-0"
            >
              {isDoctorRegistering ? 'Back to Doctor Sign In' : '+ Register New Doctor'}
            </button>
          </div>

          {/* Feedback or Auth Status Alert */}
          {doctorAuthMessage && (
            <div
              className={`p-4 rounded-xl border text-xs flex items-start gap-3 animate-fadeIn ${
                doctorAuthMessage.type === 'pending'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : doctorAuthMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              {doctorAuthMessage.type === 'pending' ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : doctorAuthMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <X className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold text-sm">{doctorAuthMessage.title}</div>
                <div className="leading-relaxed">{doctorAuthMessage.text}</div>
                {doctorAuthMessage.type === 'pending' && (
                  <div className="mt-2 pt-2 border-t border-amber-200 font-mono text-[11px]">
                    <strong>Authorized Admins to contact:</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-0.5">
                      {ADMIN_EMAILS.map((em) => (
                        <li key={em}>{em}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {!isDoctorRegistering ? (
            <form onSubmit={handleDoctorSubmit} className="space-y-6">
              {/* Doctor Selection from the 13 Doctors Provided */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Registered Doctor Profile (From Provided Data):
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50/50">
                  {doctorApplications.map((doc) => {
                    const isSelected = selectedDoctorEmail === doc.email;
                    const isApproved = doc.status === 'approved';

                    return (
                      <div
                        key={doc.email}
                        onClick={() => {
                          setSelectedDoctorEmail(doc.email);
                          setCustomDoctorEmail('');
                          setDoctorAuthMessage(null);
                        }}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 shadow-xs ring-1 ring-teal-500'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                              <span>{doc.name}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-teal-600" />}
                            </div>
                            <div className="text-[11px] text-slate-500">{doc.clinicName}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{doc.email}</div>
                          </div>
                          <div>
                            {isApproved ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                <Unlock className="w-2.5 h-2.5" /> Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                <Lock className="w-2.5 h-2.5" /> Pending Approval
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Or enter custom doctor email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Or Sign In with Doctor Gmail / Email Address:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={customDoctorEmail}
                    onChange={(e) => {
                      setCustomDoctorEmail(e.target.value);
                      setDoctorAuthMessage(null);
                    }}
                    placeholder="e.g. dr.sivabalan@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-95 text-white font-extrabold text-sm shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Sign In as Doctor</span>
                </button>
              </div>
            </form>
          ) : (
            /* New Doctor Registration Form */
            <form onSubmit={handleDoctorRegistrationSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <strong>Notice:</strong> Newly registered doctors cannot directly enter. Your application will be sent to the 4 administrators for verification.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Doctor Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Kumar"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Doctor Gmail / Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="doctor@gmail.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98400 12345"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Clinic / Hospital Name
                  </label>
                  <input
                    type="text"
                    value={regClinic}
                    onChange={(e) => setRegClinic(e.target.value)}
                    placeholder="e.g. Apollo Hospital, Chennai"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Speciality Focus
                  </label>
                  <input
                    type="text"
                    value={regSpeciality}
                    onChange={(e) => setRegSpeciality(e.target.value)}
                    placeholder="e.g. Musculoskeletal, Sports Rehab"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Qualification
                  </label>
                  <input
                    type="text"
                    value={regQual}
                    onChange={(e) => setRegQual(e.target.value)}
                    placeholder="e.g. MPT, BPT"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    value={regExp}
                    onChange={(e) => setRegExp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Consultation Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={regFee}
                    onChange={(e) => setRegFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                >
                  Submit Registration for Admin Approval
                </button>
                <button
                  type="button"
                  onClick={() => setIsDoctorRegistering(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 3: ADMINISTRATOR SIGN IN */}
      {activeRoleTab === 'admin' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" /> Platform Governance
              </div>
              <h2 className="text-xl font-bold text-slate-900">Administrator Sign In</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                The 4 designated administrator accounts have authority to review and approve incoming physiotherapists.
              </p>
            </div>
          </div>

          {adminError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{adminError}</span>
            </div>
          )}

          {/* 4 Designated Admin Quick-Login Cards */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select One of the 4 Authorized Administrator Accounts:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ADMIN_EMAILS.map((email, idx) => (
                <div
                  key={email}
                  onClick={() => handleAdminLogin(email)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/70 hover:bg-indigo-50/70 cursor-pointer transition-all flex items-center justify-between group shadow-2xs hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs group-hover:bg-indigo-200 group-hover:scale-105 transition-all">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold text-slate-900 group-hover:text-indigo-900">
                        {email}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        System Super Administrator
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[11px] font-bold group-hover:bg-indigo-700 transition-colors shadow-2xs">
                    Sign In →
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Or Type Admin Email */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Or Enter Authorized Admin Email Manually:
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={customAdminEmail}
                onChange={(e) => {
                  setCustomAdminEmail(e.target.value);
                  setAdminError('');
                }}
                placeholder="Enter one of the 4 admin emails..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleAdminLogin(customAdminEmail)}
                className="px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
