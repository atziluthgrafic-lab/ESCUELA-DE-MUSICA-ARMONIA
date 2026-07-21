/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { MessageCircle, ShieldCheck, Music, Sparkles, Clock, Star, Layers, Play, CheckCircle2, Instagram, Youtube, PhoneCall } from 'lucide-react';
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
  const [videoPlaying, setVideoPlaying] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.correo || !formData.whatsapp) {
      alert('Por favor completa todos los campos.');
      return;
    }
    onBookClass(formData);
    setIsSubmitted(true);
  };

  const handlePlayToneDemo = () => {
    // Play a lovely major arpeggio to simulate instrumental vibe
    const notes = ['DO', 'MI', 'SOL', 'DO5'];
    notes.forEach((note, index) => {
      setTimeout(() => {
        playNote(NOTE_FREQS[note], 'sine', 0.5);
      }, index * 200);
    });
  };

  return (
    <div className="space-y-16 pb-24" id="home-view-container">
      {/* Hero Section */}
      <section className="text-center px-4 pt-10 max-w-3xl mx-auto space-y-6" id="hero-section">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-primary/10 border border-brand-primary/30 rounded-full text-xs font-mono font-bold text-brand-primary uppercase tracking-widest animate-pulse">
          <Sparkles size={12} />
          Escuela de Música Elite
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight leading-tight text-slate-900">
          Despierta el Ritmo <br />
          <span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-tertiary bg-clip-text text-transparent">
            que Llevas Dentro
          </span>
        </h1>
        
        <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
          <strong className="text-brand-primary font-extrabold font-mono">#FormatoDigital</strong> es nuestro sistema metodológico de aprendizaje musical digital diseñado para acelerar el proceso de comprensión, retención y ejecución musical mediante contenidos audiovisuales interactivos y evaluación personalizada.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onOpenWhatsApp}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-black font-semibold rounded-full shadow-lg shadow-[#25d366]/20 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all text-sm cursor-pointer font-bold"
            id="btn-whatsapp-hero"
          >
            <MessageCircle size={18} fill="currentColor" />
            <span>WhatsApp (+57 311 754 1352)</span>
          </button>
          
          <button
            onClick={onGoToCourses}
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-brand-primary hover:text-brand-primary/85 border-2 border-brand-primary/70 font-bold rounded-full font-display shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm cursor-pointer"
            id="btn-cursos-hero"
          >
            Ver Cursos
          </button>
        </div>
      </section>

      {/* Hero Video Player / Music Synth Promo Segment */}
      <section className="px-4 max-w-4xl mx-auto" id="promo-video-section">
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0f172a] group">
          {videoPlaying ? (
            <div className="absolute inset-0 bg-brand-bg flex flex-col items-center justify-center p-6 space-y-6">
              <span className="text-xs font-mono text-[#ffb0cc] uppercase tracking-widest animate-pulse">
                🔊 Sintetizador Interactivo Activado
              </span>
              <p className="text-center text-sm text-[#bdc8d1] max-w-md">
                Toca las notas para experimentar el sonido puro de la afinación Armonía.
              </p>
              
              {/* Keyboard visual rendering for play element */}
              <div className="flex gap-2 p-4 bg-black/40 rounded-xl border border-white/10 w-full max-w-lg justify-center overflow-x-auto">
                {Object.keys(NOTE_FREQS).slice(0, 10).map((note) => (
                  <button
                    key={note}
                    onClick={() => playNote(NOTE_FREQS[note], 'triangle', 0.6)}
                    className="flex-1 min-w-[32px] h-20 bg-white hover:bg-[#83cfff] active:bg-[#ffb0cc] rounded-b text-slate-900 flex flex-col justify-end pb-2 items-center text-[10px] font-bold shadow transition-all cursor-pointer transform origin-top hover:scale-105 active:scale-95"
                  >
                    <span className="text-[8px] font-mono opacity-60">
                      {note.includes('#') ? '' : note}
                    </span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setVideoPlaying(false)}
                className="text-xs text-[#bdc8d1] hover:text-white underline"
              >
                Volver al video promocional
              </button>
            </div>
          ) : (
            <>
              {/* Visual image resembling the studio/synthesizer background */}
              <img
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=900&auto=format&fit=crop"
                alt="Estudio de producción Armonía"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              
              {/* Center Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => {
                    setVideoPlaying(true);
                    handlePlayToneDemo();
                  }}
                  className="w-16 h-16 rounded-full bg-white/10 hover:bg-[#ffb0cc] hover:text-slate-950 text-white flex items-center justify-center backdrop-blur-md border border-white/30 transform hover:scale-110 active:scale-95 transition-all shadow-lg cursor-pointer"
                  id="play-studio-demo"
                >
                  <Play size={26} className="ml-1" fill="currentColor" />
                </button>
              </div>
              
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs font-mono text-white/70">
                <span>Estudio Virtual Armonía v2.1</span>
                <span>Clic para sonar 🎹</span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Courtesy Class Reservation Form Section */}
      <section className="px-4 max-w-xl mx-auto" id="courtesy-reservation-section">
        <div className="bg-white border border-slate-200 p-8 rounded-2xl relative overflow-hidden shadow-xl" id="booking-card">
          {/* Neon background glows */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-secondary/15 rounded-full blur-3xl pointer-events-none" />

          {isSubmitted ? (
            <div className="text-center space-y-6 py-8" id="booking-success-state">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-200">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-display font-black text-slate-900">
                ¡Clase Reservada con Éxito!
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                ¡Hola <strong className="text-slate-900">{formData.nombre}</strong>! Tu solicitud para coordinar una clase de cortesía de <strong className="text-brand-primary">{formData.instrumento}</strong> ha sido registrada.
              </p>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-left space-y-2">
                <div className="flex justify-between"><span className="text-slate-500">Instrumento:</span> <span className="font-bold text-brand-primary">{formData.instrumento}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">WhatsApp para contacto:</span> <span className="font-bold text-slate-800">{formData.whatsapp}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Código de ticket:</span> <span className="font-mono text-brand-secondary font-bold">ARM-FREE-{Math.floor(1000 + Math.random() * 9000)}</span></div>
              </div>
              <p className="text-xs text-slate-500">
                Un asesor musical se comunicará contigo de inmediato para agendar el horario de tu primera clase 100% gratuita. ¡Prepárate para tocar!
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold tracking-wider transition-colors cursor-pointer"
              >
                Reservar otra clase
              </button>
            </div>
          ) : (
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <h2 className="text-2xl font-display font-black text-slate-950">
                  Reserva tu Clase de Cortesía
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Déjanos tus datos y un asesor académico se pondrá en contacto contigo para agendar tu primera sesión totalmente gratis. Descubre por qué somos la escuela de formación musical moderna #1 del país.
                </p>
              </div>

              {/* Benefits bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 text-xs">
                <div className="flex items-center gap-2.5 text-slate-700">
                  <div className="w-7 h-7 rounded-lg bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary">
                    <ShieldCheck size={14} />
                  </div>
                  <span className="font-medium text-slate-700">Metodología Certificada</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <div className="w-7 h-7 rounded-lg bg-brand-secondary/10 border border-brand-secondary/30 flex items-center justify-center text-brand-secondary">
                    <Music size={14} />
                  </div>
                  <span className="font-medium text-slate-700">Clases en Vivo HD</span>
                </div>
              </div>

              {/* Form elements */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-mono text-slate-500 font-bold mb-1.5 uppercase tracking-wide">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 font-bold mb-1.5 uppercase tracking-wide">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="juan@ejemplo.com"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 font-bold mb-1.5 uppercase tracking-wide">
                    WhatsApp / Teléfono
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+57 311 754 1352 o tu celular"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 font-bold mb-1.5 uppercase tracking-wide">
                    Especialidad de Interés
                  </label>
                  <select
                    value={formData.instrumento}
                    onChange={(e) => setFormData({ ...formData, instrumento: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all cursor-pointer shadow-inner"
                  >
                    <option value="Piano">Piano Maestro (Teclados)</option>
                    <option value="Guitarra">Guitarra Acústica/Eléctrica</option>
                    <option value="Ukelele">Ukelele Pop</option>
                    <option value="Violín">Violín Clásico</option>
                    <option value="Producción">Producción Musical & DAW</option>
                    <option value="Teoría">Teoría y Armonía Estudiantil</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-brand-secondary to-brand-tertiary hover:brightness-110 active:scale-95 text-white font-display font-black rounded-lg shadow-md hover:shadow-brand-secondary/20 transition-all text-sm mt-4 cursor-pointer font-extrabold uppercase tracking-wider"
                >
                  Quiero mi Clase Gratis
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Why Armonia Pillars Info Cards */}
      <section className="px-4 max-w-4xl mx-auto space-y-8" id="why-armonia-section">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display font-black text-slate-900">
            ¿Por qué Armonía?
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto font-medium">
            Elevamos tu educación musical a través de una experiencia inmersiva y tecnológica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-4 hover:border-brand-primary/40 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
              <Layers size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-display font-bold text-slate-900">Profesores Activos</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aprende de músicos profesionales que tocan en las mejores orquestas, bandas independientes y productores del país. Experiencia real en escenarios reales.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-4 hover:border-brand-secondary/40 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center text-brand-secondary shrink-0">
              <Clock size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-display font-bold text-slate-900">Horarios Flexibles</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nos adaptamos a tu ritmo de vida. Clases en vivo (individuales) de lunes a domingo. Grabación automática de cada sesión, material de estudio y simuladores musicales siempre disponibles.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-4 hover:border-brand-tertiary/40 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-brand-tertiary/10 border border-brand-tertiary/20 flex items-center justify-center text-brand-tertiary shrink-0">
              <Star size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-display font-bold text-slate-900">Recitales en Vivo HD</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Comparte tu talento tocando en vivo en nuestros recitales online semestrales transmitidos por streaming en HD para tu familia y amigos. Grabación profesional multicanal incluida.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-4 hover:border-green-500/40 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-600 shrink-0">
              <Music size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-display font-bold text-slate-900">Tecnología de Punta</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fomentamos el aprendizaje asistido con herramientas visuales interactivas exclusivas (como nuestra aula virtual con simuladores acústicos de última generación).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Scene Image Gallery Match */}
      <section className="px-4 max-w-4xl mx-auto space-y-6" id="scene-gallery-section">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono text-brand-secondary font-bold uppercase tracking-wider">Síguenos en el Escenario</span>
          <h2 className="text-2xl font-display font-black text-slate-900">
            Nuestros Alumnos en Acción
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Mira el progreso de nuestros alumnos y tips diarios de teoría musical en redes.
          </p>

          <div className="flex justify-center gap-4 py-2">
            <a href="https://instagram.com" target="_blank" className="p-2 bg-white/5 border border-white/10 rounded-full text-[#dae2fd] hover:text-[#ffb0cc] hover:bg-[#ffb0cc]/10 transition-all">
              <Instagram size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" className="p-2 bg-white/5 border border-white/10 rounded-full text-[#dae2fd] hover:text-red-400 hover:bg-red-400/10 transition-all">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* 4 Grid image matching the prompt representation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-slate-950">
            <img
              src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&auto=format&fit=crop"
              alt="Guitarra clásica escenario"
              className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[8px] font-mono text-white">
              @andres_guitar
            </div>
          </div>

          <div className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-slate-950">
            <img
              src="https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=300&auto=format&fit=crop"
              alt="Teclado y clases piano"
              className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#ffb0cc]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[8px] font-mono text-white">
              @sofia_piano
            </div>
          </div>

          <div className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-slate-950">
            <img
              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop"
              alt="Estudiante en teclado"
              className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-brand-tertiary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[8px] font-mono text-white">
              @clases_duo
            </div>
          </div>

          <div className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-slate-950">
            <img
              src="https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=300&auto=format&fit=crop"
              alt="Batería acústica"
              className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[8px] font-mono text-white">
              @recital_ritmo
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button for WhatsApp */}
      <div className="fixed bottom-20 right-6 z-40 hidden sm:block">
        <a
          href="https://wa.me/573117541352"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all text-xs cursor-pointer"
          title="Consúltanos en WhatsApp +57 311 754 1352"
        >
          <PhoneCall size={18} fill="currentColor" />
          <span>WhatsApp +57 311 754 1352</span>
        </a>
      </div>
    </div>
  );
}
