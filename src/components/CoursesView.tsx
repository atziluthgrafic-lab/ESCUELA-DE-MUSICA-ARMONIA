/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Compass, BookOpen, Clock, Lock, Unlock, CheckCircle2, ShieldCheck, CreditCard } from 'lucide-react';
import { Course } from '../types';

interface CoursesViewProps {
  courses: Course[];
  onUnlockCourse: (courseId: string) => void;
  onGoToClassroom: (courseId: string) => void;
}

export default function CoursesView({ courses, onUnlockCourse, onGoToClassroom }: CoursesViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  const categories = ['Todos', 'Piano', 'Guitarra', 'Ukelele', 'Violín', 'Producción', 'Teoría'];

  const filteredCourses = activeCategory === 'Todos'
    ? courses
    : courses.filter(c => c.category === activeCategory);

  const handleOpenCheckout = (course: Course) => {
    setSelectedCourse(course);
    setCardNumber('');
    setCardName('');
    setPaySuccess(false);
    setIsPaying(false);
  };

  const handleSimulatePayment = (e: FormEvent) => {
    e.preventDefault();
    setIsPaying(true);
    
    setTimeout(() => {
      setIsPaying(false);
      setPaySuccess(true);
      if (selectedCourse) {
        onUnlockCourse(selectedCourse.id);
      }
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-24" id="courses-view-container">
      {/* Dynamic Promotion Header Banner */}
      <section className="text-center space-y-3 pt-6 px-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 border border-brand-primary/30 rounded-full text-xs font-mono font-bold text-brand-primary uppercase tracking-wider">
          <Compass size={12} />
          Academia de Excelencia
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 leading-tight">
          Encuentra tu <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-tertiary bg-clip-text text-transparent">Ritmo Maestro</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed font-medium">
          Un programa integral de 36 masterclasses diseñadas para músicos modernos. Aprende a leer partituras desde tu primera lección, desde teoría clásica hasta producción digital.
        </p>
      </section>

      {/* Category Pills Slider */}
      <section className="px-4 max-w-3xl mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none justify-start sm:justify-center items-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider transition-all uppercase shrink-0 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-md shadow-brand-primary/20 font-bold scale-105 border-none'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm'
              }`}
              id={`filter-pill-${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Courses Catalog Card Grid */}
      <section className="px-4 max-w-5xl mx-auto">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12 px-6 bg-slate-900/60 border border-slate-800 rounded-2xl max-w-md mx-auto space-y-3 shadow-xl animate-fade-in">
            <Compass className="w-10 h-10 mx-auto text-amber-500 animate-spin-slow" />
            <h3 className="text-base font-bold text-slate-200">No hay cursos disponibles en esta categoría</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Puedes agregar nuevos cursos fácilmente para esta u otras categorías desde el <strong className="text-amber-400">Panel de Control Escolar</strong>.
            </p>
          </div>
        ) : (
          <div className={
            filteredCourses.length === 1
              ? "max-w-xl mx-auto"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          }>
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between group h-full shadow-xl hover:shadow-2xl hover:-translate-y-1"
                id={`course-card-${course.id}`}
              >
                <div>
                  {/* Visual Image container with Category Label Badge */}
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    {/* Badge top-right */}
                    <span className={`absolute top-4 right-4 px-2.5 py-1 rounded-md text-[9px] font-mono font-black uppercase tracking-wider shadow-md ${
                      course.type === 'En Vivo' 
                        ? 'bg-amber-500 text-slate-950' 
                        : course.type === 'En Línea' 
                          ? 'bg-emerald-500 text-slate-950' 
                          : 'bg-blue-500 text-white'
                    }`}>
                      {course.type}
                    </span>
                    
                    {/* Category Pill bottom-left */}
                    <span className="absolute bottom-3 left-4 px-2.5 py-1 rounded bg-black/80 text-amber-400 text-[10px] font-mono border border-amber-500/20 font-bold shadow">
                      🎷 {course.category}
                    </span>
                  </div>

                  {/* Content space */}
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-xl font-display font-black text-slate-100 group-hover:text-amber-400 transition-colors leading-snug">
                        {course.title}
                      </h3>
                      <span className="text-xl font-mono font-black text-amber-400 shrink-0">
                        {typeof course.price === 'string' && course.price.includes('$') ? course.price : `$${course.price}`}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {course.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 pt-3 border-t border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={13} className="text-amber-400" />
                        <span>{course.modulesCount || 2} Módulos</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-emerald-400" />
                        <span>{course.durationInMonths || 3} Meses Acceso</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer action button */}
                <div className="p-6 pt-0">
                  {course.unlocked ? (
                    <button
                      onClick={() => onGoToClassroom(course.id)}
                      className="w-full py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold rounded-xl tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02]"
                      id={`btn-explore-${course.id}`}
                    >
                      <Unlock size={14} />
                      ACCEDER AL AULA VIRTUAL
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenCheckout(course)}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-display text-xs font-black rounded-xl tracking-wide uppercase transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
                      id={`btn-pay-${course.id}`}
                    >
                      <Lock size={14} />
                      PAGAR Y DESBLOQUEAR
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Checkout Simulator Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm" id="checkout-modal-overlay">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 relative overflow-hidden shadow-2xl" id="checkout-modal">
            {/* Neon Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-lg font-display font-black text-slate-900">
                Simulador de Pago Seguro
              </h3>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-slate-500 hover:text-slate-800 text-xs px-2.5 py-1 bg-slate-100 border border-slate-200 rounded hover:bg-slate-200 cursor-pointer font-bold transition-all"
              >
                Cerrar
              </button>
            </div>

            {paySuccess ? (
              <div className="text-center py-6 space-y-4" id="payout-success-state">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-200">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="text-xl font-display font-black text-slate-900">
                  ¡Pago Simulado con Éxito!
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Has desbloqueado exitosamente el curso <strong className="text-slate-900">{selectedCourse.title}</strong> en tu cuenta de estudiante.
                </p>
                <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-lg text-left text-xs font-mono space-y-1.5 shadow-inner">
                  <div className="flex justify-between text-slate-500"><span>Concepto:</span> <span className="text-slate-800 font-bold">{selectedCourse.title}</span></div>
                  <div className="flex justify-between text-slate-500"><span>Importe simulado:</span> <span className="text-brand-secondary font-bold">{typeof selectedCourse.price === 'string' && selectedCourse.price.includes('$') ? selectedCourse.price : `$${selectedCourse.price} USD`}</span></div>
                  <div className="flex justify-between text-slate-500"><span>Transacción ID:</span> <span className="text-slate-400 font-bold">TX-ARM-{Math.floor(100000 + Math.random() * 900000)}</span></div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      onGoToClassroom(selectedCourse.id);
                      setSelectedCourse(null);
                    }}
                    className="flex-1 py-2.5 bg-brand-primary text-white font-bold text-xs rounded-lg uppercase cursor-pointer"
                  >
                    Entrar a Clase Ahora
                  </button>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg font-bold cursor-pointer transition-all"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSimulatePayment} className="space-y-4 pt-4">
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between shadow-inner">
                  <div>
                    <h4 className="text-xs font-mono text-slate-500 uppercase font-bold">Curso Seleccionado</h4>
                    <span className="text-sm font-bold text-slate-900 block truncate">{selectedCourse.title}</span>
                  </div>
                  <span className="text-base font-mono font-bold text-brand-secondary shrink-0">{typeof selectedCourse.price === 'string' && selectedCourse.price.includes('$') ? selectedCourse.price : `$${selectedCourse.price}`}</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 font-bold mb-1">Nombre en la tarjeta (Simulador)</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Sofia Mendoza"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 text-xs placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-all font-mono shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-500 font-bold mb-1">Número de Tarjeta de Desbloqueo</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                          setCardNumber(val);
                        }}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 text-xs placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-all font-mono shadow-inner"
                      />
                      <CreditCard size={14} className="absolute left-3 top-3 text-slate-400" />
                    </div>
                    <p className="text-[10px] text-brand-primary font-bold mt-1 font-mono">
                      💳 Puedes ingresar cualquier número ficticio para simular la pasarela.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-mono text-slate-500 font-bold mb-1">Vence</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-brand-primary transition-all font-mono shadow-inner placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-500 font-bold mb-1">CVC</label>
                      <input
                        type="password"
                        required
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-brand-primary transition-all font-mono shadow-inner placeholder-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-500 px-1 py-1">
                  <ShieldCheck size={14} className="text-green-600 font-bold" />
                  <span className="font-semibold">Cifrado SSL de 256 bits sin cobros reales.</span>
                </div>

                <button
                  type="submit"
                  disabled={isPaying}
                  className="w-full py-3 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-tertiary disabled:opacity-50 text-white font-display font-black rounded-lg text-xs uppercase tracking-wider transition-all shadow cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isPaying ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Procesando pago...
                    </>
                  ) : (
                    `Completar Pago Escolar (${typeof selectedCourse.price === 'string' && selectedCourse.price.includes('$') ? selectedCourse.price : `$${selectedCourse.price}`})`
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
