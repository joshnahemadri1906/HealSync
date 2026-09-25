import React, { useState } from 'react';
import {
  Activity,
  Globe,
  Volume2,
  VolumeX,
  User,
  ShieldCheck,
  Stethoscope,
  ChevronDown,
  Sparkles,
  Bot,
  Droplet,
  LogOut,
  LogIn,
  Layers,
  Settings,
} from 'lucide-react';
import { useAuth, ADMIN_EMAILS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES } from '../data/translations';
import { voiceService, VOICE_PERSONAS } from '../services/voiceService';
import { SupportedLanguage } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLogin: () => void;
  onOpenAiBot: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenLogin,
  onOpenAiBot,
}) => {
  const { currentUser, isAdmin, isDoctor, doctorStatus, logout, quickSwitchRole } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isVoiceMenuOpen, setIsVoiceMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [selectedPersona, setSelectedPersona] = useState('dr_priya');

  // Monitor speaking status
  React.useEffect(() => {
    return voiceService.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
  }, []);

  const handleToggleVoice = () => {
    if (isSpeaking) {
      voiceService.stop();
    } else {
      const sampleText =
        language === 'ta'
          ? 'வணக்கம்! பிசியோகேர் குரல் உதவி தயார். உங்கள் நலம் எங்கள் நோக்கம்.'
          : 'Welcome to PhysioCare Rehabilitation Portal. Voice assistance is active.';
      voiceService.speak(sampleText, selectedPersona, language, voiceSpeed);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Title */}
          <div
            onClick={() => setActiveTab('directory')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-teal-700 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-teal-700/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                  PhysioCare
                </span>
                <span className="px-1.5 py-0.2 bg-teal-100 text-teal-800 text-[10px] font-black rounded-md uppercase">
                  AI Rehab
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Physiotherapy • Anatomy • Smart Reminders
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3 py-2 rounded-xl transition-all ${
                activeTab === 'directory'
                  ? 'bg-teal-50 text-teal-800 shadow-2xs font-extrabold'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {t('navDirectory')}
            </button>

            <button
              onClick={() => setActiveTab('body_guide')}
              className={`px-3 py-2 rounded-xl transition-all ${
                activeTab === 'body_guide'
                  ? 'bg-teal-50 text-teal-800 shadow-2xs font-extrabold'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {t('navBodyGuide')}
            </button>

            <button
              onClick={() => setActiveTab('reminders')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'reminders'
                  ? 'bg-cyan-50 text-cyan-800 shadow-2xs font-extrabold'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Droplet className="w-3.5 h-3.5 text-cyan-600" />
              <span>{t('navReminders')}</span>
            </button>

            <button
              onClick={onOpenAiBot}
              className="px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all flex items-center gap-1.5 font-bold"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t('navAiAssistant')}</span>
            </button>

            {/* Doctor Workspace link */}
            {(isDoctor || isAdmin) && (
              <button
                onClick={() => setActiveTab('doctor_portal')}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'doctor_portal'
                    ? 'bg-teal-50 text-teal-800 shadow-2xs font-extrabold'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                <span>{t('navDoctorPortal')}</span>
                {doctorStatus === 'pending' && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                )}
              </button>
            )}

            {/* Admin link */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin_panel')}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'admin_panel'
                    ? 'bg-indigo-900 text-white font-extrabold shadow-sm'
                    : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('navAdmin')}</span>
              </button>
            )}

            {/* Sign In / Switch Role Tab */}
            <button
              onClick={() => setActiveTab('signin')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'signin'
                  ? 'bg-teal-700 text-white font-extrabold shadow-sm'
                  : 'hover:bg-slate-100 hover:text-slate-900 text-slate-700 font-bold'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-teal-600" />
              <span>Sign In</span>
            </button>
          </nav>

          {/* Right Controls: Language, Voice Assistant & User Account */}
          <div className="flex items-center gap-2">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsLangDropdownOpen(!isLangDropdownOpen);
                  setIsVoiceMenuOpen(false);
                  setIsUserMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
                title="Select language assistance"
              >
                <Globe className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden sm:inline">
                  {LANGUAGES.find((l) => l.code === language)?.nativeLabel || 'Language'}
                </span>
                <span className="sm:hidden uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs font-semibold">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Select Language
                  </div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-teal-50 flex items-center justify-between transition-colors ${
                        language === lang.code ? 'text-teal-700 bg-teal-50/60 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <span>{lang.nativeLabel}</span>
                      <span className="text-[10px] text-slate-400 uppercase">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Voice Assistant Toggle & Config Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsVoiceMenuOpen(!isVoiceMenuOpen);
                  setIsLangDropdownOpen(false);
                  setIsUserMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  isSpeaking
                    ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-400'
                }`}
                title="Voice Assistance Settings"
              >
                {isSpeaking ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                )}
                <span className="hidden md:inline">Voice</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isVoiceMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900">{t('voiceAssistantTitle')}</span>
                    <button
                      onClick={handleToggleVoice}
                      className="px-2 py-0.5 rounded-md bg-teal-600 text-white text-[11px] font-bold"
                    >
                      {isSpeaking ? 'Stop' : 'Test Voice'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {t('selectVoicePersona')}
                    </label>
                    <select
                      value={selectedPersona}
                      onChange={(e) => setSelectedPersona(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-slate-50"
                    >
                      {VOICE_PERSONAS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>{t('speechSpeed')}</span>
                      <span>{voiceSpeed}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.7"
                      max="1.3"
                      step="0.1"
                      value={voiceSpeed}
                      onChange={(e) => setVoiceSpeed(Number(e.target.value))}
                      className="w-full accent-teal-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                      <span>0.7x (Slow/Gentle)</span>
                      <span>1.0x</span>
                      <span>1.3x (Fast)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Account / Role Pill */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsLangDropdownOpen(false);
                  setIsVoiceMenuOpen(false);
                }}
                className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50 text-xs font-bold text-slate-800 transition-colors"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs ${
                    isAdmin ? 'bg-indigo-600' : isDoctor ? 'bg-teal-600' : 'bg-cyan-600'
                  }`}
                >
                  {isAdmin ? (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  ) : isDoctor ? (
                    <Stethoscope className="w-3.5 h-3.5" />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="hidden sm:block text-left">
                  <div className="truncate max-w-[120px] font-bold leading-tight">
                    {currentUser ? currentUser.name : 'Sign In'}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    {isAdmin
                      ? 'Admin'
                      : isDoctor
                      ? doctorStatus === 'approved'
                        ? 'Doctor'
                        : 'Doctor (Pending)'
                      : 'Patient'}
                  </div>
                </div>

                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2.5 z-50 text-xs space-y-2">
                  {currentUser ? (
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="font-bold text-slate-900">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</div>
                      <div className="mt-1 flex items-center gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-md">
                          Role: {currentUser.role}
                        </span>
                        {isDoctor && (
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                              doctorStatus === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {doctorStatus}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        onOpenLogin();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full py-2 bg-teal-600 text-white rounded-lg font-bold text-center flex items-center justify-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>{t('navLogin')}</span>
                    </button>
                  )}

                  {/* Demo Persona Quick Switcher for Easy Demonstration */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">
                      Quick Persona Switcher (For Testing)
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      <button
                        onClick={() => {
                          quickSwitchRole('patient');
                          setIsUserMenuOpen(false);
                        }}
                        className="p-1.5 rounded-md hover:bg-teal-50 text-slate-700 text-left font-semibold"
                      >
                        👤 Patient
                      </button>
                      <button
                        onClick={() => {
                          quickSwitchRole('pending_doctor');
                          setIsUserMenuOpen(false);
                        }}
                        className="p-1.5 rounded-md hover:bg-amber-50 text-slate-700 text-left font-semibold"
                      >
                        ⏳ Doctor (Pending)
                      </button>
                      <button
                        onClick={() => {
                          quickSwitchRole('approved_doctor');
                          setIsUserMenuOpen(false);
                        }}
                        className="p-1.5 rounded-md hover:bg-emerald-50 text-slate-700 text-left font-semibold"
                      >
                        🩺 Doctor (Approved)
                      </button>
                      <button
                        onClick={() => {
                          quickSwitchRole('admin');
                          setIsUserMenuOpen(false);
                        }}
                        className="p-1.5 rounded-md hover:bg-indigo-50 text-slate-700 text-left font-semibold"
                      >
                        🛡️ Admin (Joshna)
                      </button>
                    </div>
                  </div>

                  {currentUser && (
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full mt-1 p-2 rounded-lg hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-transparent hover:border-rose-200"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('navLogout')}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-100 text-xs font-semibold text-slate-600 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${
              activeTab === 'directory' ? 'bg-teal-50 text-teal-800 font-bold' : ''
            }`}
          >
            {t('navDirectory')}
          </button>
          <button
            onClick={() => setActiveTab('body_guide')}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${
              activeTab === 'body_guide' ? 'bg-teal-50 text-teal-800 font-bold' : ''
            }`}
          >
            {t('navBodyGuide')}
          </button>
          <button
            onClick={() => setActiveTab('reminders')}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${
              activeTab === 'reminders' ? 'bg-cyan-50 text-cyan-800 font-bold' : ''
            }`}
          >
            {t('navReminders')}
          </button>
          <button
            onClick={onOpenAiBot}
            className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold shrink-0"
          >
            AI Bot
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin_panel')}
              className={`px-3 py-1.5 rounded-lg shrink-0 ${
                activeTab === 'admin_panel' ? 'bg-indigo-900 text-white font-bold' : 'text-indigo-800'
              }`}
            >
              Admin
            </button>
          )}
          <button
            onClick={() => setActiveTab('signin')}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${
              activeTab === 'signin' ? 'bg-teal-700 text-white font-bold' : 'text-teal-800 font-bold'
            }`}
          >
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
};
