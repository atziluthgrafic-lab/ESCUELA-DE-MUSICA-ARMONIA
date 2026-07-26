/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, GraduationCap } from 'lucide-react';

interface HeaderProps {
  onSearchToggle?: () => void;
  onInscribirme?: () => void;
  onGoToProfile?: () => void;
  studentName?: string;
}

export default function Header({ onInscribirme, onGoToProfile, studentName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-950/90 backdrop-blur-md border-b border-slate-800" id="app-header">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
        {/* Treble Clef SVG with gold accent */}
        <div className="relative w-10 h-10 flex items-center justify-center bg-slate-900 rounded-full p-1 border border-amber-500/30">
          <svg
            viewBox="0 0 120 180"
            fill="none"
            className="w-full h-full transform scale-110"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M60,150 C45,150 35,140 35,125 C35,110 50,95 65,100 C80,105 85,120 80,135 C75,145 62,150 55,140 C50,132 55,120 63,120 C70,120 72,128 68,133"
              stroke="#f59e0b"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              className="animate-pulse"
            />
            <path
              d="M60,15 C62,25 65,35 65,45 C65,55 50,75 40,85 C30,95 28,105 32,118 C35,130 45,138 58,138 C75,138 88,122 88,100 C88,78 70,62 55,50 C45,40 45,28 55,20 C62,12 75,18 78,30"
              stroke="#fbbf24"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M58,12 L58,165"
              stroke="#d97706"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="58" cy="165" r="7" fill="#f59e0b" />
          </svg>
        </div>
        
        <div>
          <span className="text-xl font-display font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
            Da Capo
          </span>
          <span className="hidden sm:block text-[9px] uppercase tracking-widest text-slate-400 font-mono">
            Academia Musical
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search simulation button */}
        <button
          className="p-2.5 rounded-full hover:bg-slate-900 text-slate-300 transition-colors relative group"
          title="Buscar cursos"
          id="btn-search-header"
        >
          <Search size={20} />
          <span className="absolute hidden group-hover:block top-12 right-0 bg-slate-900 text-[11px] p-2 rounded-xl border border-slate-700 text-slate-200 whitespace-nowrap shadow-xl">
            Buscar clases... (Inactivo)
          </span>
        </button>

        {studentName ? (
          <button
            onClick={onGoToProfile}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-200 text-sm font-medium transition-all shadow"
            id="btn-user-header"
          >
            <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] flex items-center justify-center font-black font-mono">
              {studentName.substring(0, 2).toUpperCase()}
            </div>
            <span className="hidden sm:inline text-xs font-mono font-bold">{studentName}</span>
          </button>
        ) : (
          <button
            onClick={onInscribirme}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-display text-xs font-bold shadow-md hover:shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            id="btn-inscribirme-header"
          >
            Inscribirme
          </button>
        )}
      </div>
    </header>
  );
}
