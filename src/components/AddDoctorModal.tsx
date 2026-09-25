import React, { useState } from 'react';
import { X, UserPlus, Phone, Mail, MapPin, Building2, Award, IndianRupee, Image } from 'lucide-react';
import { Physiotherapist } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDoctor: (doc: Physiotherapist) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1594824813515-5853530869d8?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
];

export const AddDoctorModal: React.FC<AddDoctorModalProps> = ({ isOpen, onClose, onAddDoctor }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [title, setTitle] = useState('Consultant Physiotherapist');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState<number>(5);
  const [clinicName, setClinicName] = useState('');
  const [location, setLocation] = useState('Chennai');
  const [city, setCity] = useState('Chennai');
  const [fee, setFee] = useState<number>(600);
  const [speciality, setSpeciality] = useState('Musculoskeletal & Orthopedic Rehab');
  const [availability, setAvailability] = useState('Available Today');
  const [photoUrl, setPhotoUrl] = useState(PRESET_AVATARS[0]);
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide the doctor’s name.');
      return;
    }
    if (!phone.trim() || phone.trim() === '+91') {
      setError('Please provide a valid phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid Gmail/email address.');
      return;
    }

    const newDoctor: Physiotherapist = {
      id: 'custom-pt-' + Date.now(),
      name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
      title,
      phone,
      email,
      experience: Number(experience) || 1,
      clinicName: clinicName || 'Specialist Physiotherapy Clinic',
      location: location || `${city}`,
      city: city || 'Chennai',
      fee: Number(fee) || 500,
      rating: 98,
      patientStoriesCount: Math.floor(Math.random() * 40) + 15,
      availability,
      speciality,
      photoUrl,
      bio: bio || `${name} is a certified physical therapist specializing in ${speciality} with ${experience} years of clinical practice.`,
      isCustomAdded: true,
    };

    onAddDoctor(newDoctor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-linear-to-r from-teal-50 to-cyan-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-600 text-white rounded-xl shadow-xs">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Add Physiotherapist Details</h2>
              <p className="text-xs text-slate-500">
                Manually insert specialist contact information and clinical fees
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Doctor Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. S Sivabalan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Designation / Title
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Consultant Physiotherapist"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-teal-600" /> Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98401 23456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-600" /> Gmail / Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="doctor.name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-teal-600" /> Clinic / Hospital Name
              </label>
              <input
                type="text"
                placeholder="e.g. BEE Health Studio, Apollo Hospital"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" /> Clinic Address / Location
              </label>
              <input
                type="text"
                placeholder="e.g. Thiruvanmiyur, Chennai"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-teal-600" /> Experience (Years)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-teal-600" /> Consultation Fee (₹)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Availability Status
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
              >
                <option value="Available Today">Available Today</option>
                <option value="Available Tomorrow">Available Tomorrow</option>
                <option value="Mon - Fri">Mon - Fri</option>
                <option value="By Appointment">By Appointment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Speciality / Core Practice Area
            </label>
            <input
              type="text"
              placeholder="e.g. Musculoskeletal, Stroke Rehab, Sports Injury, Spine"
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-teal-600" /> Choose Profile Avatar / Photo
            </label>
            <div className="flex items-center gap-3 overflow-x-auto py-2">
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPhotoUrl(url)}
                  className={`relative rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    photoUrl === url ? 'border-teal-600 ring-2 ring-teal-400 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="avatar option" className="w-12 h-12 object-cover" />
                </button>
              ))}
            </div>
            <input
              type="url"
              placeholder="Or paste custom image URL..."
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="mt-2 w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Brief Bio & Practice Notes
            </label>
            <textarea
              rows={2}
              placeholder="Specialist credentials, hospital affiliations, patient care approach..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-colors shadow-md shadow-teal-600/20 text-sm flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Save Physiotherapist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
