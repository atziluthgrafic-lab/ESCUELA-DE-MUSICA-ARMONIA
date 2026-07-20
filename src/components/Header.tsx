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
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-slate-100" id="app-header">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
        {/* Colorful Treble Clef Treble SVG resembling the logo */}
        <div className="relative w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full p-1 border border-slate-100">
          <svg
            viewBox="0 0 120 180"
            fill="none"
            className="w-full h-full transform scale-110"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Swirls with brand colors: Pink, blue, yellow, green */}
            <path
              d="M60,150 C45,150 35,140 35,125 C35,110 50,95 65,100 C80,105 85,120 80,135 C75,145 62,150 55,140 C50,132 55,120 63,120 C70,120 72,128 68,133"
              stroke="#ffb0cc"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              className="animate-pulse"
            />
            <path
              d="M60,15 C62,25 65,35 65,45 C65,55 50,75 40,85 C30,95 28,105 32,118 C35,130 45,138 58,138 C75,138 88,122 88,100 C88,78 70,62 55,50 C45,40 45,28 55,20 C62,12 75,18 78,30"
              stroke="#83cfff"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M58,12 L58,165"
              stroke="#ffb786"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Loop circles */}
            <circle cx="58" cy="165" r="7" fill="#ffb786" />
          </svg>
        </div>
        
        <div>
          <span className="text-xl font-display font-extrabold tracking-tight bg-gradient-to-r from-[#83cfff] via-[#ffb0cc] to-[#ffb786] bg-clip-text text-transparent">
            Armonía
          </span>
          <span className="hidden sm:block text-[9px] uppercase tracking-widest text-slate-400 font-mono">
            Escuela de Música
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search simulation button */}
        <button
          className="p-2.5 rounded-full hover:bg-slate-50 text-slate-600 transition-colors relative group"
          title="Buscar cursos"
          id="btn-search-header"
        >
          <Search size={20} />
          <span className="absolute hidden group-hover:block top-12 right-0 bg-white text-[11px] p-1.5 rounded border border-slate-200 whitespace-nowrap shadow-md">
            Buscar clases... (Inactivo)
          </span>
        </button>

        {studentName ? (
          <button
            onClick={onGoToProfile}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:border-brand-primary/50 text-slate-700 text-sm font-medium transition-all"
            id="btn-user-header"
          >
            <div className="w-5 h-5 rounded-full bg-brand-primary text-white text-[10px] flex items-center justify-center font-bold font-mono">
              {studentName.substring(0, 2).toUpperCase()}
            </div>
            <span className="hidden sm:inline text-xs">{studentName}</span>
          </button>
        ) : (
          <button
            onClick={onInscribirme}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#83cfff] to-[#ffb0cc] text-slate-950 font-display text-xs font-bold shadow-md hover:shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            id="btn-inscribirme-header"
          >
            Inscribirme
          </button>
        )}
      </div>
    </header>
  );
}
