import React, { useState } from 'react';
import {
  X,
  User,
  Stethoscope,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Building,
  Phone,
  Mail,
  Award,
  IndianRupee,
} from 'lucide-react';
import { useAuth, ADMIN_EMAILS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'patient' | 'doctor' | 'admin';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'patient',
}) => {
  const { loginAsPatient, loginAsDoctor, registerDoctor } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'patient' | 'doctor' | 'admin'>(defaultTab);

  // Patient Form
  const [patientName, setPatientName] = useState('Ananya Sharma');
  const [patientEmail, setPatientEmail] = useState('joshnahemadri1906@gmail.com');
  const [patientCondition, setPatientCondition] = useState('Lower Back & Knee Stiffness');

  // Doctor Form
  const [isDoctorRegister, setIsDoctorRegister] = useState(false);
  const [doctorEmail, setDoctorEmail] = useState('dr.sivabalan@gmail.com');
  const [docName, setDocName] = useState('Dr. S Sivabalan');
  const [docPhone, setDocPhone] = useState('+91 98401 23456');
  const [docClinic, setDocClinic] = useState('BEE Health Studio');
  const [docSpeciality, setDocSpeciality] = useState('Musculoskeletal Rehabilitation & Sports Injuries');
  const [docQual, setDocQual] = useState('Senior Consultant Physiotherapist');
  const [docExp, setDocExp] = useState(17);
  const [docFee, setDocFee] = useState(800);
  const [docError, setDocError] = useState('');
  const [docSuccessNotice, setDocSuccessNotice] = useState('');

  if (!isOpen) return null;

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsPatient(patientName, patientEmail, patientCondition);
    onClose();
  };

  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDocError('');
    setDocSuccessNotice('');

    if (isDoctorRegister) {
      if (!docName || !doctorEmail) {
        setDocError('Please fill out doctor name and email.');
        return;
      }
      const res = registerDoctor({
        name: docName.startsWith('Dr.') ? docName : `Dr. ${docName}`,
        email: doctorEmail,
        phone: docPhone,
        clinicName: docClinic,
        speciality: docSpeciality,
        qualification: docQual,
        experience: Number(docExp) || 5,
        fee: Number(docFee) || 500,
      });

      if (res.status === 'pending') {
        setDocSuccessNotice(
          'Registration submitted successfully! Your account is currently Pending Admin Approval. An admin will review and verify your profile.'
        );
        setTimeout(() => onClose(), 2200);
      } else {
        onClose();
      }
    } else {
      const res = loginAsDoctor(doctorEmail);
      if (!res.success) {
        setDocError(res.message || 'Doctor account not found.');
      } else {
        onClose();
      }
    }
  };

  const handleAdminQuickLogin = (email: string) => {
    loginAsPatient('Administrator', email);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Sign In to PhysioCare</h3>
            <p className="text-xs text-slate-500">
              Dedicated portals for Patients, Doctors, and Medical Administrators
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-3 p-2 bg-slate-100 border-b border-slate-200 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('patient')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'patient'
                ? 'bg-white text-teal-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Patient</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('doctor')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'doctor'
                ? 'bg-white text-teal-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'admin'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Tab 1: Patient Login */}
        {activeTab === 'patient' && (
          <form onSubmit={handlePatientSubmit} className="p-6 space-y-4">
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800">
              Patients can directly enter the portal without waiting for approval. Reminders will be sent to the email provided.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-teal-600" /> Gmail / Email (for water & meal reminders)
              </label>
              <input
                type="email"
                required
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current Health Issue / Area of Pain
              </label>
              <input
                type="text"
                value={patientCondition}
                onChange={(e) => setPatientCondition(e.target.value)}
                placeholder="e.g. Chronic Sciatica, Neck stiffness, Post-Knee rehab"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all mt-2"
            >
              Enter PhysioCare as Patient
            </button>
          </form>
        )}

        {/* Tab 2: Doctor Login / Registration */}
        {activeTab === 'doctor' && (
          <form onSubmit={handleDoctorSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Medical Governance:</strong> Doctors can access clinic workspaces only after approval from an administrator.
              </div>
            </div>

            {docError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {docError}
              </div>
            )}

            {docSuccessNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
                {docSuccessNotice}
              </div>
            )}

            <div className="flex items-center justify-between text-xs pb-1">
              <span className="font-semibold text-slate-700">
                {isDoctorRegister ? 'New Doctor Registration' : 'Existing Doctor Login'}
              </span>
              <button
                type="button"
                onClick={() => setIsDoctorRegister(!isDoctorRegister)}
                className="text-teal-700 font-bold hover:underline"
              >
                {isDoctorRegister ? 'Switch to Login' : 'Register New Doctor'}
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-teal-600" /> Doctor Gmail / Email Address *
              </label>
              <input
                type="email"
                required
                value={doctorEmail}
                onChange={(e) => setDoctorEmail(e.target.value)}
                placeholder="dr.name@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {isDoctorRegister && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Doctor Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-teal-600" /> Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={docPhone}
                      onChange={(e) => setDocPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Building className="w-3 h-3 text-teal-600" /> Clinic / Hospital Name
                  </label>
                  <input
                    type="text"
                    value={docClinic}
                    onChange={(e) => setDocClinic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Speciality
                    </label>
                    <input
                      type="text"
                      value={docSpeciality}
                      onChange={(e) => setDocSpeciality(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Qualification
                    </label>
                    <input
                      type="text"
                      value={docQual}
                      onChange={(e) => setDocQual(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Award className="w-3 h-3 text-teal-600" /> Experience (Yrs)
                    </label>
                    <input
                      type="number"
                      value={docExp}
                      onChange={(e) => setDocExp(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <IndianRupee className="w-3 h-3 text-teal-600" /> Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={docFee}
                      onChange={(e) => setDocFee(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all mt-2"
            >
              {isDoctorRegister ? 'Submit Registration for Admin Approval' : 'Sign In as Doctor'}
            </button>
          </form>
        )}

        {/* Tab 3: Admin Quick Login for 4 Admin Emails */}
        {activeTab === 'admin' && (
          <div className="p-6 space-y-4">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900">
              <p className="font-bold mb-1">Authorized Administrator Accounts:</p>
              <p className="text-[11px] leading-relaxed text-indigo-800">
                Click any of the 4 designated admin emails below to immediately sign in as platform administrator and manage doctor approvals:
              </p>
            </div>

            <div className="space-y-2">
              {ADMIN_EMAILS.map((email) => (
                <button
                  key={email}
                  type="button"
                  onClick={() => handleAdminQuickLogin(email)}
                  className="w-full p-3 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50 text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-xs font-bold text-slate-800 group-hover:text-indigo-900">
                      {email}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-full">
                    Login Admin
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
