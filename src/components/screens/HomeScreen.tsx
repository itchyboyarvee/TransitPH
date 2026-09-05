import React, { useState } from 'react';
import {
  Compass,
  Building2,
  Languages,
  Bookmark,
  ArrowRight,
  MapPin,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Volume2,
} from 'lucide-react';
import { User, Route, SavedRoute } from '../../types';
import { NavTab } from '../BottomNavigation';

interface HomeScreenProps {
  currentUser: User;
  onNavigateTab: (tab: NavTab) => void;
  onQuickSearch: (origin: string, destination: string) => void;
  savedRoutes: SavedRoute[];
  routes: Route[];
  onSelectRoute: (route: Route) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentUser,
  onNavigateTab,
  onQuickSearch,
  savedRoutes,
  routes,
  onSelectRoute,
}) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickSearch(origin, destination);
  };

  const quickPicks = [
    { from: 'Calamba', to: 'Santa Rosa' },
    { from: 'Dasmariñas', to: 'Tagaytay' },
    { from: 'Batangas City', to: 'Lipa City' },
    { from: 'Lucena City', to: 'San Pablo' },
  ];

  return (
    <div className="space-y-4 pb-6">
      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-200 bg-emerald-900/50 px-2.5 py-0.5 rounded-full border border-emerald-500/30 inline-flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>CALABARZON Commuter Portal</span>
            </span>
            {currentUser.role === 'ADMIN' && (
              <span className="text-[10px] font-bold uppercase bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Admin</span>
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Kumusta, {currentUser.fullName}!
          </h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-md">
            Find reliable multi-modal jeepney and bus transit across Laguna, Cavite, Batangas, Rizal, and Quezon.
          </p>
        </div>
      </div>

      {/* Quick Search Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 mb-2.5 flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>Where do you want to go?</span>
        </h3>

        <form onSubmit={handleSearchSubmit} className="space-y-2.5">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-500 absolute left-3 top-3.5 ring-4 ring-emerald-100" />
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Origin (e.g. Calamba Crossing, SM Dasma)"
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="relative">
            <MapPin className="w-3.5 h-3.5 text-rose-500 absolute left-2.5 top-3" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination (e.g. Santa Rosa Balibago, Tagaytay)"
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <span>Find Transit Route</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Route Shortcuts */}
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
            Popular Commuter Links:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickPicks.map((pick, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setOrigin(pick.from);
                  setDestination(pick.to);
                  onQuickSearch(pick.from, pick.to);
                }}
                className="text-[11px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 px-2 py-1 rounded-lg transition-colors border border-slate-200/80"
              >
                {pick.from} → {pick.to}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access Feature Grid */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 px-1">
          Quick Access Modules
        </h4>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onNavigateTab('finder')}
            className="bg-white hover:bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-left transition-all group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">
              Route Finder
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
              Fares, travel times & stops
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('terminals')}
            className="bg-white hover:bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-left transition-all group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="font-bold text-xs text-slate-900 group-hover:text-blue-700 transition-colors">
              Terminals
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
              16 hubs across CALABARZON
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('assistant')}
            className="bg-white hover:bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-left transition-all group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Languages className="w-4 h-4" />
            </div>
            <div className="font-bold text-xs text-slate-900 group-hover:text-purple-700 transition-colors">
              Assisted Navigation
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
              Multilingual audio phrasebook
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('saved')}
            className="bg-white hover:bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-left transition-all group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Bookmark className="w-4 h-4" />
            </div>
            <div className="font-bold text-xs text-slate-900 group-hover:text-amber-700 transition-colors">
              Saved Routes
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
              {savedRoutes.length} offline itinerary routes
            </p>
          </button>
        </div>
      </div>

      {/* Assisted Commuter Guidance Banner */}
      <div
        onClick={() => onNavigateTab('assistant')}
        className="bg-emerald-50 border border-emerald-200 hover:border-emerald-300 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950">
              Assisted Commuter Phrasebook
            </h4>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Listen to Tagalog & Bikol phrases with audio speech for fares and "Para po!".
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-emerald-700 shrink-0" />
      </div>

      {/* Saved Routes or Featured Routes List */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {savedRoutes.length > 0 ? 'Your Bookmarked Routes' : 'Featured Network Routes'}
          </h4>
          <button
            onClick={() => onNavigateTab(savedRoutes.length > 0 ? 'saved' : 'finder')}
            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
          >
            View All
          </button>
        </div>

        <div className="space-y-2">
          {savedRoutes.length > 0 ? (
            savedRoutes.slice(0, 3).map((saved) => (
              <div
                key={saved.id}
                onClick={() => onSelectRoute(saved.route)}
                className="bg-white p-3 rounded-xl border border-slate-200 hover:border-emerald-300 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                      {saved.route.transportType}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {saved.route.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Fare: <strong className="text-emerald-700">₱{saved.route.fare.toFixed(2)}</strong> • Est: {saved.route.estimatedTravelTime} mins
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))
          ) : (
            routes.slice(0, 3).map((route) => (
              <div
                key={route.id}
                onClick={() => onSelectRoute(route)}
                className="bg-white p-3 rounded-xl border border-slate-200 hover:border-emerald-300 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      {route.transportType}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {route.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Fare: <strong className="text-emerald-700">₱{route.fare.toFixed(2)}</strong> • {route.estimatedTravelTime} mins
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
