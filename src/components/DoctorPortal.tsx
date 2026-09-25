import React, { useState } from 'react';
import {
  Clock,
  ShieldAlert,
  CheckCircle,
  Users,
  Calendar,
  FileText,
  Activity,
  Plus,
  Sparkles,
  Stethoscope,
  Send,
} from 'lucide-react';
import { useAuth, ADMIN_EMAILS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const DoctorPortal: React.FC = () => {
  const { currentUser, doctorStatus } = useAuth();
  const { t } = useLanguage();

  const isApproved = doctorStatus === 'approved';

  // Demo patient rehabilitation records for approved doctor
  const [patients, setPatients] = useState([
    {
      id: 'p-1',
      name: 'Ramesh Sundaram (Age 54)',
      issue: 'Cervical Spondylosis & Trapezius Spasm',
      stage: 'Week 3 of 6 Rehabilitation',
      compliance: '88% Hydration & Exercise',
      lastVisit: '2 days ago',
      notes: 'Advised chin tucks, scapular retractions, and ergonomic chair adjustment.',
    },
    {
      id: 'p-2',
      name: 'Deepa Narayanan (Age 42)',
      issue: 'Right Knee ACL Post-Reconstruction',
      stage: 'Phase II Strength Building',
      compliance: '95% Adherence',
      lastVisit: 'Yesterday',
      notes: 'Progressed from isometric quad sets to closed kinetic chain mini-squats.',
    },
    {
      id: 'p-3',
      name: 'Ananya Sharma (Age 31)',
      issue: 'Postural Lumbar Strain (Desk Work)',
      stage: 'Initial Assessment Completed',
      compliance: '75% Hydration Logged',
      lastVisit: 'Today',
      notes: 'Pelvic tilts and hourly walking breaks prescribed.',
    },
  ]);

  const [newPlanText, setNewPlanText] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState('p-1');

  // If pending approval
  if (!isApproved) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white rounded-2xl p-8 border border-amber-200 shadow-md text-center space-y-5">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl mx-auto flex items-center justify-center border border-amber-200">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <div>
          <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-300">
            Account Status: Awaiting Admin Approval
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-3">
            Doctor Profile Verification in Progress
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-lg mx-auto">
            Welcome, <strong>{currentUser?.name}</strong>. In accordance with medical governance, doctor accounts can access clinic workspaces only after verification by an authorized administrator.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-2">
          <div className="font-bold text-slate-800">Reviewing Administrators:</div>
          <ul className="text-slate-600 space-y-1 font-mono text-[11px]">
            {ADMIN_EMAILS.map((email) => (
              <li key={email} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>{email}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-slate-500">
          Tip for testing: You can click the <strong>Admin Approval Panel</strong> in the top navigation or use the Persona Switcher to approve this doctor instantly.
        </p>
      </div>
    );
  }

  // Approved Doctor Workspace
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-teal-900 via-teal-800 to-cyan-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-200 rounded-full border border-emerald-400/30 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Verified Clinic Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dr. {currentUser?.name} Workspace
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 mt-1">
            {currentUser?.doctorDetails?.clinicName || 'Specialist Clinic'} • {currentUser?.doctorDetails?.speciality || 'Rehabilitation'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-xs border border-white/20 text-xs">
            <div className="text-teal-200 font-medium">Consultation Fee</div>
            <div className="text-lg font-black text-white">₹{currentUser?.doctorDetails?.fee || 800}</div>
          </div>
        </div>
      </div>

      {/* Patient Rehabilitation Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-teal-600 text-white rounded-lg">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Your Active Patients (3)</h2>
            </div>
          </div>

          <div className="space-y-2.5">
            {patients.map((pat) => (
              <div
                key={pat.id}
                onClick={() => setSelectedPatientId(pat.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedPatientId === pat.id
                    ? 'border-teal-500 bg-teal-50/60 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{pat.name}</h4>
                  <span className="text-[10px] font-semibold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-full">
                    {pat.compliance}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5">{pat.issue}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>{pat.stage}</span>
                  <span>{pat.lastVisit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Co-Created Rehabilitation Plan Editor */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 text-white rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  AI-Assisted Rehabilitation & Care Plan
                </h3>
                <p className="text-xs text-slate-500">
                  Translate clinical objectives into low-digital-literacy friendly instructions
                </p>
              </div>
            </div>
          </div>

          {/* Active Patient Details */}
          {(() => {
            const activePat = patients.find((p) => p.id === selectedPatientId) || patients[0];
            return (
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-800">{activePat.name}</div>
                  <div className="text-teal-800">
                    <span className="font-semibold">Condition:</span> {activePat.issue}
                  </div>
                  <div className="text-slate-600">
                    <span className="font-semibold">Current Clinical Notes:</span> {activePat.notes}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Update Rehabilitation Plan & Diet Advice
                  </label>
                  <textarea
                    rows={4}
                    value={newPlanText}
                    onChange={(e) => setNewPlanText(e.target.value)}
                    placeholder="E.g. Prescribe gentle cervical isometric neck holds, remind patient to drink 8 glasses of water daily, avoid sitting continuously past 45 minutes..."
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500">
                    Plan updates automatically sync with patient's portal and reminder emails.
                  </span>
                  <button
                    onClick={() => {
                      if (!newPlanText.trim()) return;
                      setPatients((prev) =>
                        prev.map((p) =>
                          p.id === selectedPatientId
                            ? { ...p, notes: newPlanText }
                            : p
                        )
                      );
                      setNewPlanText('');
                      alert('Rehabilitation prescription updated successfully!');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save & Notify Patient</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
