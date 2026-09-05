import React, { useState } from 'react';
import {
  X,
  Clock,
  Banknote,
  Navigation,
  Bookmark,
  BookmarkCheck,
  Languages,
  CheckCircle2,
  Footprints,
} from 'lucide-react';
import { Route, User } from '../types';
import { isRouteSaved, addSavedRoute } from '../services/storage';

interface RouteDetailsModalProps {
  route: Route | null;
  currentUser: User;
  onClose: () => void;
  onRouteSavedChange: () => void;
}

export const RouteDetailsModal: React.FC<RouteDetailsModalProps> = ({
  route,
  currentUser,
  onClose,
  onRouteSavedChange,
}) => {
  const [lang, setLang] = useState<'en' | 'fil'>('fil'); // Default to Filipino as requested in commuter testing
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  if (!route) return null;

  const isSaved = isRouteSaved(currentUser.id, route.id);

  const handleToggleSave = () => {
    if (isSaved) {
      setSaveSuccess('This route is already in your saved bookmarks.');
      setTimeout(() => setSaveSuccess(null), 2500);
      return;
    }
    const result = addSavedRoute(currentUser.id, route);
    if (result.success) {
      setSaveSuccess('Route successfully saved to your offline itinerary!');
      onRouteSavedChange();
      setTimeout(() => setSaveSuccess(null), 3000);
    } else {
      setSaveSuccess(result.error || 'Could not save route.');
      setTimeout(() => setSaveSuccess(null), 2500);
    }
  };

  // Generate timeline steps if not explicitly provided
  const timeline = route.timeline || [
    {
      stepNumber: 1,
      icon: '🚶',
      titleEn: `Walk to ${route.origin} Terminal`,
      titleFil: `Pumunta sa sakayan ng ${route.origin}`,
      instructionEn: `Locate the boarding platform for ${route.transportType} vehicles.`,
      instructionFil: `Hanapin ang loading bay para sa mga biyaheng ${route.destination}.`,
      meta: '4 mins • 300m walk',
    },
    {
      stepNumber: 2,
      icon: route.transportType === 'Bus' ? '🚌' : '🚐',
      titleEn: `Board ${route.transportType} to ${route.destination}`,
      titleFil: `Sumakay ng ${route.transportType} patungong ${route.destination}`,
      instructionEn: `Prepare exact fare of ₱${route.fare.toFixed(2)}. Pass fare forward to driver.`,
      instructionFil: `Ihanda ang pamasaheng ₱${route.fare.toFixed(2)}. Iabot ang bayad sa drayber.`,
      meta: `${route.estimatedTravelTime} mins • Direct transit`,
    },
    {
      stepNumber: 3,
      icon: '🛑',
      titleEn: `Alight at ${route.destination}`,
      titleFil: `Bumaba sa ${route.destination}`,
      instructionEn: 'Say "Para po!" clearly as you approach your destination.',
      instructionFil: 'Sabihin nang malinaw ang "Para po sa tabi!" kapag malapit na.',
      meta: 'Arrived at destination',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 bg-emerald-800 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-700 border border-emerald-500/50 px-2 py-0.5 rounded text-emerald-100">
                {route.transportType}
              </span>
              {route.transfers !== undefined && (
                <span className="text-[10px] font-medium text-emerald-200">
                  {route.transfers === 0 ? 'Direct Route' : `${route.transfers} Transfer`}
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-white leading-tight">{route.name}</h3>
            <p className="text-xs text-emerald-200 mt-0.5">
              {route.origin} → {route.destination}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-slate-500 mb-0.5">
                <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fare</span>
              </div>
              <div className="text-sm font-bold text-emerald-700">₱{route.fare.toFixed(2)}</div>
            </div>

            <div className="border-x border-slate-200">
              <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-slate-500 mb-0.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Travel Time</span>
              </div>
              <div className="text-sm font-bold text-slate-800">{route.estimatedTravelTime} mins</div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-slate-500 mb-0.5">
                <Footprints className="w-3.5 h-3.5 text-amber-600" />
                <span>Walking</span>
              </div>
              <div className="text-sm font-bold text-slate-800">{route.walkingDistanceMeters || 350} m</div>
            </div>
          </div>

          {/* Description */}
          {route.description && (
            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              {route.description}
            </p>
          )}

          {/* Bilingual Timeline Section */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                <span>Step-by-Step Commuter Guidance</span>
              </h4>

              {/* Language Switcher */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
                <button
                  type="button"
                  onClick={() => setLang('fil')}
                  className={`px-2 py-0.5 rounded font-medium transition-all ${
                    lang === 'fil'
                      ? 'bg-emerald-700 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Filipino
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-2 py-0.5 rounded font-medium transition-all ${
                    lang === 'en'
                      ? 'bg-emerald-700 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Timeline Steps */}
            <div className="space-y-3 relative pl-3 border-l-2 border-emerald-200 ml-3 my-2">
              {timeline.map((step, idx) => (
                <div key={idx} className="relative pl-4">
                  {/* Step Bubble Indicator */}
                  <div className="absolute -left-[23px] top-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-xs">
                    {step.stepNumber}
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      {lang === 'fil' ? step.titleFil : step.titleEn}
                    </h5>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {lang === 'fil' ? step.instructionFil : step.instructionEn}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                      {step.meta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stops Sequence */}
          {route.stops && route.stops.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Stops & Key Landmarks ({route.stops.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {route.stops.map((stop, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-slate-100 text-slate-700 px-2 py-1 rounded-md border border-slate-200 flex items-center gap-1"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span>{stop}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Save Status Toast */}
          {saveSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveSuccess}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleToggleSave}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
              isSaved
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-amber-600" />
                <span>Saved in Itinerary</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-slate-500" />
                <span>Save Route</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
