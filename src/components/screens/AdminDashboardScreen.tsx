import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Building2,
  Compass,
  Database,
  ArrowLeft,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Terminal, Route, TransportType } from '../../types';
import {
  saveTerminal,
  deleteTerminal,
  saveRoute,
  deleteRoute,
} from '../../services/storage';

interface AdminDashboardScreenProps {
  terminals: Terminal[];
  routes: Route[];
  onDataChanged: () => void;
  onBack: () => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  terminals,
  routes,
  onDataChanged,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'terminals' | 'routes'>('terminals');
  const [msg, setMsg] = useState<string | null>(null);

  // Terminal Modal State
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);
  const [editingTerminal, setEditingTerminal] = useState<Terminal | null>(null);
  const [termName, setTermName] = useState('');
  const [termCity, setTermCity] = useState('');
  const [termProvince, setTermProvince] = useState('Laguna');
  const [termLat, setTermLat] = useState(14.2132);
  const [termLng, setTermLng] = useState(121.1648);
  const [termDesc, setTermDesc] = useState('');

  // Route Modal State
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [routeName, setRouteName] = useState('');
  const [routeOrigin, setRouteOrigin] = useState('');
  const [routeDestination, setRouteDestination] = useState('');
  const [routeType, setRouteType] = useState<TransportType>('Jeepney');
  const [routeFare, setRouteFare] = useState(30);
  const [routeTime, setRouteTime] = useState(45);
  const [routeTerminalId, setRouteTerminalId] = useState<number>(terminals[0]?.id || 1);
  const [routeDesc, setRouteDesc] = useState('');

  const openAddTerminal = () => {
    setEditingTerminal(null);
    setTermName('');
    setTermCity('');
    setTermProvince('Laguna');
    setTermLat(14.2132);
    setTermLng(121.1648);
    setTermDesc('');
    setIsTermModalOpen(true);
  };

  const openEditTerminal = (t: Terminal) => {
    setEditingTerminal(t);
    setTermName(t.name);
    setTermCity(t.city);
    setTermProvince(t.province);
    setTermLat(t.latitude);
    setTermLng(t.longitude);
    setTermDesc(t.description);
    setIsTermModalOpen(true);
  };

  const handleSaveTerminal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termName.trim() || !termCity.trim()) return;

    saveTerminal({
      id: editingTerminal?.id,
      name: termName.trim(),
      city: termCity.trim(),
      province: termProvince,
      latitude: Number(termLat),
      longitude: Number(termLng),
      description: termDesc.trim(),
    });

    onDataChanged();
    setIsTermModalOpen(false);
    setMsg(editingTerminal ? 'Terminal updated successfully!' : 'New terminal added successfully!');
    setTimeout(() => setMsg(null), 2500);
  };

  const handleDeleteTerminal = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete terminal "${name}"? This will also remove associated routes.`)) {
      deleteTerminal(id);
      onDataChanged();
      setMsg(`Deleted terminal "${name}".`);
      setTimeout(() => setMsg(null), 2500);
    }
  };

  const openAddRoute = () => {
    setEditingRoute(null);
    setRouteName('');
    setRouteOrigin('');
    setRouteDestination('');
    setRouteType('Jeepney');
    setRouteFare(30);
    setRouteTime(40);
    setRouteTerminalId(terminals[0]?.id || 1);
    setRouteDesc('');
    setIsRouteModalOpen(true);
  };

  const openEditRoute = (r: Route) => {
    setEditingRoute(r);
    setRouteName(r.name);
    setRouteOrigin(r.origin);
    setRouteDestination(r.destination);
    setRouteType(r.transportType);
    setRouteFare(r.fare);
    setRouteTime(r.estimatedTravelTime);
    setRouteTerminalId(r.terminalId);
    setRouteDesc(r.description);
    setIsRouteModalOpen(true);
  };

  const handleSaveRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeName.trim() || !routeOrigin.trim() || !routeDestination.trim()) return;

    saveRoute({
      id: editingRoute?.id,
      terminalId: Number(routeTerminalId),
      name: routeName.trim(),
      origin: routeOrigin.trim(),
      destination: routeDestination.trim(),
      transportType: routeType,
      fare: Number(routeFare),
      estimatedTravelTime: Number(routeTime),
      description: routeDesc.trim(),
      transfers: editingRoute?.transfers || 0,
      walkingDistanceMeters: editingRoute?.walkingDistanceMeters || 300,
      stops: editingRoute?.stops || [routeOrigin, routeDestination],
    });

    onDataChanged();
    setIsRouteModalOpen(false);
    setMsg(editingRoute ? 'Route updated successfully!' : 'New route added successfully!');
    setTimeout(() => setMsg(null), 2500);
  };

  const handleDeleteRoute = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete route "${name}"?`)) {
      deleteRoute(id);
      onDataChanged();
      setMsg(`Deleted route "${name}".`);
      setTimeout(() => setMsg(null), 2500);
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl shadow-2xs font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to App</span>
        </button>

        <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
          <span>Admin Management Mode</span>
        </span>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium block">Total Terminals</span>
          <span className="text-lg font-black text-blue-700">{terminals.length}</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium block">Active Routes</span>
          <span className="text-lg font-black text-emerald-700">{routes.length}</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium block">Database System</span>
          <span className="text-xs font-bold text-slate-800">SQLite & Room</span>
        </div>
      </div>

      {/* Toast Feedback */}
      {msg && (
        <div className="p-2.5 bg-emerald-800 text-white rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{msg}</span>
        </div>
      )}

      {/* Sub-tab navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('terminals')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'terminals'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Manage Terminals ({terminals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('routes')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'routes'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Manage Routes ({routes.length})</span>
        </button>
      </div>

      {/* TERMINALS LIST TAB */}
      {activeTab === 'terminals' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Terminal Directory Records</span>
            <button
              onClick={openAddTerminal}
              className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Terminal</span>
            </button>
          </div>

          <div className="space-y-2">
            {terminals.map((term) => (
              <div
                key={term.id}
                className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                      {term.province}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{term.name}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {term.city} • Lat: {term.latitude.toFixed(3)}, Lng: {term.longitude.toFixed(3)}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditTerminal(term)}
                    className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Terminal"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTerminal(term.id, term.name)}
                    className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Terminal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ROUTES LIST TAB */}
      {activeTab === 'routes' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Transit Routes Matrix</span>
            <button
              onClick={openAddRoute}
              className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Route</span>
            </button>
          </div>

          <div className="space-y-2">
            {routes.map((route) => (
              <div
                key={route.id}
                className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">
                      {route.transportType}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{route.name}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {route.origin} → {route.destination} • Fare: <strong>₱{route.fare.toFixed(2)}</strong> • {route.estimatedTravelTime} mins
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditRoute(route)}
                    className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Route"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteRoute(route.id, route.name)}
                    className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Route"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Terminal Add/Edit Modal */}
      {isTermModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                {editingTerminal ? 'Edit Terminal Record' : 'Add New Terminal'}
              </h3>
              <button onClick={() => setIsTermModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTerminal} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Terminal Name</label>
                <input
                  type="text"
                  required
                  value={termName}
                  onChange={(e) => setTermName(e.target.value)}
                  placeholder="e.g. Cabuyao Public Terminal"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City / Municipality</label>
                  <input
                    type="text"
                    required
                    value={termCity}
                    onChange={(e) => setTermCity(e.target.value)}
                    placeholder="Cabuyao"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Province</label>
                  <select
                    value={termProvince}
                    onChange={(e) => setTermProvince(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
                  >
                    <option value="Laguna">Laguna</option>
                    <option value="Cavite">Cavite</option>
                    <option value="Batangas">Batangas</option>
                    <option value="Rizal">Rizal</option>
                    <option value="Quezon">Quezon</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={termLat}
                    onChange={(e) => setTermLat(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={termLng}
                    onChange={(e) => setTermLng(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Hub Details</label>
                <textarea
                  rows={3}
                  value={termDesc}
                  onChange={(e) => setTermDesc(e.target.value)}
                  placeholder="Dispatch platforms, bay facilities..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTermModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow-xs"
                >
                  Save Terminal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Route Add/Edit Modal */}
      {isRouteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                {editingRoute ? 'Edit Transit Route Record' : 'Add New Route Record'}
              </h3>
              <button onClick={() => setIsRouteModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRoute} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Route Name</label>
                <input
                  type="text"
                  required
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="e.g. Calamba – Cabuyao Poblacion"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Origin</label>
                  <input
                    type="text"
                    required
                    value={routeOrigin}
                    onChange={(e) => setRouteOrigin(e.target.value)}
                    placeholder="Calamba"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destination</label>
                  <input
                    type="text"
                    required
                    value={routeDestination}
                    onChange={(e) => setRouteDestination(e.target.value)}
                    placeholder="Cabuyao"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transport</label>
                  <select
                    value={routeType}
                    onChange={(e) => setRouteType(e.target.value as TransportType)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
                  >
                    <option value="Jeepney">Jeepney</option>
                    <option value="Bus">Bus</option>
                    <option value="Modern Jeepney">Modern Jeepney</option>
                    <option value="UV Express">UV Express</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fare (₱)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={routeFare}
                    onChange={(e) => setRouteFare(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time (mins)</label>
                  <input
                    type="number"
                    required
                    value={routeTime}
                    onChange={(e) => setRouteTime(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Originating Terminal</label>
                <select
                  value={routeTerminalId}
                  onChange={(e) => setRouteTerminalId(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
                >
                  {terminals.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Route Itinerary & Landmark Notes</label>
                <textarea
                  rows={2}
                  value={routeDesc}
                  onChange={(e) => setRouteDesc(e.target.value)}
                  placeholder="Stops, highway junctions..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRouteModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-xs"
                >
                  Save Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
