import React, { useState, useMemo } from 'react';
import { Building2, Search, MapPin, ChevronRight, ExternalLink } from 'lucide-react';
import { Terminal, Route } from '../../types';

interface TerminalsScreenProps {
  terminals: Terminal[];
  routes: Route[];
  onSelectTerminal: (terminal: Terminal) => void;
}

export const TerminalsScreen: React.FC<TerminalsScreenProps> = ({
  terminals,
  routes,
  onSelectTerminal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');

  const provinces = ['ALL', 'Laguna', 'Cavite', 'Batangas', 'Rizal', 'Quezon'];

  const filteredTerminals = useMemo(() => {
    let list = [...terminals];

    if (selectedProvince !== 'ALL') {
      list = list.filter((t) => t.province.toLowerCase() === selectedProvince.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.city.toLowerCase().includes(q) ||
          t.province.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    return list;
  }, [terminals, selectedProvince, searchQuery]);

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <span>CALABARZON Transit Terminals</span>
        </h2>
        <p className="text-xs text-slate-500">
          Directory of major intermodal stations, jeepney bays, and provincial bus hubs.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search terminal by name, city, or province..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>

        {/* Province Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {provinces.map((prov) => (
            <button
              key={prov}
              type="button"
              onClick={() => setSelectedProvince(prov)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all text-xs font-medium cursor-pointer ${
                selectedProvince === prov
                  ? 'bg-blue-700 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'
              }`}
            >
              {prov === 'ALL' ? 'All Provinces' : prov}
            </button>
          ))}
        </div>
      </div>

      {/* Terminals Count */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-medium">
        <span>Showing {filteredTerminals.length} terminals</span>
      </div>

      {/* List of Terminals */}
      <div className="space-y-2.5">
        {filteredTerminals.length > 0 ? (
          filteredTerminals.map((terminal) => {
            const count = routes.filter((r) => r.terminalId === terminal.id).length;
            return (
              <div
                key={terminal.id}
                onClick={() => onSelectTerminal(terminal)}
                className="bg-white hover:bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded">
                        {terminal.province}
                      </span>
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{terminal.city}</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {terminal.name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {terminal.description}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                      <span className="font-mono">
                        {terminal.latitude.toFixed(2)}°N, {terminal.longitude.toFixed(2)}°E
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-blue-700">
                        {count} registered {count === 1 ? 'route' : 'routes'}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 mt-1" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300 p-6">
            <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No terminals found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or selecting "All Provinces".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
