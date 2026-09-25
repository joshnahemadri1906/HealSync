import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Brain,
  Bone,
  Wind,
  Compass,
  Shield,
  Droplet,
  ShieldAlert,
  Volume2,
  VolumeX,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Info,
  CheckCircle2,
  AlertTriangle,
  Utensils,
  Dumbbell,
} from 'lucide-react';
import { BODY_SYSTEMS } from '../data/bodySystems';
import { BodySystem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { voiceService } from '../services/voiceService';

interface BodySystemsGuideProps {
  onAskAiAboutSystem: (system: BodySystem) => void;
}

// System photographic reference cards
const SYSTEM_IMAGES: Record<string, string> = {
  musculoskeletal: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80',
  nervous: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&auto=format&fit=crop&q=80',
  cardiovascular: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&auto=format&fit=crop&q=80',
  respiratory: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
  vestibular: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
  integumentary: 'https://images.unsplash.com/photo-1512290900672-1f55b9a8f4c2?w=800&auto=format&fit=crop&q=80',
  lymphatic: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
  reproductive_pelvic: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&auto=format&fit=crop&q=80',
};

export const BodySystemsGuide: React.FC<BodySystemsGuideProps> = ({ onAskAiAboutSystem }) => {
  const { t, language } = useLanguage();
  const [selectedSystemId, setSelectedSystemId] = useState<string>('musculoskeletal');
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const currentSystem = BODY_SYSTEMS.find((s) => s.id === selectedSystemId) || BODY_SYSTEMS[0];

  const getSystemIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bone':
        return <Bone className="w-5 h-5" />;
      case 'Brain':
        return <Brain className="w-5 h-5" />;
      case 'Heart':
        return <Heart className="w-5 h-5" />;
      case 'Wind':
        return <Wind className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'Shield':
        return <Shield className="w-5 h-5" />;
      case 'Droplet':
        return <Droplet className="w-5 h-5" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getLocalizedName = (system: BodySystem) => {
    if (language === 'ta') return system.tamilName;
    if (language === 'hi') return system.hindiName;
    if (language === 'te') return system.teluguName;
    return system.name;
  };

  const handleSpeakSystem = () => {
    if (isSpeaking) {
      voiceService.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    let speech = '';

    if (language === 'ta') {
      speech = `${currentSystem.tamilName}. பிசியோதெரபியில் முக்கியத்துவம்: ${currentSystem.whyItMatters}. தினசரி உணவு ஆலோசனை: ${currentSystem.dietRecommendations.dailyHydrationTip}. பரிந்துரைக்கப்பட்ட உடற்பயிற்சி: ${currentSystem.rehabilitationExercises[0]?.name}.`;
    } else if (language === 'hi') {
      speech = `${currentSystem.hindiName}. फिजियोथेरेपी में महत्व: ${currentSystem.whyItMatters}. दैनिक आहार सलाह: ${currentSystem.dietRecommendations.dailyHydrationTip}. व्यायाम: ${currentSystem.rehabilitationExercises[0]?.name}.`;
    } else {
      speech = `${currentSystem.name}. Why it matters in physiotherapy: ${currentSystem.whyItMatters}. Key conditions: ${currentSystem.commonConditions.join(', ')}. Daily nutrition: ${currentSystem.dietRecommendations.title}. Hydration tip: ${currentSystem.dietRecommendations.dailyHydrationTip}. Key exercise: ${currentSystem.rehabilitationExercises[0]?.name}.`;
    }

    voiceService.speak(speech, 'dr_priya', language);

    const unsubscribe = voiceService.subscribe((speaking) => {
      if (!speaking) {
        setIsSpeaking(false);
        unsubscribe();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-teal-900 via-teal-800 to-cyan-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-teal-400/20 text-teal-200 rounded-full border border-teal-300/30">
              Interactive Physiological Atlas
            </span>
            <span className="text-xs text-teal-200">8 Essential Physiotherapy Systems</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('bodySystemsTitle')}
          </h1>
          <p className="text-sm text-teal-100/90 mt-1 leading-relaxed">
            {t('bodySystemsSubtitle')}
          </p>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-10 pointer-events-none flex items-center justify-center">
          <Activity className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* 8 Systems Selection Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {BODY_SYSTEMS.map((system) => {
          const isActive = selectedSystemId === system.id;
          return (
            <button
              key={system.id}
              onClick={() => {
                setSelectedSystemId(system.id);
                setSelectedHotspot(null);
                voiceService.stop();
                setIsSpeaking(false);
              }}
              className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all text-xs font-semibold ${
                isActive
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/30 scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 hover:border-teal-300'
              }`}
            >
              <div className={`p-2 rounded-lg mb-1.5 ${isActive ? 'bg-white/20 text-white' : 'bg-teal-50 text-teal-700'}`}>
                {getSystemIcon(system.iconName)}
              </div>
              <span className="leading-tight line-clamp-2">
                {getLocalizedName(system).split('(')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Anatomy View + Detailed Diet & Exercise Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Anatomical Model with Zoom Hotspots */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <ZoomIn className="w-4 h-4 text-teal-600" />
                <span>Interactive Body Model (Zoom-Enabled)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Click hotspots to isolate joint and muscle groups
              </p>
            </div>

            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs flex items-center gap-1"
              title="Toggle Zoom View"
            >
              {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
              <span className="text-[10px] font-bold">{isZoomed ? 'Reset Zoom' : 'Zoom In'}</span>
            </button>
          </div>

          {/* SVG Human Figure with Coordinate Hotspots */}
          <div className="relative mt-4 flex-1 min-h-[440px] flex items-center justify-center bg-radial from-teal-50/50 via-slate-50 to-slate-100 rounded-xl overflow-hidden border border-slate-200/60 p-4">
            {/* Ambient System Reference Image Overlay */}
            <div
              className={`relative transition-transform duration-500 ease-out flex items-center justify-center w-full max-w-[280px] h-[400px] ${
                isZoomed ? 'scale-110' : 'scale-95'
              }`}
            >
              <svg
                viewBox="0 0 200 450"
                className="w-full h-full drop-shadow-md select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Stylized Human Body Silhouette */}
                {/* Head */}
                <ellipse cx="100" cy="40" rx="22" ry="26" className="fill-teal-700/80 stroke-teal-900 stroke-2" />
                {/* Neck */}
                <rect x="94" y="66" width="12" height="16" rx="3" className="fill-teal-600/80" />
                {/* Shoulders & Torso */}
                <path
                  d="M60 90 C 75 80, 125 80, 140 90 L 148 150 C 145 190, 135 220, 130 240 L 70 240 C 65 220, 55 190, 52 150 Z"
                  className="fill-teal-800/80 stroke-teal-950 stroke-2"
                />
                {/* Spine & Chest highlights */}
                <path d="M100 82 L100 238" className="stroke-cyan-300 stroke-2 stroke-dasharray-2" />
                <path d="M80 120 C 90 130, 110 130, 120 120" className="stroke-teal-300/60 stroke-2" />
                <path d="M82 145 C 92 155, 108 155, 118 145" className="stroke-teal-300/60 stroke-2" />

                {/* Arms */}
                <path
                  d="M58 92 L 40 160 C 35 185, 30 215, 26 240"
                  className="stroke-teal-700 stroke-10 stroke-linecap-round"
                />
                <path
                  d="M142 92 L 160 160 C 165 185, 170 215, 174 240"
                  className="stroke-teal-700 stroke-10 stroke-linecap-round"
                />

                {/* Pelvis */}
                <path
                  d="M68 240 L 132 240 L 126 270 L 74 270 Z"
                  className="fill-teal-700/90 stroke-teal-950 stroke-1.5"
                />

                {/* Legs */}
                {/* Left Leg */}
                <path
                  d="M80 270 L 76 345 C 75 370, 72 410, 70 435"
                  className="stroke-teal-800 stroke-14 stroke-linecap-round"
                />
                {/* Right Leg */}
                <path
                  d="M120 270 L 124 345 C 125 370, 128 410, 130 435"
                  className="stroke-teal-800 stroke-14 stroke-linecap-round"
                />

                {/* Knee joints */}
                <circle cx="76" cy="345" r="7" className="fill-cyan-400 stroke-teal-900 stroke-2" />
                <circle cx="124" cy="345" r="7" className="fill-cyan-400 stroke-teal-900 stroke-2" />
              </svg>

              {/* Dynamic Hotspots */}
              {currentSystem.interactiveHotspots.map((hotspot, idx) => {
                const isSelected = selectedHotspot === hotspot.part;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedHotspot(hotspot.part)}
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'w-7 h-7 bg-amber-400 text-slate-950 font-black ring-4 ring-amber-300/50 scale-125 z-20'
                        : 'w-5 h-5 bg-teal-500 hover:bg-teal-400 text-white ring-2 ring-white/90 animate-pulse z-10'
                    } rounded-full shadow-md`}
                    title={hotspot.part}
                  >
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  </button>
                );
              })}
            </div>

            {/* Hotspot details bubble */}
            {selectedHotspot && (
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-teal-200 shadow-md text-xs">
                <div className="font-bold text-teal-900 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-teal-600" />
                  <span>{selectedHotspot}</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  {currentSystem.interactiveHotspots.find((h) => h.part === selectedHotspot)?.description}
                </p>
              </div>
            )}
          </div>

          {/* Quick System Image & Clinical Role */}
          <div className="mt-4 flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <img
              src={SYSTEM_IMAGES[currentSystem.id] || SYSTEM_IMAGES.musculoskeletal}
              alt={currentSystem.name}
              className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200 shadow-2xs"
            />
            <div className="text-xs">
              <span className="font-semibold text-slate-800">Target Anatomy:</span>
              <p className="text-slate-600 mt-0.5 line-clamp-2">
                {currentSystem.anatomicalParts.join(' • ')}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Why it matters, Diet Comments, and Exercises */}
        <div className="lg:col-span-7 space-y-5">
          {/* System Overview Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-teal-600 text-white">
                    {getSystemIcon(currentSystem.iconName)}
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {getLocalizedName(currentSystem)}
                    </h2>
                    <span className="text-xs text-teal-700 font-medium">Physiotherapy Focus Area</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSpeakSystem}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSpeaking
                      ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                      : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>{t('stopAudio')}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-teal-600" />
                      <span>{t('listenAloud')}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onAskAiAboutSystem(currentSystem)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Ask AI Bot</span>
                </button>
              </div>
            </div>

            {/* Why it matters in physiotherapy (verbatim table content) */}
            <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5 mb-1">
                <Info className="w-3.5 h-3.5 text-teal-700" />
                <span>{t('whyItMattersLabel')}</span>
              </h4>
              <p className="text-sm font-medium text-teal-950 leading-relaxed">
                {currentSystem.whyItMatters}
              </p>
            </div>

            {/* Common Conditions Tag List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                {t('commonConditionsLabel')}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {currentSystem.commonConditions.map((cond, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200"
                  >
                    • {cond}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Diet & Nutrition Guidance Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-2 bg-emerald-600 text-white rounded-lg">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t('dailyDietLabel')}</h3>
                <p className="text-xs text-slate-500">{currentSystem.dietRecommendations.title}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Foods to Incorporate
                </h5>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  {currentSystem.dietRecommendations.foodsToEat.map((food, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{food}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-xl space-y-2">
                <h5 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Foods to Minimize
                </h5>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  {currentSystem.dietRecommendations.foodsToAvoid.map((food, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{food}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Daily Hydration Advice */}
            <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl flex items-start gap-2.5">
              <Droplet className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-cyan-900">Hydration Routine: </span>
                <span className="text-cyan-950 font-medium">
                  {currentSystem.dietRecommendations.dailyHydrationTip}
                </span>
              </div>
            </div>
          </div>

          {/* Rehabilitation Exercises Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-2 bg-indigo-600 text-white rounded-lg">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t('exercisesLabel')}</h3>
                <p className="text-xs text-slate-500">Step-by-step movement routines to keep this system healthy</p>
              </div>
            </div>

            <div className="space-y-3">
              {currentSystem.rehabilitationExercises.map((exercise, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-xl transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{exercise.name}</span>
                    </h5>
                    <span className="text-[11px] px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full font-semibold w-fit">
                      {exercise.difficulty}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 pl-7">
                    <p>
                      <span className="font-semibold text-slate-700">Reps & Frequency:</span> {exercise.reps} • {exercise.frequency}
                    </p>
                    <div className="mt-1 space-y-1">
                      {exercise.instructions.map((step, sIdx) => (
                        <p key={sIdx} className="text-slate-600 flex items-start gap-1">
                          <span className="text-teal-600 font-bold">›</span>
                          <span>{step}</span>
                        </p>
                      ))}
                    </div>
                    {exercise.precautions && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-2">
                        ⚠️ <span className="font-semibold">Precaution:</span> {exercise.precautions}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
