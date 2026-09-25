/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PhysiotherapistDirectory } from './components/PhysiotherapistDirectory';
import { BodySystemsGuide } from './components/BodySystemsGuide';
import { PatientReminders } from './components/PatientReminders';
import { AdminDashboard } from './components/AdminDashboard';
import { DoctorPortal } from './components/DoctorPortal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { LoginModal } from './components/LoginModal';
import { SignInPage } from './components/SignInPage';
import { INITIAL_PHYSIOTHERAPISTS } from './data/physiotherapists';
import { Physiotherapist, BodySystem } from './types';
import {
  Bot,
  Calendar,
  CheckCircle2,
  Mail,
  Phone,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';

function MainApp() {
  const { currentUser, isAdmin, isDoctor } = useAuth();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<string>('directory');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>();
  const [aiActiveContext, setAiActiveContext] = useState<any>();

  // Physiotherapists list initialized from seed and saved to localStorage
  const [doctors, setDoctors] = useState<Physiotherapist[]>(() => {
    try {
      const saved = localStorage.getItem('physiocare_doctors');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_PHYSIOTHERAPISTS;
  });

  useEffect(() => {
    localStorage.setItem('physiocare_doctors', JSON.stringify(doctors));
  }, [doctors]);

  // Appointment Booking Dialog State
  const [bookedDoctor, setBookedDoctor] = useState<Physiotherapist | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('2026-09-26');
  const [appointmentTime, setAppointmentTime] = useState('10:30 AM');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Handlers
  const handleAddDoctor = (newDoc: Physiotherapist) => {
    setDoctors((prev) => [newDoc, ...prev]);
    alert(`Dr. ${newDoc.name} successfully added to the physiotherapists directory!`);
  };

  const handleDeleteDoctor = (id: string) => {
    if (confirm('Are you sure you want to remove this physiotherapist from the directory?')) {
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleBookAppointment = (doc: Physiotherapist) => {
    setBookedDoctor(doc);
    setBookingConfirmed(false);
  };

  const confirmBooking = async () => {
    setBookingConfirmed(true);

    // Send confirmation email to user's email if available
    if (currentUser?.email && bookedDoctor) {
      try {
        await fetch('/api/reminders/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: currentUser.email,
            patientName: currentUser.name,
            reminderType: 'Appointment Booking',
            title: `Clinic Consultation Confirmed with ${bookedDoctor.name}`,
            message: `Dear ${currentUser.name},\n\nYour physiotherapy appointment is confirmed!\n\nDoctor: ${bookedDoctor.name}\nClinic: ${bookedDoctor.clinicName}, ${bookedDoctor.location}\nDate & Time: ${appointmentDate} at ${appointmentTime}\nConsultation Fee: ₹${bookedDoctor.fee} (Pay directly at clinic)\nDoctor Contact: ${bookedDoctor.phone} (${bookedDoctor.email})\n\nPlease arrive 10 minutes prior in comfortable clothing for physical evaluation.`,
          }),
        });
      } catch (e) {}
    }
  };

  const handleAskAiAboutSpecialist = (doc: Physiotherapist) => {
    setAiActiveContext({ doctorName: doc.name, speciality: doc.speciality, clinic: doc.clinicName });
    setAiInitialPrompt(
      `I am considering booking an appointment with ${doc.name} who specializes in ${doc.speciality}. Can you explain how physical therapy helps for these conditions and what exercises I might expect?`
    );
    setIsAiModalOpen(true);
  };

  const handleAskAiAboutSystem = (system: BodySystem) => {
    setAiActiveContext(system);
    setAiInitialPrompt(
      `Can you explain the daily diet and physical therapy exercises to keep the ${system.name} healthy, in simple terms for a patient?`
    );
    setIsAiModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={() => setActiveTab('signin')}
        onOpenAiBot={() => {
          setAiInitialPrompt(undefined);
          setAiActiveContext(undefined);
          setIsAiModalOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 0: Dedicated Sign In Page */}
        {activeTab === 'signin' && (
          <SignInPage
            onSuccessNavigate={(nextTab) => {
              setActiveTab(nextTab);
            }}
          />
        )}

        {/* Hero Banner on Directory or Body Guide */}
        {activeTab === 'directory' && (
          <HeroSection
            onExploreDirectory={() => setActiveTab('directory')}
            onExploreBodyGuide={() => setActiveTab('body_guide')}
            onOpenAiBot={() => {
              setAiInitialPrompt(undefined);
              setIsAiModalOpen(true);
            }}
            onOpenReminders={() => setActiveTab('reminders')}
          />
        )}

        {/* Tab 1: Physiotherapists Directory */}
        {activeTab === 'directory' && (
          <PhysiotherapistDirectory
            doctors={doctors}
            onAddDoctor={handleAddDoctor}
            onBookAppointment={handleBookAppointment}
            onAskAiAboutSpecialist={handleAskAiAboutSpecialist}
          />
        )}

        {/* Tab 2: 8 Human Body Systems Interactive Guide */}
        {activeTab === 'body_guide' && (
          <BodySystemsGuide onAskAiAboutSystem={handleAskAiAboutSystem} />
        )}

        {/* Tab 3: Water & Meal Health Reminders & Email Inbox */}
        {activeTab === 'reminders' && <PatientReminders />}

        {/* Tab 4: Doctor Clinic Portal */}
        {activeTab === 'doctor_portal' && <DoctorPortal />}

        {/* Tab 5: Admin Approval Panel */}
        {activeTab === 'admin_panel' && (
          <AdminDashboard doctors={doctors} onDeleteDoctor={handleDeleteDoctor} />
        )}
      </main>

      {/* Floating AI Rehabilitation Assistant Launcher */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-2">
        <button
          onClick={() => {
            setAiInitialPrompt(undefined);
            setAiActiveContext(undefined);
            setIsAiModalOpen(true);
          }}
          className="flex items-center gap-2.5 px-4 py-3 bg-linear-to-r from-teal-700 to-cyan-700 hover:from-teal-800 hover:to-cyan-800 text-white font-bold rounded-2xl shadow-xl shadow-teal-900/25 active:scale-95 transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-teal-200 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold leading-tight">Physio AI Partner</div>
            <div className="text-[10px] text-teal-200">Clear doubts in your language</div>
          </div>
          <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
        </button>
      </div>

      {/* Appointment Booking Modal */}
      {bookedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {bookingConfirmed ? 'Appointment Confirmed!' : 'Book Clinic Visit'}
                </h3>
              </div>
              <button
                onClick={() => setBookedDoctor(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!bookingConfirmed ? (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                  <img
                    src={bookedDoctor.photoUrl}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{bookedDoctor.name}</h4>
                    <p className="text-slate-500">{bookedDoctor.clinicName}</p>
                    <p className="font-semibold text-teal-800">
                      ₹{bookedDoctor.fee} Consultation fee at clinic
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Time Slot
                    </label>
                    <select
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="09:30 AM">09:30 AM</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:30 PM">05:30 PM</option>
                      <option value="07:00 PM">07:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl space-y-1">
                  <div className="font-bold text-teal-900">Direct Contact Information:</div>
                  <div className="flex items-center gap-1.5 text-teal-950 font-medium">
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <span>{bookedDoctor.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-teal-950 font-medium">
                    <Mail className="w-3.5 h-3.5 text-teal-600" />
                    <span>{bookedDoctor.email}</span>
                  </div>
                </div>

                <button
                  onClick={confirmBooking}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-600/20 active:scale-95 transition-all text-xs"
                >
                  Confirm Free Clinic Booking
                </button>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Your visit with {bookedDoctor.name} has been scheduled!
                </h4>
                <p className="text-xs text-slate-600">
                  A confirmation summary has been dispatched to{' '}
                  <strong>{currentUser?.email || 'your email'}</strong>. Please pay ₹{bookedDoctor.fee} at the clinic desk.
                </p>
                <button
                  onClick={() => setBookedDoctor(null)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        initialPrompt={aiInitialPrompt}
        activeContext={aiActiveContext}
      />

      {/* Dual Login & Admin Verification Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="font-semibold text-slate-700">
            PhysioCare AI Rehabilitation Portal • Co-Created for All Digital Literacy Levels
          </div>
          <p className="text-[11px] text-slate-400">
            Authorized Platform Administrators: lakshanakvs08@gmail.com • joshnahemadri1906@gmail.com • jebagracy123@gmail.com • jebajbin123@gmail.com
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
