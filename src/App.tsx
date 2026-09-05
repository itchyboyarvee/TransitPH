import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNavigation, NavTab } from './components/BottomNavigation';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegisterScreen } from './components/screens/RegisterScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { RouteFinderScreen } from './components/screens/RouteFinderScreen';
import { TerminalsScreen } from './components/screens/TerminalsScreen';
import { AssistedNavigationScreen } from './components/screens/AssistedNavigationScreen';
import { SavedRoutesScreen } from './components/screens/SavedRoutesScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { AdminDashboardScreen } from './components/screens/AdminDashboardScreen';
import { RouteDetailsModal } from './components/RouteDetailsModal';
import { TerminalDetailsModal } from './components/TerminalDetailsModal';
import { AndroidProjectGuideModal } from './components/AndroidProjectGuideModal';
import { User, Route, Terminal, SavedRoute } from './types';
import {
  getCurrentUser,
  setCurrentUser,
  getTerminals,
  getRoutes,
  getSavedRoutes,
  getStoredUsers,
} from './services/storage';
import { Wifi, BatteryMedium, SignalHigh } from 'lucide-react';

export default function App() {
  // Session & User State
  const [currentUser, setUser] = useState<User | null>(() => {
    const existing = getCurrentUser();
    if (existing) return existing;
    // Auto-login Maria Santos (Commuter Demo) by default for seamless preview
    const users = getStoredUsers();
    const defaultUser = users[0] || null;
    if (defaultUser) setCurrentUser(defaultUser);
    return defaultUser;
  });

  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState(false);

  // Search Prefill across screens
  const [finderOrigin, setFinderOrigin] = useState('');
  const [finderDestination, setFinderDestination] = useState('');

  // Modals & Details
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Phone Frame View Toggle (Default to true for authentic Android experience)
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  // App Data State
  const [terminals, setTerminals] = useState<Terminal[]>(() => getTerminals());
  const [routes, setRoutes] = useState<Route[]>(() => getRoutes());
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);

  // Refresh saved routes when user or route changes
  const refreshSavedRoutes = () => {
    if (currentUser) {
      setSavedRoutes(getSavedRoutes(currentUser.id));
    } else {
      setSavedRoutes([]);
    }
  };

  const refreshAllData = () => {
    setTerminals(getTerminals());
    setRoutes(getRoutes());
    refreshSavedRoutes();
  };

  useEffect(() => {
    refreshSavedRoutes();
  }, [currentUser]);

  // Handlers
  const handleLoginSuccess = (user: User) => {
    setUser(user);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    setAuthView('login');
  };

  const handleSwitchUser = (email: string) => {
    const users = getStoredUsers();
    const target = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (target) {
      setCurrentUser(target);
      setUser(target);
      setIsAdminConsoleOpen(false);
      refreshSavedRoutes();
    }
  };

  const handleQuickSearchFromHome = (origin: string, destination: string) => {
    setFinderOrigin(origin);
    setFinderDestination(destination);
    setActiveTab('finder');
  };

  const handleTabChange = (tab: NavTab) => {
    setIsAdminConsoleOpen(false);
    setActiveTab(tab);
  };

  // If user is not logged in, render authentication flow
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-3">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          {authView === 'login' ? (
            <LoginScreen
              onLoginSuccess={handleLoginSuccess}
              onNavigateRegister={() => setAuthView('register')}
            />
          ) : (
            <RegisterScreen
              onRegisterSuccess={handleLoginSuccess}
              onNavigateLogin={() => setAuthView('login')}
            />
          )}
        </div>
      </div>
    );
  }

  // Active Screen Content Renderer
  const renderScreenContent = () => {
    if (isAdminConsoleOpen && currentUser.role === 'ADMIN') {
      return (
        <AdminDashboardScreen
          terminals={terminals}
          routes={routes}
          onDataChanged={refreshAllData}
          onBack={() => setIsAdminConsoleOpen(false)}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            currentUser={currentUser}
            onNavigateTab={handleTabChange}
            onQuickSearch={handleQuickSearchFromHome}
            savedRoutes={savedRoutes}
            routes={routes}
            onSelectRoute={setSelectedRoute}
          />
        );
      case 'finder':
        return (
          <RouteFinderScreen
            currentUser={currentUser}
            routes={routes}
            initialOrigin={finderOrigin}
            initialDestination={finderDestination}
            onSelectRoute={setSelectedRoute}
            onRouteSavedChange={refreshSavedRoutes}
          />
        );
      case 'terminals':
        return (
          <TerminalsScreen
            terminals={terminals}
            routes={routes}
            onSelectTerminal={setSelectedTerminal}
          />
        );
      case 'assistant':
        return <AssistedNavigationScreen />;
      case 'saved':
        return (
          <SavedRoutesScreen
            currentUser={currentUser}
            savedRoutes={savedRoutes}
            onSelectRoute={setSelectedRoute}
            onRoutesChanged={refreshSavedRoutes}
            onNavigateFinder={() => handleTabChange('finder')}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            currentUser={currentUser}
            onLogout={handleLogout}
            onSwitchUser={handleSwitchUser}
            onOpenAdminDashboard={() => setIsAdminConsoleOpen(true)}
            onOpenAndroidGuide={() => setIsGuideModalOpen(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        isMobileFrame={isMobileFrame}
        onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
        onOpenProjectGuide={() => setIsGuideModalOpen(true)}
        onNavigateToProfile={() => {
          setIsAdminConsoleOpen(false);
          setActiveTab('profile');
        }}
      />

      {/* Main Container Area */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4 md:p-6">
        {isMobileFrame ? (
          /* Android Phone Simulation Frame */
          <div className="w-full max-w-[430px] h-[860px] max-h-[calc(100vh-80px)] bg-slate-900 rounded-[44px] p-2.5 shadow-2xl ring-1 ring-slate-800 flex flex-col relative transition-all">
            {/* Phone Bezel Top - Camera & Sensor Notch */}
            <div className="h-6 w-full flex items-center justify-between px-6 text-white text-[11px] font-medium shrink-0 select-none">
              <span>9:41</span>
              {/* Dynamic Island / Speaker Pill */}
              <div className="w-20 h-4 bg-black rounded-full mx-auto -mt-1 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900/90 ml-auto mr-1.5" />
              </div>
              <div className="flex items-center gap-1.5">
                <SignalHigh className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <BatteryMedium className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Inner Android Screen Area */}
            <div className="flex-1 bg-slate-50 rounded-[34px] overflow-hidden flex flex-col shadow-inner relative">
              {/* Scrollable Screen Content */}
              <div className="flex-1 overflow-y-auto px-4 pt-3.5 pb-2">
                {renderScreenContent()}
              </div>

              {/* Bottom Android Navigation */}
              <BottomNavigation
                activeTab={activeTab}
                onTabChange={handleTabChange}
                savedCount={savedRoutes.length}
              />
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="h-4 flex items-center justify-center shrink-0">
              <div className="w-32 h-1 bg-slate-600 rounded-full" />
            </div>
          </div>
        ) : (
          /* Fullscreen Responsive Mode */
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[750px]">
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              {renderScreenContent()}
            </div>
            <BottomNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
              savedCount={savedRoutes.length}
            />
          </div>
        )}
      </main>

      {/* Route Details Modal */}
      <RouteDetailsModal
        route={selectedRoute}
        currentUser={currentUser}
        onClose={() => setSelectedRoute(null)}
        onRouteSavedChange={refreshSavedRoutes}
      />

      {/* Terminal Details Modal */}
      <TerminalDetailsModal
        terminal={selectedTerminal}
        routes={routes}
        onClose={() => setSelectedTerminal(null)}
        onSelectRoute={(route) => {
          setSelectedTerminal(null);
          setSelectedRoute(route);
        }}
      />

      {/* Android Project Source Code Guide Modal */}
      <AndroidProjectGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
