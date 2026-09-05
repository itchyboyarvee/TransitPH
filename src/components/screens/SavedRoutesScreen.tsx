import React, { useState } from 'react';
import {
  Bookmark,
  Trash2,
  ChevronRight,
  Clock,
  Banknote,
  Search,
  CheckCircle,
  Compass,
} from 'lucide-react';
import { SavedRoute, Route, User } from '../../types';
import { removeSavedRoute } from '../../services/storage';

interface SavedRoutesScreenProps {
  currentUser: User;
  savedRoutes: SavedRoute[];
  onSelectRoute: (route: Route) => void;
  onRoutesChanged: () => void;
  onNavigateFinder: () => void;
}

export const SavedRoutesScreen: React.FC<SavedRoutesScreenProps> = ({
  currentUser,
  savedRoutes,
  onSelectRoute,
  onRoutesChanged,
  onNavigateFinder,
}) => {
  const [removedMsg, setRemovedMsg] = useState<string | null>(null);

  const handleRemove = (e: React.MouseEvent, savedId: number, name: string) => {
    e.stopPropagation();
    removeSavedRoute(savedId);
    onRoutesChanged();
    setRemovedMsg(`Removed "${name}" from saved routes.`);
    setTimeout(() => setRemovedMsg(null), 2500);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-amber-600" />
          <span>Saved Routes & Itineraries</span>
        </h2>
        <p className="text-xs text-slate-500">
          Bookmarked transit options stored locally for quick offline access during your daily commute.
        </p>
      </div>

      {/* Remove Toast Feedback */}
      {removedMsg && (
        <div className="p-2.5 bg-slate-800 text-white rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{removedMsg}</span>
        </div>
      )}

      {/* List */}
      <div className="space-y-2.5">
        {savedRoutes.length > 0 ? (
          savedRoutes.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectRoute(item.route)}
              className="bg-white hover:bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all cursor-pointer shadow-2xs group relative"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                      {item.route.transportType}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Saved on {item.savedAt}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                    {item.route.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.route.origin} → {item.route.destination}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <Banknote className="w-3.5 h-3.5" />
                      <span>₱{item.route.fare.toFixed(2)}</span>
                    </span>

                    <span className="text-slate-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.route.estimatedTravelTime} mins</span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleRemove(e, item.id, item.route.name)}
                    title="Remove from saved"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 p-6">
            <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No saved routes yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Bookmark frequently traveled transit lines in the Route Finder to access their fare and transfer directions anytime.
            </p>
            <button
              type="button"
              onClick={onNavigateFinder}
              className="mt-4 inline-flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-3.5 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Routes</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
