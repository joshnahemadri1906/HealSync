import React from 'react';
import {
  Activity,
  Droplet,
  Bot,
  Globe,
  Volume2,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface HeroSectionProps {
  onExploreDirectory: () => void;
  onExploreBodyGuide: () => void;
  onOpenAiBot: () => void;
  onOpenReminders: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreDirectory,
  onExploreBodyGuide,
  onOpenAiBot,
  onOpenReminders,
}) => {
  const { t, language } = useLanguage();
  const { currentUser, isAdmin } = useAuth();

  return (
    <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 mb-8">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 bg-cyan-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
            <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
            Specialist Physiotherapy & Rehabilitation
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Bot className="w-3.5 h-3.5 text-indigo-600" />
            AI Partner for Low-Digital-Literacy Patients
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Globe className="w-3.5 h-3.5 text-amber-600" />
            Tamil & Multi-Language Support
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {t('appTitle')}
        </h1>

        <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          {t('appSubtitle')}
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 pt-2">
          <div
            onClick={onExploreDirectory}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-teal-50/70 border border-slate-200/80 hover:border-teal-300 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold text-slate-900">Physiotherapists</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Contact info, fees & manual entry</p>
          </div>

          <div
            onClick={onExploreBodyGuide}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-teal-50/70 border border-slate-200/80 hover:border-teal-300 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold text-slate-900">8 Body Systems</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Zoom in, daily diets & exercises</p>
          </div>

          <div
            onClick={onOpenReminders}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-cyan-50/70 border border-slate-200/80 hover:border-cyan-300 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Droplet className="w-4 h-4 fill-cyan-200" />
            </div>
            <h2 className="text-xs font-bold text-slate-900">Water & Meal Alerts</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Reminders sent to your email</p>
          </div>

          <div
            onClick={onOpenAiBot}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-300 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Volume2 className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold text-slate-900">Voice Assistance</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Multiple voices & doubt solver</p>
          </div>
        </div>

        {/* CTA Button Group */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onExploreDirectory}
            className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/25 transition-all flex items-center gap-2"
          >
            <span>{t('bookAppointment')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreBodyGuide}
            className="px-5 py-3 rounded-xl border border-slate-200 hover:border-teal-400 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm transition-all"
          >
            {t('bodySystemsTitle')}
          </button>

          <button
            onClick={onOpenAiBot}
            className="px-5 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs sm:text-sm border border-indigo-200 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Consult AI Rehab Partner</span>
          </button>
        </div>
      </div>
    </div>
  );
};
