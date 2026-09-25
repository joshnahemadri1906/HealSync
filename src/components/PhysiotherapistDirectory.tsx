import React, { useState } from 'react';
import {
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ThumbsUp,
  Volume2,
  VolumeX,
  PlusCircle,
  Clock,
  Sparkles,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { Physiotherapist } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { voiceService } from '../services/voiceService';
import { AddDoctorModal } from './AddDoctorModal';

interface PhysiotherapistDirectoryProps {
  doctors: Physiotherapist[];
  onAddDoctor: (doc: Physiotherapist) => void;
  onBookAppointment: (doc: Physiotherapist) => void;
  onAskAiAboutSpecialist: (doc: Physiotherapist) => void;
}

export const PhysiotherapistDirectory: React.FC<PhysiotherapistDirectoryProps> = ({
  doctors,
  onAddDoctor,
  onBookAppointment,
  onAskAiAboutSpecialist,
}) => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedSpeciality, setSelectedSpeciality] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  // Filter cities & specialities
  const cities = ['All', ...Array.from(new Set(doctors.map((d) => d.city)))];
  const specialities = [
    'All',
    'Musculoskeletal',
    'Pain & Rehabilitation',
    'Sports Injuries',
    'Neuro & Balance',
    'Pelvic Floor',
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.speciality.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = selectedCity === 'All' || doc.city === selectedCity;
    const matchesSpeciality =
      selectedSpeciality === 'All' ||
      doc.speciality.toLowerCase().includes(selectedSpeciality.toLowerCase());

    return matchesSearch && matchesCity && matchesSpeciality;
  });

  const handleSpeakDoctor = (doc: Physiotherapist) => {
    if (currentlySpeakingId === doc.id) {
      voiceService.stop();
      setCurrentlySpeakingId(null);
      return;
    }

    setCurrentlySpeakingId(doc.id);
    let speechText = '';

    if (language === 'ta') {
      speechText = `${doc.name}. பிசியோதெரபிஸ்ட். ${doc.experience} ஆண்டுகள் அனுபவம். கிளினிக்: ${doc.clinicName}, ${doc.location}. ஆலோசனைக் கட்டணம் ரூபாய் ${doc.fee}. தொலைபேசி எண்: ${doc.phone}. மின்னஞ்சல்: ${doc.email}. ${doc.availability}.`;
    } else if (language === 'hi') {
      speechText = `${doc.name}. फिजियोथेरेपिस्ट. ${doc.experience} वर्षों का अनुभव. क्लिनिक: ${doc.clinicName}, ${doc.location}. परामर्श शुल्क ${doc.fee} रुपये. फोन: ${doc.phone}. ईमेल: ${doc.email}.`;
    } else {
      speechText = `${doc.name}, certified physiotherapist with ${doc.experience} years of experience at ${doc.clinicName}, ${doc.location}. Clinic consultation fee is ${doc.fee} rupees. Phone: ${doc.phone}. Email: ${doc.email}. Status: ${doc.availability}. ${doc.bio}`;
    }

    voiceService.speak(speechText, 'dr_priya', language);

    const unsubscribe = voiceService.subscribe((speaking) => {
      if (!speaking) {
        setCurrentlySpeakingId(null);
        unsubscribe();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 rounded-full border border-teal-200">
                Verified Specialists Directory
              </span>
              <span className="text-xs font-medium text-slate-500">
                {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'} Available
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              {t('navDirectory')}
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Contact verified physiotherapists, view clinic locations, consultation fees, and direct Gmail & phone numbers.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-all shadow-md shadow-teal-600/20 active:scale-95 text-sm shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{t('addNewDoctor')}</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-3 pt-5 border-t border-slate-100">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={t('searchDoctors')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-slate-700"
            >
              <option value="All">{t('filterAll')}</option>
              {cities.filter((c) => c !== 'All').map((city) => (
                <option key={city} value={city}>
                  📍 {city}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedSpeciality}
              onChange={(e) => setSelectedSpeciality(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-slate-700"
            >
              <option value="All">All Specialities</option>
              {specialities.filter((s) => s !== 'All').map((spec) => (
                <option key={spec} value={spec}>
                  🩺 {spec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="space-y-4">
        {filteredDoctors.map((doc) => {
          const isSpeaking = currentlySpeakingId === doc.id;
          return (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-teal-300 shadow-xs hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row gap-5">
                {/* Doctor Avatar & Badges */}
                <div className="flex sm:flex-col items-center sm:items-start gap-4 shrink-0">
                  <div className="relative">
                    <img
                      src={doc.photoUrl}
                      alt={doc.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-teal-100 shadow-xs"
                    />
                    {doc.isCustomAdded && (
                      <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full shadow-xs">
                        Manual Entry
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 w-full">
                    {/* Patient Rating Stories */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200 w-fit">
                      <ThumbsUp className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                      <span>{doc.rating}%</span>
                      <span className="text-emerald-600 font-normal">
                        ({doc.patientStoriesCount} {t('patientStories')})
                      </span>
                    </div>

                    {/* Availability */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 text-teal-800 rounded-lg text-xs font-semibold border border-teal-200 w-fit">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>{doc.availability}</span>
                    </div>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="flex-1 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 hover:text-teal-700 transition-colors">
                        {doc.name}
                      </h3>
                      <p className="text-xs font-medium text-teal-700">{doc.title}</p>
                    </div>

                    {/* Audio Listen Button for Low Literacy */}
                    <button
                      onClick={() => handleSpeakDoctor(doc)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSpeaking
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                          : 'bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200'
                      }`}
                      title="Listen aloud to this doctor's details"
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>{t('stopAudio')}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                          <span>{t('listenAloud')}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">
                      {doc.experience} {t('experience')} overall
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {doc.location}
                    </span>
                    <span>•</span>
                    <span className="text-teal-800 font-medium">{doc.clinicName}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700">Speciality:</span> {doc.speciality}. {doc.bio}
                  </p>

                  {/* Direct Contact Information (Name, Phone, Gmail) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <a
                      href={`tel:${doc.phone.replace(/[^0-9+]/g, '')}`}
                      className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50/70 hover:bg-teal-50/50 text-slate-800 transition-colors text-xs font-medium group"
                    >
                      <div className="p-1.5 bg-teal-600 text-white rounded-lg group-hover:scale-105 transition-transform">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Phone Number</div>
                        <div className="font-bold text-teal-900">{doc.phone}</div>
                      </div>
                    </a>

                    <a
                      href={`mailto:${doc.email}?subject=Physiotherapy Consultation Inquiry`}
                      className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50/70 hover:bg-teal-50/50 text-slate-800 transition-colors text-xs font-medium group"
                    >
                      <div className="p-1.5 bg-red-600 text-white rounded-lg group-hover:scale-105 transition-transform">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Gmail / Email</div>
                        <div className="font-bold text-slate-800 truncate">{doc.email}</div>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Consultation Fee & Actions */}
                <div className="flex md:flex-col justify-between items-end md:items-stretch gap-3 md:w-56 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-5">
                  <div>
                    <div className="text-[11px] text-slate-500">{t('consultationFee')}</div>
                    <div className="text-2xl font-black text-slate-900 flex items-baseline">
                      <span>₹{doc.fee}</span>
                      <span className="text-[11px] font-normal text-slate-500 ml-1">/ session</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <button
                      onClick={() => onBookAppointment(doc)}
                      className="w-full py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{t('bookAppointment')}</span>
                    </button>

                    <a
                      href={`tel:${doc.phone.replace(/[^0-9+]/g, '')}`}
                      className="w-full py-2 px-3 rounded-xl border border-teal-600 text-teal-700 hover:bg-teal-50 active:scale-95 font-semibold text-xs transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{t('callNow')}</span>
                    </a>

                    <button
                      onClick={() => onAskAiAboutSpecialist(doc)}
                      className="w-full py-1.5 px-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      <span>Ask AI Bot about {doc.name.split(' ')[1] || 'Doctor'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-slate-500 text-sm">No physiotherapists matched your search filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('All');
                setSelectedSpeciality('All');
              }}
              className="mt-3 text-xs font-bold text-teal-600 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Manual Insertion Modal */}
      <AddDoctorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddDoctor={onAddDoctor}
      />
    </div>
  );
};
