import React from 'react';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Building,
  Phone,
  Mail,
  Award,
  Users,
  AlertTriangle,
  Stethoscope,
  Trash2,
} from 'lucide-react';
import { useAuth, ADMIN_EMAILS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Physiotherapist } from '../types';

interface AdminDashboardProps {
  doctors: Physiotherapist[];
  onDeleteDoctor: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  doctors,
  onDeleteDoctor,
}) => {
  const {
    currentUser,
    doctorApplications,
    approveDoctorApplication,
    rejectDoctorApplication,
  } = useAuth();
  const { t } = useLanguage();

  const pendingApps = doctorApplications.filter((a) => a.status === 'pending');
  const approvedApps = doctorApplications.filter((a) => a.status === 'approved');

  return (
    <div className="space-y-6">
      {/* Admin Panel Header */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 rounded-full border border-indigo-400/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Administrative Governance
            </span>
            <span className="text-xs text-indigo-300">Doctor Verification & Access Control</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Medical Administrator Approval Console
          </h1>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed">
            As an authorized platform administrator, review credentialed doctor applications. Only approved physiotherapists can unlock their clinic workspaces and treat portal patients.
          </p>

          <div className="mt-4 p-3 bg-black/40 rounded-xl border border-indigo-500/20 text-xs">
            <span className="font-bold text-indigo-300">Authorized Admin Emails: </span>
            <div className="flex flex-wrap gap-2 mt-1.5 font-mono text-[11px] text-slate-300">
              {ADMIN_EMAILS.map((email) => (
                <span
                  key={email}
                  className={`px-2 py-0.5 rounded-md border ${
                    currentUser?.email.toLowerCase() === email
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  {email} {currentUser?.email.toLowerCase() === email ? '(You)' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{pendingApps.length}</div>
            <div className="text-xs font-semibold text-slate-500">Pending Doctor Approvals</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{approvedApps.length}</div>
            <div className="text-xs font-semibold text-slate-500">Approved Doctors</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl border border-teal-200">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{doctors.length}</div>
            <div className="text-xs font-semibold text-slate-500">Total Directory Doctors</div>
          </div>
        </div>
      </div>

      {/* Pending Doctor Applications Queue */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500 text-white rounded-lg shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pending Doctor Applications ({pendingApps.length})
              </h2>
              <p className="text-xs text-slate-500">
                Review clinical credentials and approve access to clinic portals
              </p>
            </div>
          </div>
        </div>

        {pendingApps.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
            All doctor applications have been processed! No pending approvals.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingApps.map((app) => (
              <div
                key={app.id}
                className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-amber-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{app.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      {t('adminPending')}
                    </span>
                  </div>

                  <p className="text-xs text-teal-800 font-medium">
                    {app.speciality} • {app.qualification}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {app.clinicName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {app.phone}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {app.email}
                    </span>
                    <span className="font-semibold text-slate-800">
                      Fee: ₹{app.fee}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => approveDoctorApplication(app.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{t('approveDoctorBtn')}</span>
                  </button>

                  <button
                    onClick={() => rejectDoctorApplication(app.id)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-semibold text-xs rounded-xl transition-all"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{t('rejectDoctorBtn')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Directory Management Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-600 text-white rounded-lg shadow-xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Live Physiotherapist Directory Registry ({doctors.length})
              </h2>
              <p className="text-xs text-slate-500">
                Manage all listed physiotherapists, fees, and contact details
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Doctor</th>
                <th className="p-3">Clinic & Location</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Fee (₹)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {doctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={doc.photoUrl}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{doc.name}</div>
                        <div className="text-[10px] text-teal-700">{doc.experience} yrs exp</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-slate-800">{doc.clinicName}</div>
                    <div className="text-[10px] text-slate-500">{doc.location}</div>
                  </td>
                  <td className="p-3 font-mono text-[11px]">
                    <div>{doc.phone}</div>
                    <div className="text-slate-400">{doc.email}</div>
                  </td>
                  <td className="p-3 font-bold text-slate-900">₹{doc.fee}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onDeleteDoctor(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove from directory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
