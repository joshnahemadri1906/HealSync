import React, { useState, useEffect } from 'react';
import {
  Droplet,
  Utensils,
  Clock,
  Mail,
  Send,
  Bell,
  BellRing,
  CheckCircle,
  Plus,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Inbox,
  Volume2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { voiceService } from '../services/voiceService';
import { DispatchedEmail, HealthReminder } from '../types';

export const PatientReminders: React.FC = () => {
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();

  const [patientCondition, setPatientCondition] = useState(
    currentUser?.condition || 'Lower Back Stiffness & Joint Mobility'
  );
  const [waterGlasses, setWaterGlasses] = useState<number>(4);
  const [waterGoal] = useState<number>(8); // 8 glasses = 2000ml
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [inboxEmails, setInboxEmails] = useState<DispatchedEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<DispatchedEmail | null>(null);

  // Active reminders
  const [reminders, setReminders] = useState<HealthReminder[]>([
    {
      id: 'rem-1',
      patientEmail: currentUser?.email || 'patient@gmail.com',
      type: 'water',
      title: 'Hydration Alert: Articular Cartilage Protection',
      time: 'Every 1 Hour (Next at 11:30 AM)',
      notes: 'Drink 250ml water to keep synovial joint fluid lubricated.',
      isActive: true,
      frequency: 'Hourly',
    },
    {
      id: 'rem-2',
      patientEmail: currentUser?.email || 'patient@gmail.com',
      type: 'breakfast',
      title: 'Timely Breakfast: High Protein & Calcium',
      time: '08:30 AM',
      notes: 'Boiled eggs, ragi porridge or paneer to accelerate muscle protein synthesis.',
      isActive: true,
      frequency: 'Daily',
    },
    {
      id: 'rem-3',
      patientEmail: currentUser?.email || 'patient@gmail.com',
      type: 'lunch',
      title: 'Timely Lunch: Anti-Inflammatory Meal',
      time: '01:00 PM',
      notes: 'Lentils, dark greens, and turmeric infused warm meal without excessive salt.',
      isActive: true,
      frequency: 'Daily',
    },
    {
      id: 'rem-4',
      patientEmail: currentUser?.email || 'patient@gmail.com',
      type: 'exercise',
      title: 'Physical Therapy Mobility Session',
      time: '05:30 PM',
      notes: 'Complete your prescribed cat-cow stretches and isometric quad sets.',
      isActive: true,
      frequency: 'Daily',
    },
    {
      id: 'rem-5',
      patientEmail: currentUser?.email || 'patient@gmail.com',
      type: 'dinner',
      title: 'Timely Light Dinner: Easy Digestion',
      time: '08:00 PM',
      notes: 'Warm vegetable soup and light grain 2 hours before sleep to aid tissue recovery.',
      isActive: true,
      frequency: 'Daily',
    },
  ]);

  const recipientEmail = currentUser?.email || 'joshnahemadri1906@gmail.com';

  // Fetch dispatched emails from server
  const fetchInbox = async () => {
    try {
      const res = await fetch(`/api/reminders/inbox?email=${encodeURIComponent(recipientEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setInboxEmails(data.emails || []);
      }
    } catch (e) {
      console.warn('Could not fetch inbox from server:', e);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, [recipientEmail]);

  // Handle logging a glass of water
  const handleLogWater = () => {
    const nextVal = Math.min(waterGlasses + 1, 12);
    setWaterGlasses(nextVal);
    voiceService.playReminderChime();

    // Voice announcement
    if (language === 'ta') {
      voiceService.speak(
        `ஒரு டம்ளர் தண்ணீர் குடிக்கப்பட்டது. உங்கள் இலக்கில் ${nextVal} டம்ளர்கள் முடிந்தது.`,
        'dr_priya',
        'ta'
      );
    } else {
      voiceService.speak(
        `Great job! Glass of water logged. You have reached ${nextVal} of ${waterGoal} glasses today.`,
        'dr_priya',
        'en'
      );
    }
  };

  // Dispatch reminder email
  const handleSendReminderEmail = async (type: 'water' | 'meal' | 'all') => {
    setIsSendingEmail(true);
    setEmailStatus(null);
    voiceService.playReminderChime();

    let title = '';
    let message = '';

    if (type === 'water') {
      title = 'Hydration Alert: Time to drink water!';
      message = `Dear ${currentUser?.name || 'Patient'},\n\nThis is your scheduled PhysioCare hydration reminder.\n\nYour current therapy condition: "${patientCondition}".\nArticular cartilage in your joints is 80% water. Please pause, take a deep breath, and drink a full glass of water (250ml) right now to ensure optimal fluid exchange and prevent muscle cramps.\n\nToday's progress: ${waterGlasses}/${waterGoal} glasses.\n\nStay active and hydrated!\n- PhysioCare Rehabilitation Team`;
    } else if (type === 'meal') {
      title = 'Timely Nourishment Reminder: Eat on Schedule';
      message = `Dear ${currentUser?.name || 'Patient'},\n\nMaintaining consistent meal timings prevents metabolic stress and supports muscle tissue remodeling.\n\nPrescription for "${patientCondition}":\n- Consume clean protein (dal, paneer, eggs, lean fish)\n- Include leafy greens & calcium\n- Avoid inflammatory excess sugars and deep-fried snacks\n\nPlease have your meal peacefully and stay relaxed.\n\n- PhysioCare Medical Team`;
    } else {
      title = 'Complete Daily Care Reminder: Hydration & Timely Meals';
      message = `Dear ${currentUser?.name || 'Patient'},\n\nHere is your coordinated health reminder for "${patientCondition}":\n1. Drink water regularly (Aim for 8 glasses daily).\n2. Eat meals at scheduled times (Breakfast 8:30 AM, Lunch 1:00 PM, Dinner 8:00 PM).\n3. Complete your gentle prescribed mobility exercises.\n\nSent to your registered email: ${recipientEmail}`;
    }

    try {
      const response = await fetch('/api/reminders/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipientEmail,
          patientName: currentUser?.name || 'Valued Patient',
          reminderType: type === 'water' ? 'Hydration' : 'Nutritional Timing',
          title,
          message,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setEmailStatus(`Reminder email successfully delivered to ${recipientEmail}!`);
        await fetchInbox();
      } else {
        setEmailStatus(data.error || 'Failed to dispatch email');
      }
    } catch (err: any) {
      setEmailStatus('Dispatched reminder alert locally.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-cyan-900 via-teal-800 to-emerald-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-white/20 text-cyan-100 rounded-full border border-white/20">
              Personalized Patient Care
            </span>
            <span className="text-xs text-cyan-200">Email Notification Automation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('reminderSectionTitle')}
          </h1>
          <p className="text-sm text-cyan-100/90 mt-1 leading-relaxed">
            {t('reminderSectionDesc')}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="px-3 py-1.5 bg-black/30 backdrop-blur-xs rounded-xl border border-white/20 text-xs flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-300" />
              <span>
                Registered Email: <strong className="text-white underline">{recipientEmail}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Condition / Issue Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Your Current Physiotherapy Issue / Condition</h3>
              <p className="text-xs text-slate-500">
                Reminders are customized to accelerate recovery for this issue
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={patientCondition}
              onChange={(e) => setPatientCondition(e.target.value)}
              placeholder="e.g. Lower Back Pain, Knee Arthritis..."
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 w-full sm:w-72 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Grid: Water Tracker & Timely Meals Dispatcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Water Hydration Tracker */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-cyan-600 text-white rounded-xl shadow-xs">
                <Droplet className="w-5 h-5 fill-cyan-300" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Drink Water Tracker</h3>
                <p className="text-xs text-slate-500">Essential for cartilage lubrication & muscle recovery</p>
              </div>
            </div>

            <button
              onClick={() => handleSendReminderEmail('water')}
              disabled={isSendingEmail}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-semibold border border-cyan-200 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Water Email Alert</span>
            </button>
          </div>

          {/* Water Visual Bar and Progress */}
          <div className="bg-radial from-cyan-50 to-slate-50 p-5 rounded-2xl border border-cyan-100/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700">Today's Hydration Target</span>
              <span className="font-black text-cyan-800 text-sm">
                {waterGlasses} / {waterGoal} Glasses ({waterGlasses * 250} ml / 2000 ml)
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-cyan-500 to-teal-500 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min((waterGlasses / waterGoal) * 100, 100)}%` }}
              />
            </div>

            {/* Glass Visual Indicators */}
            <div className="grid grid-cols-8 gap-2 mt-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-12 rounded-xl flex items-center justify-center transition-all border ${
                    i < waterGlasses
                      ? 'bg-cyan-500 text-white border-cyan-600 shadow-xs scale-105'
                      : 'bg-white text-slate-300 border-slate-200'
                  }`}
                >
                  <Droplet className={`w-4 h-4 ${i < waterGlasses ? 'fill-white' : ''}`} />
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-[11px] text-slate-500">
                Target: Drink 1 glass (250ml) every 1–2 hours during daytime.
              </p>
              <button
                onClick={handleLogWater}
                className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-600/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+1 Glass Drank</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-600 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2">
            <Clock className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
            <p>
              <strong>Automated Interval:</strong> Every hour between 8:00 AM and 9:00 PM. A notification chime sounds on this device, and reminder digests are dispatched to{' '}
              <span className="text-cyan-800 font-semibold">{recipientEmail}</span>.
            </p>
          </div>
        </div>

        {/* Right Column: Timely Meals & Nutrition Reminders */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Eat at Right Time Schedule</h3>
                <p className="text-xs text-slate-500">Scheduled nutritional intake to power tissue remodeling</p>
              </div>
            </div>

            <button
              onClick={() => handleSendReminderEmail('meal')}
              disabled={isSendingEmail}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Meal Email Alert</span>
            </button>
          </div>

          {/* Meal Timetable */}
          <div className="space-y-2.5">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-base">🍳</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Morning Breakfast (08:30 AM)</h4>
                  <p className="text-[11px] text-slate-500">High protein, calcium & Vitamin D</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                Scheduled
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-base">🥗</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Nourishing Lunch (01:00 PM)</h4>
                  <p className="text-[11px] text-slate-500">Antioxidant leafy greens, lentils & turmeric</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                Scheduled
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-base">🍎</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Post-Therapy Snack (04:30 PM)</h4>
                  <p className="text-[11px] text-slate-500">Walnuts, seeds, fruits & electrolytes</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                Scheduled
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-base">🍲</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Restorative Dinner (08:00 PM)</h4>
                  <p className="text-[11px] text-slate-500">Light warm broth & vegetables 2 hrs before bed</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                Scheduled
              </span>
            </div>
          </div>

          {/* Quick One-Click Dispatch All Button */}
          <button
            onClick={() => handleSendReminderEmail('all')}
            disabled={isSendingEmail}
            className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{isSendingEmail ? 'Dispatching...' : `Dispatch Both Reminders to ${recipientEmail}`}</span>
          </button>
        </div>
      </div>

      {/* Email Status Toast */}
      {emailStatus && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{emailStatus}</span>
          </div>
          <button
            onClick={() => setEmailStatus(null)}
            className="text-xs text-emerald-600 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Dispatched Emails Inbox Viewer (Proof of Delivery to recipient's email) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-600 text-white rounded-xl shadow-xs">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{t('inboxTitle')}</h3>
              <p className="text-xs text-slate-500">
                {t('inboxDesc')} <strong className="text-slate-800">{recipientEmail}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={fetchInbox}
            className="p-2 text-slate-500 hover:text-teal-700 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors text-xs flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Inbox</span>
          </button>
        </div>

        {inboxEmails.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl">
            <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">
              No emails sent yet in this session. Click any "Send Email Alert" button above to test!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inboxEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className="p-4 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50/70 hover:bg-white cursor-pointer transition-all space-y-2 group shadow-2xs"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-teal-800 bg-teal-100/60 px-2 py-0.5 rounded-full">
                    {email.type}
                  </span>
                  <span className="text-slate-500 font-mono">
                    {new Date(email.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 truncate">
                  {email.subject}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {email.body}
                </p>
                <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Delivered to {email.to}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Email Preview Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-600 text-white rounded-lg">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Email Delivery Preview</h3>
                  <p className="text-[11px] text-slate-500">Simulated Gmail Inbox</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmail(null)}
                className="text-xs text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400">To:</span>{' '}
                <strong className="text-slate-800">{selectedEmail.to}</strong>
              </div>
              <div>
                <span className="text-slate-400">From:</span> alerts@physiocare-rehab.com (PhysioCare Health Reminder)
              </div>
              <div>
                <span className="text-slate-400">Subject:</span>{' '}
                <strong className="text-slate-900">{selectedEmail.subject}</strong>
              </div>
              <div>
                <span className="text-slate-400">Time:</span>{' '}
                <span className="text-slate-600">{new Date(selectedEmail.sentAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto font-sans">
              {selectedEmail.body}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedEmail(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl"
              >
                Close Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
