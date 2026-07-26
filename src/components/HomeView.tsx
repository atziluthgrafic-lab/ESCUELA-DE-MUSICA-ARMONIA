/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { 
  MessageCircle, 
  ShieldCheck, 
  Music, 
  Sparkles, 
  Clock, 
  Star, 
  Layers, 
  Play, 
  CheckCircle2, 
  Instagram, 
  Youtube, 
  PhoneCall,
  GraduationCap,
  Award,
  Users,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Volume2,
  Calendar,
  Send,
  MapPin,
  Heart,
  Check,
  Zap
} from 'lucide-react';
import { BookingData } from '../types';
import { playNote, NOTE_FREQS } from '../data';

interface HomeViewProps {
  onGoToCourses: () => void;
  onBookClass: (data: BookingData) => void;
  onOpenWhatsApp: () => void;
}

export default function HomeView({ onGoToCourses, onBookClass, onOpenWhatsApp }: HomeViewProps) {
  const [formData, setFormData] = useState<BookingData>({
    nombre: '',
    correo: '',
    whatsapp: '',
    instrumento: 'Piano',
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [soundMode, setSoundMode] = useState<'sine' | 'triangle' | 'sawtooth' | 'square'>('sine');
  const [lastPlayedNote, setLastPlayedNote] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.correo || !formData.whatsapp) {
      alert('Por favor completa todos los campos para tu reserva.');
      return;
    }
    onBookClass(formData);
    setIsSubmitted(true);
  };

  const handlePlayKey = (note: string, freq: number) => {
    setLastPlayedNote(note);
    playNote(freq, soundMode, 0.6);
  };

  const handlePlayScale = () => {
    const scale = ['DO', 'RE', 'MI', 'FA', 'SOL', 'LA', 'SI', 'DO5'];
    scale.forEach((n, idx) => {
      setTimeout(() => {
        setLastPlayedNote(n);
        playNote(NOTE_FREQS[n], soundMode, 0.4);
      }, idx * 180);
    });
  };

  const programsList = [
    {
      id: 'piano-maestro',
      category: 'adultos',
      title: 'PAQUETE ARMONÍA STAR',
      subtitle: 'Programa integral de piano, técnica, lectura de partituras e interpretación en vivo.',
      tag: 'Paquete Principal Star',
      level: 'Todos los niveles',
      modality: 'En Vivo HD & Aula Virtual',
      image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=600&auto=format&fit=crop',
      features: [
        '36 Masterclasses online en vivo y grabadas en HD',
        'Acceso ilimitado al simulador interactivo de teclado y solfeo',
        'Tutoría 1-a-1 personalizada con profesores de conservatorio'
      ],
      price: '$690.000 COP'
    }
  ];

  const filteredPrograms = selectedCategory === 'todos' 
    ? programsList 
    : programsList.filter(p => p.category === selectedCategory);

  const facultyMembers = [
    {
      name: 'Mtro. Esteban Calderón',
      role: 'Director Académico & Pianista',
      bio: 'Graduado del Conservatorio con más de 12 años guiando a pianistas desde cero hasta recitales internacionales.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
    },
    {
      name: 'Mtra. Sofía Mendoza',
      role: 'Coordinadora de Canto & Expresión',
      bio: 'Cantante lírica y popular. Especialista en entrenamiento vocal diafragmático para jóvenes y adultos.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop'
    },
    {
      name: 'Mtro. Mateo Ríos',
      role: 'Profesor de Guitarra & Producción',
      bio: 'Músico de sesión y productor. Experto en guitarra eléctrica, acústica y arreglos armónicos contemporáneos.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
    }
  ];

  const faqs = [
    {
      q: '¿A qué edad pueden ingresar los estudiantes a Da Capo Academia?',
      a: 'Aceptamos estudiantes desde los 3 años de edad en nuestro programa de Iniciación Musical Infantil. Para jóvenes y adultos no hay límite de edad; nuestros programas están diseñados para principiantes y avanzados.'
    },
    {
      q: '¿Necesito tener mi propio instrumento para tomar la primera clase?',
      a: 'Para la primera clase de cortesía no es obligatorio poseer instrumento. En nuestras instalaciones presenciales contamos con piano, teclados, guitarras y baterías. Si tomas la clase en línea, te asesoraremos para elegir el mejor instrumento según tu presupuesto.'
    },
    {
      q: '¿Cómo es el formato de las clases de música?',
      a: 'Ofrecemos clases individuales 1-a-1 altamente personalizadas, así como ensambles grupales. Puedes elegir la modalidad presencial en nuestras sedes o 100% en línea mediante streaming HD con aula virtual.'
    },
    {
      q: '¿Ofrecen presentaciones o recitales para los alumnos?',
      a: '¡Sí! Al finalizar cada trimestre organizamos recitales pedagógicos y conciertos en auditorio en vivo, donde los alumnos presentan sus avances acompañados de profesores o banda completa.'
    },
    {
      q: '¿Cómo puedo agendar mi clase de prueba gratuita o inscribirme?',
      a: 'Puedes completar el formulario de esta página o escribirnos directamente a nuestro WhatsApp oficial +57 311 754 1352. Un asesor académico se comunicará de inmediato para agendar tu horario.'
    }
  ];

  return (
    <div className="space-y-16 pb-24 font-sans text-slate-800" id="dacapo-cloned-home">
      
      {/* Announcement bar matching Da Capo Academia Banner style */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-3.5 sm:p-4 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left" id="dacapo-top-banner">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-bold shrink-0">
            <Zap size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">Matrículas Abiertas 2026</span>
              <span className="bg-emerald-500 text-slate-950 font-mono text-[10px] font-black px-2 py-0.5 rounded-full uppercase">20% Dcto</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Aprende música en la <strong className="text-white">Academia Musical Da Capo</strong>. ¡Asegura tu cupo hoy!
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/573117541352"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-1.5"
        >
          <MessageCircle size={16} fill="currentColor" />
          <span>WhatsApp +57 311 754 1352</span>
        </a>
      </div>

      {/* Cloned Da Capo Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-950 text-white p-6 sm:p-12 md:p-16 border border-slate-800 shadow-2xl" id="dacapo-hero-section">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-mono font-bold text-amber-400 uppercase tracking-widest shadow-sm">
              <Award size={14} />
              <span>DA CAPO ACADEMIA MUSICAL • FORMACIÓN DE EXCELENCIA</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight leading-none text-white">
              Aprende Música a Tu Ritmo con <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                Pasión y Técnica
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-medium mx-auto lg:mx-0">
              En <strong className="text-white">Da Capo Academia Musical</strong> combinamos metodologías tradicionales y modernas para despertar tu talento. Cursos personalizados de Piano, Canto, Guitarra, Violín, Batería e Iniciación Infantil con los mejores profesores graduados.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenWhatsApp}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-bold rounded-2xl shadow-xl shadow-[#25d366]/20 transition-all hover:scale-105 active:scale-95 text-sm cursor-pointer"
                id="btn-whatsapp-dacapo-hero"
              >
                <MessageCircle size={18} fill="currentColor" />
                <span>Atención en WhatsApp: +57 311 754 1352</span>
              </button>

              <button
                onClick={onGoToCourses}
                className="w-full sm:w-auto px-7 py-4 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 font-bold rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 text-sm cursor-pointer flex items-center justify-center gap-2"
                id="btn-ver-programas-hero"
              >
                <BookOpen size={18} />
                <span>Ver Cursos & Aula</span>
              </button>
            </div>

            {/* Guarantee badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Check size={14} /> Clases Presenciales & Online HD
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Star size={14} fill="currentColor" /> 4.9/5 ★ (480+ Alumnos)
              </span>
            </div>
          </div>

          {/* Right Image/Visual Card Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl group bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=800&auto=format&fit=crop" 
                alt="Clases de Piano y Música Da Capo" 
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              
              {/* Floating Badge top */}
              <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-mono font-bold text-amber-400 shadow">
                <Sparkles size={14} />
                <span>Sede Principal & Aula Virtual</span>
              </div>

              {/* Bottom Card Info */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-white">Academia Musical Da Capo</span>
                  <span className="text-emerald-400 font-mono font-bold text-[10px]">● Clases Activas</span>
                </div>
                <p className="text-xs text-slate-300">
                  Aprende la técnica perfecta, lectura de partituras y dominio de escenario con acompañamiento docente 1-a-1.
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <a href="tel:+573117541352" className="text-amber-400 hover:underline font-mono font-bold flex items-center gap-1">
                    <PhoneCall size={12} />
                    <span>Llamar: +57 311 754 1352</span>
                  </a>
                  <button 
                    onClick={handlePlayScale}
                    className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded font-mono font-bold transition-all text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 size={12} />
                    <span>Oír Escala Musical</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Highlights Bar (Da Capo en Cifras) */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center" id="dacapo-stats-bar">
        <div className="space-y-1">
          <div className="text-3xl sm:text-4xl font-display font-black text-slate-900">
            +1,500
          </div>
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            Alumnos Formados
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-3xl sm:text-4xl font-display font-black text-amber-600">
            12+
          </div>
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            Especialidades
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-3xl sm:text-4xl font-display font-black text-slate-900">
            10+ Años
          </div>
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            Trayectoria Académica
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-3xl sm:text-4xl font-display font-black text-emerald-600">
            100%
          </div>
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            Músicos Titulados
          </p>
        </div>
      </section>

      {/* Program Catalog & Filtering Section */}
      <section className="space-y-8" id="dacapo-programs-catalog">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-700 rounded-full text-xs font-mono font-bold uppercase tracking-widest inline-block">
            Nuestras Cátedras Musicales
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900">
            Programas Académicos Da Capo
          </h2>
          <p className="text-sm text-slate-600">
            Explora nuestros cursos diseñados para todas las edades y niveles. Elige la especialidad que más te apasiona y aprende con docentes calificados.
          </p>
        </div>

        {/* Filter Tab buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
          {[
            { id: 'todos', label: 'Todos los Cursos' },
            { id: 'infantil', label: 'Iniciación Infantil (3-6 yrs)' },
            { id: 'adultos', label: 'Jóvenes y Adultos' },
            { id: 'vocal', label: 'Técnica Vocal / Canto' },
            { id: 'produccion', label: 'Producción & Solfeo' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-slate-900 text-amber-400 shadow-md scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((prog) => (
            <div 
              key={prog.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img 
                    src={prog.image} 
                    alt={prog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-amber-400 border border-slate-800">
                    {prog.tag}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-emerald-500 text-slate-950 text-[10px] font-mono font-black px-2.5 py-1 rounded-lg shadow">
                    {prog.modality}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Nivel: {prog.level}</span>
                    <span className="font-bold text-amber-600">{prog.price}</span>
                  </div>

                  <h3 className="text-xl font-display font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                    {prog.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {prog.subtitle}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    {prog.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex gap-2">
                <button
                  onClick={onGoToCourses}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-mono transition-all text-center cursor-pointer shadow"
                >
                  Inscribirse
                </button>
                <a
                  href={`https://wa.me/573117541352?text=Hola,%20me%20interesa%20obtener%20información%20del%20curso%20de%20${encodeURIComponent(prog.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 rounded-xl transition-all flex items-center justify-center shrink-0 shadow"
                  title="Preguntar por WhatsApp"
                >
                  <MessageCircle size={18} fill="currentColor" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Sound Sampler / Music Lab Section */}
      <section className="bg-slate-950 text-white border border-slate-800 p-6 sm:p-10 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden" id="dacapo-sound-lab">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-1">
              <Volume2 size={14} />
              <span>Laboratorio Interactivo Da Capo</span>
            </div>
            <h3 className="text-2xl font-display font-black text-white">
              Sintetizador & Afinación de Instrumento
            </h3>
            <p className="text-xs text-slate-400">
              Presiona las teclas o reproduce la escala para probar el sonido sintetizado de nuestro sistema pedagógico.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <span className="text-xs font-mono text-slate-400 font-bold hidden sm:inline">Timbre:</span>
            {[
              { id: 'sine', label: 'Piano' },
              { id: 'triangle', label: 'Guitarra' },
              { id: 'sawtooth', label: 'Órgano' },
              { id: 'square', label: 'Sintetizador' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSoundMode(t.id as any)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  soundMode === t.id
                    ? 'bg-amber-500 text-slate-950 font-black shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Keyboard Keys Interactive Grid */}
        <div className="space-y-4">
          <div className="flex gap-1.5 sm:gap-2 justify-center overflow-x-auto py-2 px-1">
            {Object.keys(NOTE_FREQS).map((note) => {
              const isAccidental = note.includes('#');
              return (
                <button
                  key={note}
                  onClick={() => handlePlayKey(note, NOTE_FREQS[note])}
                  className={`min-w-[36px] sm:min-w-[48px] h-28 sm:h-36 rounded-b-xl flex flex-col justify-end pb-3 items-center font-mono text-[10px] font-bold shadow-lg transition-all transform origin-top hover:scale-105 active:scale-95 cursor-pointer ${
                    isAccidental 
                      ? 'bg-slate-800 hover:bg-amber-500 text-white border border-slate-700 -mx-2 z-10 h-20 sm:h-24' 
                      : 'bg-white hover:bg-amber-200 text-slate-900 border-b-4 border-slate-300'
                  } ${lastPlayedNote === note ? 'ring-2 ring-amber-400 bg-amber-300' : ''}`}
                >
                  <span className="opacity-70 text-[9px]">{note}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-400">Nota Actual:</span>
              <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30 min-w-[50px] text-center">
                {lastPlayedNote || 'Presiona una tecla'}
              </span>
            </div>

            <button
              onClick={handlePlayScale}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold font-mono rounded-xl shadow transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Play size={14} fill="currentColor" />
              <span>Escuchar Arpegio Do Mayor</span>
            </button>
          </div>
        </div>
      </section>

      {/* Methodology Section (Why Choose Da Capo Academia) */}
      <section className="space-y-8" id="dacapo-methodology-section">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 rounded-full text-xs font-mono font-bold uppercase tracking-widest inline-block">
            Metodología Da Capo
          </span>
          <h2 className="text-3xl font-display font-black text-slate-900">
            ¿Por qué Formarte con Nosotros?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Un modelo pedagógico que combina rigor técnico, sensibilidad artística y tecnología interactiva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 hover:shadow-lg hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 font-bold">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900">Atención 1 a 1</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cada alumno cuenta con un plan de estudio individualizado adaptado a sus metas y gustos musicales específicos.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 hover:shadow-lg hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 font-bold">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900">Profesores Titulados</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Docentes egresados de conservatorios universitarios con amplia trayectoria pedagógica e interpretativa.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 hover:shadow-lg hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 font-bold">
              <Sparkles size={24} />
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900">Recitales en Vivo</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Conciertos trimestrales en auditorio con público real para desarrollar la seguridad escénica y la expresión.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 hover:shadow-lg hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 font-bold">
              <BookOpen size={24} />
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900">Aula Virtual 24/7</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Acceso a partituras, lecciones en video HD y herramientas interactivas de teoría directamente desde tu perfil.
            </p>
          </div>
        </div>
      </section>

      {/* Teachers / Faculty Showcase Section */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8" id="dacapo-faculty">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-widest">
            Cuerpo Docente Da Capo
          </span>
          <h2 className="text-3xl font-display font-black text-slate-900">
            Aprende con los Mejores Maestros
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Músicos profesionales dedicados a guiar tu aprendizaje paso a paso con empatía y excelencia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {facultyMembers.map((fac, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-all text-center">
              <img 
                src={fac.image} 
                alt={fac.name} 
                className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-amber-500 shadow"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">{fac.name}</h3>
                <span className="text-xs font-mono font-bold text-amber-600 block">{fac.role}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "{fac.bio}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Courtesy Class Registration Form Section */}
      <section className="max-w-2xl mx-auto" id="dacapo-registration-form">
        <div className="bg-slate-950 border border-slate-800 text-white p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {isSubmitted ? (
            <div className="text-center space-y-6 py-6">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 size={36} />
              </div>

              <h3 className="text-2xl font-display font-black text-white">
                ¡Solicitud Registrada en Da Capo!
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                ¡Gracias <strong className="text-white">{formData.nombre}</strong>! Hemos recibido tu solicitud de información y clase de cortesía para <strong className="text-amber-400">{formData.instrumento}</strong>.
              </p>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs space-y-2 text-left font-mono">
                <div className="flex justify-between text-slate-400"><span>WhatsApp:</span> <span className="text-white font-bold">{formData.whatsapp}</span></div>
                <div className="flex justify-between text-slate-400"><span>Correo:</span> <span className="text-white font-bold">{formData.correo}</span></div>
                <div className="flex justify-between text-slate-400"><span>Número Oficial WhatsApp:</span> <span className="text-emerald-400 font-bold">+57 311 754 1352</span></div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/573117541352?text=Hola,%20acabo%20de%20solicitar%20mi%20clase%20de%20${encodeURIComponent(formData.instrumento)}%20a%20nombre%20de%20${encodeURIComponent(formData.nombre)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow"
                >
                  <MessageCircle size={16} fill="currentColor" />
                  <span>Confirmar por WhatsApp (+57 311 754 1352)</span>
                </a>

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono font-bold transition-all"
                >
                  Reservar Otra Clase
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 relative z-10">
              <div className="text-center space-y-2">
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-mono font-bold uppercase tracking-widest inline-block">
                  Reserva sin Costo
                </span>
                <h2 className="text-3xl font-display font-black text-white">
                  Agenda tu Clase de Prueba Gratis
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Completa tus datos y un asesor de <strong className="text-white">Da Capo Academia Musical</strong> te contactará por WhatsApp para coordinar tu primera clase.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-mono text-slate-400 font-bold mb-1 uppercase tracking-wider">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Camila Torres"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 font-bold mb-1 uppercase tracking-wider">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="camila@ejemplo.com"
                      value={formData.correo}
                      onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 font-bold mb-1 uppercase tracking-wider">
                      WhatsApp / Celular
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+57 311 754 1352"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 font-bold mb-1 uppercase tracking-wider">
                    Especialidad de Interés
                  </label>
                  <select
                    value={formData.instrumento}
                    onChange={(e) => setFormData({ ...formData, instrumento: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
                  >
                    <option value="Piano">Piano & Teclados (Clásico / Pop)</option>
                    <option value="Iniciacion">Iniciación Musical Infantil (3-6 yrs)</option>
                    <option value="Canto">Técnica Vocal & Canto</option>
                    <option value="Guitarra">Guitarra Acústica / Eléctrica</option>
                    <option value="Violin">Violín & Cuerdas Sinfónicas</option>
                    <option value="Bateria">Batería & Percusión Moderna</option>
                    <option value="Produccion">Producción Musical & Solfeo</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-display font-black rounded-xl shadow-lg transition-all text-sm font-extrabold uppercase tracking-wider cursor-pointer mt-2"
                >
                  Quiero Mi Clase de Prueba Gratis
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="space-y-6 max-w-3xl mx-auto" id="dacapo-faq-section">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-display font-black text-slate-900">
            Preguntas Frecuentes
          </h2>
          <p className="text-xs text-slate-600">
            Resolvemos tus dudas sobre el inicio de clases en Da Capo Academia.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between font-bold text-sm text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} className="text-amber-600 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact & Location Footer Banner */}
      <section className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6" id="dacapo-contact-footer">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-display font-black text-amber-400">
            Da Capo Academia Musical
          </h3>
          <p className="text-xs text-slate-300 max-w-md">
            Atención personalizada de Lunes a Sábado de 8:00 AM a 7:00 PM. ¡Escríbenos y comienza a tocar hoy mismo!
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <PhoneCall size={14} className="text-emerald-400" />
              WhatsApp Directo: <strong className="text-white">+57 311 754 1352</strong>
            </span>
          </div>
        </div>

        <a
          href="https://wa.me/573117541352"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-bold text-xs rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2"
        >
          <MessageCircle size={18} fill="currentColor" />
          <span>Contactar por WhatsApp (+57 311 754 1352)</span>
        </a>
      </section>

      {/* Floating Action Button for WhatsApp */}
      <div className="fixed bottom-20 right-6 z-40 hidden sm:block">
        <a
          href="https://wa.me/573117541352"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-bold rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all text-xs cursor-pointer border-2 border-white"
          title="Consúltanos en WhatsApp +57 311 754 1352"
        >
          <MessageCircle size={18} fill="currentColor" />
          <span>Da Capo WhatsApp +57 311 754 1352</span>
        </a>
      </div>

    </div>
  );
}
