import React from 'react';
import {
  User as UserIcon,
  ShieldCheck,
  LogOut,
  CheckCircle2,
  Clock,
  Code2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Database,
  Smartphone,
} from 'lucide-react';
import { User } from '../../types';

interface ProfileScreenProps {
  currentUser: User;
  onLogout: () => void;
  onSwitchUser: (email: string) => void;
  onOpenAdminDashboard: () => void;
  onOpenAndroidGuide: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  onLogout,
  onSwitchUser,
  onOpenAdminDashboard,
  onOpenAndroidGuide,
}) => {
  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-emerald-600" />
          <span>Commuter Profile & System Info</span>
        </h2>
        <p className="text-xs text-slate-500">
          Account details and 30% Software Development midterm implementation deliverables.
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-sm">
            {currentUser.fullName.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">{currentUser.fullName}</h3>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  currentUser.role === 'ADMIN'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500">{currentUser.email}</p>
          </div>
        </div>

        {/* Quick Demo Switcher */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Switch Demo Profile:</span>
          <div className="flex gap-1.5">
            {currentUser.role !== 'USER' ? (
              <button
                onClick={() => onSwitchUser('user@transitph.test')}
                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg font-medium transition-colors"
              >
                Switch to Commuter
              </button>
            ) : (
              <button
                onClick={() => onSwitchUser('admin@transitph.test')}
                className="px-2.5 py-1 text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-medium transition-colors border border-amber-200"
              >
                Switch to Admin
              </button>
            )}
          </div>
        </div>

        {/* Admin Dashboard Entry Button */}
        {currentUser.role === 'ADMIN' && (
          <div className="mt-3">
            <button
              onClick={onOpenAdminDashboard}
              className="w-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-between transition-colors shadow-xs"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Open Admin Management Console</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Android Studio Source Code Card */}
      <div
        onClick={onOpenAndroidGuide}
        className="bg-emerald-50 border border-emerald-200 hover:border-emerald-300 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950">
              Native Android Java Project Files
            </h4>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              All Java Activities, Fragments, and XML layouts reside in <code className="font-mono bg-emerald-100 px-1 rounded">/app</code> ready for Android Studio.
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-emerald-700 shrink-0" />
      </div>

      {/* 30% Midterm Scope Implementation Progress */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>30% Midterm Deliverables Status</span>
          </h4>
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            100% of 30% Midterm Scope
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2 p-2 bg-slate-50 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-slate-800">User Authentication & Session Management</strong>
              <p className="text-[11px] text-slate-500">
                User registration, login, role separation (Commuter vs Admin), and persistent sessions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 bg-slate-50 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-slate-800">CALABARZON Terminal Directory & Bay Guide</strong>
              <p className="text-[11px] text-slate-500">
                16 integrated terminals covering Laguna, Cavite, Batangas, Rizal, and Quezon with GPS coords and route listings.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 bg-slate-50 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-slate-800">Multi-Modal Route Finder & Fare Calculation</strong>
              <p className="text-[11px] text-slate-500">
                Origin/destination search, transport filters (Jeepney, Bus, Modern PUV), fare matrices in PHP (₱), and travel times.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 bg-slate-50 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-slate-800">Bilingual Step-by-Step Guidance & Audio Phrasebook</strong>
              <p className="text-[11px] text-slate-500">
                English ↔ Filipino timeline toggle and voice text-to-speech audio pronunciation in Tagalog & Bikol dialects.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 bg-slate-50 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-slate-800">Saved Routes & Admin Management</strong>
              <p className="text-[11px] text-slate-500">
                Offline bookmarks for commuters, plus full CRUD capabilities for Terminals and Routes for system administrators.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 bg-slate-50/50 rounded-xl border border-slate-100 opacity-75">
            <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-slate-600">Remaining 70% Scope (Final Project Phase)</strong>
              <p className="text-[11px] text-slate-400">
                Live GPS vehicle tracking, IoT crowd density sensors, and incident alert push notifications.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <button
        type="button"
        onClick={onLogout}
        className="w-full py-2.5 px-4 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200 hover:border-rose-200"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out of Session</span>
      </button>
    </div>
  );
};
