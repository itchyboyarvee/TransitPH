import React from 'react';
import { Home, Compass, Building2, Languages, Bookmark, User as UserIcon } from 'lucide-react';

export type NavTab = 'home' | 'finder' | 'terminals' | 'assistant' | 'saved' | 'profile';

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  savedCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  savedCount = 0,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'finder' as NavTab, label: 'Routes', icon: Compass },
    { id: 'terminals' as NavTab, label: 'Terminals', icon: Building2 },
    { id: 'assistant' as NavTab, label: 'Assistant', icon: Languages },
    { id: 'saved' as NavTab, label: 'Saved', icon: Bookmark, badge: savedCount },
    { id: 'profile' as NavTab, label: 'Profile', icon: UserIcon },
  ];

  return (
    <nav className="bg-white border-t border-slate-200 px-1 py-1 flex items-center justify-around shadow-lg z-20 select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-150 relative min-w-[54px] ${
              isActive
                ? 'text-emerald-700 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold' : 'font-normal'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
