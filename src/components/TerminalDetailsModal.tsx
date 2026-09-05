import React from 'react';
import { X, Building2, MapPin, Compass, ArrowRight, Bus, ExternalLink } from 'lucide-react';
import { Terminal, Route } from '../types';

interface TerminalDetailsModalProps {
  terminal: Terminal | null;
  routes: Route[];
  onClose: () => void;
  onSelectRoute: (route: Route) => void;
}

export const TerminalDetailsModal: React.FC<TerminalDetailsModalProps> = ({
  terminal,
  routes,
  onClose,
  onSelectRoute,
}) => {
  if (!terminal) return null;

  const departingRoutes = routes.filter(
    (r) => r.terminalId === terminal.id || r.origin.toLowerCase().includes(terminal.city.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 bg-blue-800 text-white flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-700 border border-blue-500/50 px-2 py-0.5 rounded text-blue-100">
              {terminal.province} Transit Hub
            </span>
            <h3 className="text-base font-bold text-white leading-tight mt-1">{terminal.name}</h3>
            <p className="text-xs text-blue-200 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>
                {terminal.city}, {terminal.province}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-blue-700/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Coordinates & Location Pill */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">GPS Coordinates:</span>
              <span className="font-mono text-slate-800 font-medium">
                {terminal.latitude.toFixed(4)}° N, {terminal.longitude.toFixed(4)}° E
              </span>
            </div>
            <a
              href={`https://www.google.com/maps?q=${terminal.latitude},${terminal.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg border border-blue-200 transition-colors"
            >
              <span>View Map</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Terminal Overview
            </h4>
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
              {terminal.description}
            </p>
          </div>

          {/* Departing Routes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
              <span>Departing & Connected Routes</span>
              <span className="text-blue-700 font-semibold">{departingRoutes.length} available</span>
            </h4>

            <div className="space-y-2">
              {departingRoutes.length > 0 ? (
                departingRoutes.map((route) => (
                  <div
                    key={route.id}
                    onClick={() => {
                      onClose();
                      onSelectRoute(route);
                    }}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl cursor-pointer transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold bg-white text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                          {route.transportType}
                        </span>
                        <span className="text-xs font-bold text-slate-900 group-hover:text-blue-800">
                          {route.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Fare: <strong className="text-emerald-700">₱{route.fare.toFixed(2)}</strong> • Travel: {route.estimatedTravelTime} mins
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No active route schedules listed for this bay yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
