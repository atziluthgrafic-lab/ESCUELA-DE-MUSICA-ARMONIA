/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { User, Award, Flame, Calendar, BookOpen, Clock, Settings, LogOut, CheckCircle, ShieldCheck } from 'lucide-react';
import { Course } from '../types';

interface ProfileViewProps {
  unlockedCourses: Course[];
  completedLecturesCount: number;
  userName: string;
  userEmail: string;
  onEnterAdmin: () => void;
}

export default function ProfileView({
  unlockedCourses,
  completedLecturesCount,
  userName,
  userEmail,
  onEnterAdmin,
}: ProfileViewProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [showAdminGate, setShowAdminGate] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const matricula = 'ARM-2026-09812';

  const handleVerifyPin = (e: FormEvent) => {
    e.preventDefault();
    if (adminPin.trim() === 'admin123') {
      setPinError(false);
      setAdminPin('');
      setShowAdminGate(false);
      onEnterAdmin();
    } else {
      setPinError(true);
    }
  };

  const handleCopyMatricula = () => {
    navigator.clipboard.writeText(matricula);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Mock learning streak calendar days
  const streakDays = [
    { day: 'Lun', active: true, label: '26' },
    { day: 'Mar', active: true, label: '27' },
    { day: 'Mié', active: true, label: '28' },
    { day: 'Jue', active: true, label: '29' },
    { day: 'Vie', active: true, label: '30' },
    { day: 'Sáb', active: true, label: '31' },
    { day: 'Dom', active: false, label: '01' },
    { day: 'Lun', active: true, label: '02' }, // Today is Tuesday June 2 2026
    { day: 'Mar', active: true, label: '03' }, // Today active
    { day: 'Mié', active: false, label: '04' },
  ];

  const accomplishments = [
    {
      id: 'a1',
      title: 'Primer Aplauso 🌸',
      description: 'Ingresaste a la academia e hiciste tu primera consulta de instrumento.',
      unlocked: true,
      hint: 'Se desbloquea al unirte.'
    },
    {
      id: 'a2',
      title: 'Tono Perfecto 🎹',
      description: 'Interactuaste con el sintetizador acústico en el lobby.',
      unlocked: completedLecturesCount > 1,
      hint: 'Se desbloquea al reproducir tonos en la demo.'
    },
    {
      id: 'a3',
      title: 'Maestro de Armonía 🎻',
      description: 'Completaste al menos una lección con nota excelente.',
      unlocked: completedLecturesCount > 0,
      hint: 'Completa al menos 1 lección en Mi Aula.'
    },
    {
      id: 'a4',
      title: 'Sol Mayor Absoluto ☀️',
      description: 'Tocas sobre la pista de práctica de Sol Mayor por más de 1 minuto.',
      unlocked: unlockedCourses.length > 1,
      hint: 'Adquiere tu segundo curso avanzado.'
    },
  ];

  return (
    <div className="space-y-6 pb-24 max-w-md mx-auto pt-4" id="student-profile-panel">
      {/* Student credentials card widget */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 text-left relative overflow-hidden shadow-md" id="profile-card">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-brand-primary/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-brand-primary via-brand-secondary to-brand-tertiary rounded-full p-0.5 shadow-md">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-display font-black text-brand-primary text-xl uppercase">
              {userName.substring(0, 2).toUpperCase()}
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-display font-black text-slate-900 leading-none">
              {userName}
            </h3>
            <p className="text-[11px] text-slate-500 font-mono italic">
              {userEmail}
            </p>
            <div 
              onClick={handleCopyMatricula}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 hover:border-brand-primary/40 rounded text-[10px] font-mono text-slate-600 cursor-pointer transition-all hover:bg-slate-100"
              title="Copiar matrícula"
            >
              <span className="font-bold">Matrícula: {matricula}</span>
              <span className="text-[9px] text-brand-primary uppercase font-bold">
                {copiedId ? '¡Copiado!' : 'Copiar'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Numerical Stats Dashboard */}
      <section className="grid grid-cols-3 gap-3" id="profile-stats-grid">
        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl text-center space-y-1 shadow-sm">
          <Flame size={18} className="mx-auto text-orange-500" />
          <span className="text-xl font-mono font-black text-slate-900 block">8</span>
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">Días Streak</span>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl text-center space-y-1 shadow-sm">
          <BookOpen size={18} className="mx-auto text-brand-primary" />
          <span className="text-xl font-mono font-black text-slate-900 block">{unlockedCourses.length}</span>
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">Cursos Activos</span>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-2xl text-center space-y-1 shadow-sm">
          <CheckCircle size={18} className="mx-auto text-green-500" />
          <span className="text-xl font-mono font-black text-slate-900 block">{completedLecturesCount}</span>
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">Clases OK</span>
        </div>
      </section>

      {/* Visual Streaks grid calendar */}
      <section className="bg-white border border-slate-200 p-5 rounded-2xl text-left shadow-sm" id="streaks-calendar-panel">
        <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-3">
          <Calendar size={13} className="text-brand-tertiary" />
          Ritmo Semanal de Práctica
        </h4>
        
        <div className="grid grid-cols-5 gap-3">
          {streakDays.slice(0, 10).map((sd, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-xl text-center border relative overflow-hidden transition-all ${
                sd.active
                  ? 'bg-orange-50 border-orange-200 text-orange-700 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              {sd.active && (
                <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-orange-400 rounded-full animate-ping" />
              )}
              <span className="block text-[8px] font-mono opacity-60 uppercase">{sd.day}</span>
              <span className="block text-sm font-mono mt-0.5">{sd.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Honors Accomplishments Achievement Cards */}
      <section className="bg-white border border-slate-200 p-5 rounded-2xl text-left shadow-sm" id="accomplishments-panel">
        <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-3">
          <Award size={13} className="text-brand-secondary" />
          Insignias de Escenario
        </h4>

        <div className="space-y-3">
          {accomplishments.map((ac) => (
            <div
              key={ac.id}
              className={`p-3 rounded-xl border flex items-start gap-3.5 transition-all ${
                ac.unlocked
                  ? 'bg-slate-50/50 border-slate-200'
                  : 'bg-slate-50 border-slate-200 opacity-55'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                ac.unlocked 
                  ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary' 
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}>
                <Award size={18} />
              </div>
              <div className="space-y-0.5">
                <span className={`block text-xs font-semibold ${ac.unlocked ? 'text-slate-900' : 'text-slate-400 italic'}`}>
                  {ac.title}
                </span>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                  {ac.unlocked ? ac.description : ac.hint}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Access Gate specifically for administrators */}
      <section className="bg-white border border-slate-200 p-5 rounded-2xl text-left shadow-sm space-y-3" id="admin-access-gate-card">
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-brand-primary animate-pulse" />
              Acceso Administrativo
            </h4>
            <span className="text-[10px] text-slate-400 block font-semibold">Exclusivo para Profesores y Director escolar</span>
          </div>
          <button
            onClick={() => {
              setShowAdminGate(!showAdminGate);
              setPinError(false);
            }}
            className={`px-3 py-1 text-[10px] font-mono font-bold border rounded-lg transition-all cursor-pointer ${
              showAdminGate 
                ? 'bg-slate-100 border-slate-300 text-slate-700 font-extrabold' 
                : 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary hover:bg-brand-primary/20'
            }`}
            id="btn-toggle-admin-gate"
          >
            {showAdminGate ? 'Cancelar' : 'Entrar'}
          </button>
        </div>

        {showAdminGate ? (
          <form onSubmit={handleVerifyPin} className="space-y-3 pt-2 border-t border-slate-50">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px]">
                <label className="font-mono font-bold text-slate-400" htmlFor="admin-pin-passcode">PIN Académico de Acceso</label>
                <span className="font-mono text-brand-secondary font-black bg-brand-secondary/5 px-1.5 py-0.5 rounded">HINT: admin123</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  id="admin-pin-passcode"
                  value={adminPin}
                  onChange={(e) => {
                    setAdminPin(e.target.value);
                    if (pinError) setPinError(false);
                  }}
                  placeholder="Introduce el PIN de profesor..."
                  className={`flex-grow px-3 py-1.5 bg-slate-50 rounded-xl border text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-primary font-mono ${
                    pinError ? 'border-red-300 bg-red-50/20' : 'border-slate-200'
                  }`}
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 text-white text-xs font-mono font-bold rounded-xl transition-all cursor-pointer"
                  id="btn-submit-verify-pin"
                >
                  Acceder
                </button>
              </div>
            </div>
            {pinError && (
              <p className="text-[10px] text-red-500 font-mono font-bold animate-shake" id="error-pin-text">
                ⚠️ PIN incorrecto. Por favor introduce el código de demostración: admin123
              </p>
            )}
          </form>
        ) : (
          <p className="text-[10px] text-slate-400 italic">
            ¿Eres maestro de Armonía? Haz clic en entrar y utiliza el código de demostración para acceder al panel de control de cursos y moderar comentarios.
          </p>
        )}
      </section>

      {/* Settings log action panel */}
      <section className="flex gap-2">
        <button
          onClick={() => alert('¡Simulando acceso a ajustes de perfil escolar: Modificación de correo, teléfono o suscripción!')}
          className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-205 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-mono font-semibold rounded-xl tracking-wide transition-colors cursor-pointer"
        >
          Ajustes Cuenta
        </button>
        <button
          onClick={() => {
            if (confirm('¿Deseas cerrar sesión en el aula virtual de Armonía? Tu progreso se mantendrá guardado en local.')) {
              window.location.reload();
            }
          }}
          className="px-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 rounded-xl transition-colors cursor-pointer"
          title="Cerrar sesión"
        >
          <LogOut size={16} />
        </button>
      </section>
    </div>
  );
}
