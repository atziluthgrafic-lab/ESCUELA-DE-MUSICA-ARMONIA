/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, Compass, Tv, MessageSquareDot, User, ShieldCheck } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  uncompletedLessonsCount?: number;
}

export default function BottomNav({ activeTab, onTabChange, uncompletedLessonsCount = 0 }: BottomNavProps) {
  const tabs = [
    { id: 'inicio' as ActiveTab, label: 'Inicio', icon: Home },
    { id: 'cursos' as ActiveTab, label: 'Cursos', icon: Compass },
    { id: 'aula' as ActiveTab, label: 'Mi Aula', icon: Tv, badge: uncompletedLessonsCount > 0 ? uncompletedLessonsCount : undefined },
    { id: 'whatsapp' as ActiveTab, label: 'WhatsApp', icon: MessageSquareDot },
    { id: 'perfil' as ActiveTab, label: 'Perfil', icon: User },
    { id: 'admin' as ActiveTab, label: 'Control', icon: ShieldCheck },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 pb-safe-bottom" id="bottom-navigation-bar">
      <div className="max-w-xl mx-auto flex items-center justify-around py-2 px-2 sm:px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-1.5 px-2.5 sm:px-3 rounded-xl transition-all duration-300 relative select-none ${
                isActive 
                  ? 'text-amber-400 font-bold scale-105' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              id={`tab-btn-${tab.id}`}
            >
              {/* Highlight background pill for active tab */}
              {isActive && (
                <span className="absolute inset-0 bg-slate-900 border border-amber-500/40 rounded-xl -z-10 animate-fade-in shadow-lg shadow-amber-500/10" />
              )}
              
              <div className="relative">
                <Icon size={22} className={isActive ? 'stroke-[2.5px] scale-110 text-amber-400' : 'stroke-[2px] text-slate-400'} />
                
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-4 flex items-center justify-center animate-bounce shadow">
                    {tab.badge}
                  </span>
                )}
              </div>
              
              <span className={`text-xs sm:text-xs font-bold font-sans tracking-tight ${isActive ? 'text-amber-400' : 'text-slate-300'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
