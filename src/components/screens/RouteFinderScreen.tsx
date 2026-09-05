import React, { useState, useMemo } from 'react';
import {
  Compass,
  ArrowUpDown,
  Search,
  Filter,
  Clock,
  Banknote,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Footprints,
  RotateCcw,
} from 'lucide-react';
import { Route, TransportType, User } from '../../types';
import { isRouteSaved, addSavedRoute } from '../../services/storage';

interface RouteFinderScreenProps {
  currentUser: User;
  routes: Route[];
  initialOrigin?: string;
  initialDestination?: string;
  onSelectRoute: (route: Route) => void;
  onRouteSavedChange: () => void;
}

export const RouteFinderScreen: React.FC<RouteFinderScreenProps> = ({
  currentUser,
  routes,
  initialOrigin = '',
  initialDestination = '',
  onSelectRoute,
  onRouteSavedChange,
}) => {
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'fare' | 'time' | 'default'>('default');
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleReset = () => {
    setOrigin('');
    setDestination('');
    setSelectedType('ALL');
    setSortBy('default');
  };

  const handleQuickSave = (e: React.MouseEvent, route: Route) => {
    e.stopPropagation();
    const isSaved = isRouteSaved(currentUser.id, route.id);
    if (isSaved) {
      setSavedFeedback(`"${route.name}" is already saved.`);
      setTimeout(() => setSavedFeedback(null), 2500);
      return;
    }
    const res = addSavedRoute(currentUser.id, route);
    if (res.success) {
      setSavedFeedback(`Saved "${route.name}" to your itinerary!`);
      onRouteSavedChange();
      setTimeout(() => setSavedFeedback(null), 2500);
    }
  };

  // Filter and sort routes
  const filteredRoutes = useMemo(() => {
    let list = [...routes];

    // Filter by Origin
    if (origin.trim()) {
      const q = origin.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.origin.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          (r.stops && r.stops.some((s) => s.toLowerCase().includes(q)))
      );
    }

    // Filter by Destination
    if (destination.trim()) {
      const q = destination.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.destination.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          (r.stops && r.stops.some((s) => s.toLowerCase().includes(q)))
      );
    }

    // Filter by Transport Type
    if (selectedType !== 'ALL') {
      list = list.filter((r) => r.transportType === selectedType);
    }

    // Sort
    if (sortBy === 'fare') {
      list.sort((a, b) => a.fare - b.fare);
    } else if (sortBy === 'time') {
      list.sort((a, b) => a.estimatedTravelTime - b.estimatedTravelTime);
    }

    return list;
  }, [routes, origin, destination, selectedType, sortBy]);

  const transportTypes: ('ALL' | TransportType)[] = ['ALL', 'Jeepney', 'Bus', 'Modern Jeepney'];

  return (
    <div className="space-y-4 pb-8">
      {/* Page Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-600" />
          <span>Multi-Modal Route Finder</span>
        </h2>
        <p className="text-xs text-slate-500">
          Find public transit options, fare matrices, and walking connections across CALABARZON.
        </p>
      </div>

      {/* Search Filter Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        {/* Origin & Destination with Swap */}
        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-2">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-emerald-500 absolute left-3 top-3 ring-2 ring-emerald-100" />
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="From: e.g. Calamba, Dasmariñas, Batangas..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
            </div>

            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-rose-500 absolute left-3 top-3 ring-2 ring-rose-100" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="To: e.g. Santa Rosa, Tagaytay, Lipa..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSwap}
            title="Swap Origin and Destination"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors border border-slate-200 cursor-pointer"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Transport Type Filter Chips */}
        <div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {transportTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-all text-xs font-medium cursor-pointer ${
                  selectedType === type
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'
                }`}
              >
                {type === 'ALL' ? 'All Types' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1 text-slate-500 text-[11px]">
            <Filter className="w-3.5 h-3.5" />
            <span>Sort By:</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSortBy('default')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                sortBy === 'default'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Recommended
            </button>
            <button
              type="button"
              onClick={() => setSortBy('fare')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                sortBy === 'fare'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Lowest Fare
            </button>
            <button
              type="button"
              onClick={() => setSortBy('time')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                sortBy === 'time'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Fastest
            </button>
          </div>
        </div>
      </div>

      {/* Floating Save Route Toast */}
      {savedFeedback && (
        <div className="bg-emerald-800 text-white text-xs px-3 py-2 rounded-xl shadow-lg flex items-center justify-between gap-2 animate-in fade-in">
          <span>{savedFeedback}</span>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Available Routes ({filteredRoutes.length})
        </span>
        {(origin || destination || selectedType !== 'ALL') && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Route Cards List */}
      <div className="space-y-2.5">
        {filteredRoutes.length > 0 ? (
          filteredRoutes.map((route) => {
            const isSaved = isRouteSaved(currentUser.id, route.id);
            return (
              <div
                key={route.id}
                onClick={() => onSelectRoute(route)}
                className="bg-white hover:bg-slate-50 p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs group relative"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    {/* Badge & Name */}
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          route.transportType === 'Bus'
                            ? 'bg-blue-100 text-blue-800'
                            : route.transportType === 'Modern Jeepney'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {route.transportType}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {route.transfers === 0 ? 'Direct' : `${route.transfers} transfer`}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {route.name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {route.origin} → {route.destination}
                    </p>

                    {/* Key Stats Pill */}
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <Banknote className="w-3.5 h-3.5" />
                        <span>₱{route.fare.toFixed(2)}</span>
                      </span>

                      <span className="text-slate-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{route.estimatedTravelTime} mins</span>
                      </span>

                      <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                        <Footprints className="w-3.5 h-3.5 text-amber-600" />
                        <span>{route.walkingDistanceMeters || 350}m walk</span>
                      </span>
                    </div>
                  </div>

                  {/* Bookmark quick button */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleQuickSave(e, route)}
                      title={isSaved ? 'Route saved' : 'Save route to offline itinerary'}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved
                          ? 'bg-amber-50 border-amber-300 text-amber-700'
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300 p-6">
            <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No transit routes found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              We couldn't find a direct route matching your search. Try resetting the origin/destination or selecting "All Types".
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1.5 px-3 rounded-lg"
            >
              Reset Search Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
