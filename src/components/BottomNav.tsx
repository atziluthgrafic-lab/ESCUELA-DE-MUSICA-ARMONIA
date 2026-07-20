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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-100 pb-safe-bottom" id="bottom-navigation-bar">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-300 relative select-none ${
                isActive 
                  ? 'text-brand-primary font-bold scale-105' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              id={`tab-btn-${tab.id}`}
            >
              {/* Highlight background pill for active tab */}
              {isActive && (
                <span className="absolute inset-0 bg-slate-50 rounded-xl -z-10 animate-fade-in" />
              )}
              
              <div className="relative">
                <Icon size={20} className={isActive ? 'stroke-[2.5px] scale-110 text-brand-primary' : 'stroke-[2px]'} />
                
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#ff45a1] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-4 flex items-center justify-center animate-bounce">
                    {tab.badge}
                  </span>
                )}
              </div>
              
              <span className="text-[10px] tracking-wide font-mono">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
