/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent, useRef } from 'react';
import { Play, Pause, ChevronRight, FileCode, CheckSquare, Download, PlayCircle, Lock, Music, MessageSquare, BookOpen, Volume2, SkipForward, AlertCircle } from 'lucide-react';
import { Course, Module, Lesson, Comment } from '../types';
import { playNote, NOTE_FREQS, CIRCLE_NODES, QuintasNode } from '../data';

interface ClassroomViewProps {
  course: Course;
  modules: Module[];
  comments: Comment[];
  onCompleteLesson: (courseId: string, moduleId: string, lessonId: string) => void;
  onPostComment: (comment: Comment) => void;
}

export default function ClassroomView({
  course,
  modules,
  comments,
  onCompleteLesson,
  onPostComment,
}: ClassroomViewProps) {
  const [activeModule, setActiveModule] = useState<Module>(modules[0] || {} as Module);
  const [activeLesson, setActiveLesson] = useState<Lesson>({} as Lesson);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState<'resumen' | 'transcrip' | 'disc'>('resumen');
  const [newComment, setNewComment] = useState('');
  const [selectedCircleNode, setSelectedCircleNode] = useState<QuintasNode | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [backingTrackPlaying, setBackingTrackPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(15);
  const [selectedSubVideoId, setSelectedSubVideoId] = useState<string | null>(null);

  // Metronome Section State
  const [metronomePlaying, setMetronomePlaying] = useState(false);
  const [metronomeBpm, setMetronomeBpm] = useState(120);
  const [metronomeSignature, setMetronomeSignature] = useState(4); // 2, 3, 4, 6
  const [metronomeBeat, setMetronomeBeat] = useState(1);
  const [metronomeVolume, setMetronomeVolume] = useState(70);
  const [tapActive, setTapActive] = useState(false);
  const [metronomeFlashEnabled, setMetronomeFlashEnabled] = useState(true);
  const [pendulumStyle, setPendulumStyle] = useState<'classic' | 'modern' | 'neon'>('classic');

  const metronomeAudioCtxRef = useRef<AudioContext | null>(null);
  const tapTimestampsRef = useRef<number[]>([]);
  const volumeRef = useRef(70);

  // Initialize active lesson
  useEffect(() => {
    if (modules.length > 0) {
      // Find the first module in course
      const firstMod = modules[0];
      setActiveModule(firstMod);
      if (firstMod.lessons.length > 0) {
        // Try to find the first uncompleted or just the first lesson
        const activeL = firstMod.lessons.find(l => !l.completed) || firstMod.lessons[0];
        setActiveLesson(activeL);
        if (activeL.videos && activeL.videos.length > 0) {
          setSelectedSubVideoId(activeL.videos[0].id);
        } else {
          setSelectedSubVideoId(null);
        }
      }
    }
  }, [course, modules]);

  // Handle playing backing track loop using Web Audio API synthesis
  useEffect(() => {
    let timer: any;
    if (backingTrackPlaying) {
      // Periodic trigger for backing synth notes
      let step = 0;
      const harmonyArpeggio = selectedCircleNode 
         ? selectedCircleNode.chordFrequencies 
         : [NOTE_FREQS['DO'], NOTE_FREQS['MI'], NOTE_FREQS['SOL']]; // default C Major
         
      timer = setInterval(() => {
        const freqIndex = step % harmonyArpeggio.length;
        const rootFreq = harmonyArpeggio[freqIndex];
        // Lower octave for backing feel
        playNote(rootFreq / 2, 'triangle', 0.8);
        
        step++;
        setPlaybackTime(prev => (prev + 1) % 60);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [backingTrackPlaying, selectedCircleNode]);

  const handleLessonSelect = (lesson: Lesson, mod: Module) => {
    if (lesson.locked) {
      alert('Esta lección está actualmente bloqueada. Completa las lecciones previas para desbloquearla.');
      return;
    }
    setActiveModule(mod);
    setActiveLesson(lesson);
    setAudioPlaying(false);
    if (lesson.videos && lesson.videos.length > 0) {
      setSelectedSubVideoId(lesson.videos[0].id);
    } else {
      setSelectedSubVideoId(null);
    }
  };

  const handleMarkAsCompleted = () => {
    if (!activeLesson.completed) {
      onCompleteLesson(course.id, activeModule.id, activeLesson.id);
      
      // Update local state copy to show checkmark immediately
      setActiveLesson(prev => ({ ...prev, completed: true }));
      
      // Try to auto-unlock next lesson
      const currentLessonIndex = activeModule.lessons.findIndex(l => l.id === activeLesson.id);
      if (currentLessonIndex !== -1 && currentLessonIndex + 1 < activeModule.lessons.length) {
        const nextL = activeModule.lessons[currentLessonIndex + 1];
        nextL.locked = false; // unlock
      }
    }
  };

  const triggerDownload = (fileName: string) => {
    setDownloadProgress(prev => ({ ...prev, [fileName]: 1 }));
    let progress = 1;
    const interval = setInterval(() => {
      progress += 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          alert(`¡Descarga de ${fileName} realizada con éxito!`);
          setDownloadProgress(prev => {
            const copy = { ...prev };
            delete copy[fileName];
            return copy;
          });
        }, 500);
      }
      setDownloadProgress(prev => ({ ...prev, [fileName]: progress }));
    }, 200);
  };

  const handlePlayCircleNode = (node: QuintasNode, isRelative: boolean) => {
    setSelectedCircleNode(node);
    const freqs = isRelative ? node.relativeFrequencies : node.chordFrequencies;
    
    // Play full triad simultaneously or staggered
    freqs.forEach((freq, idx) => {
      setTimeout(() => {
        playNote(freq, 'sine', 0.8);
      }, idx * 120);
    });
  };

  const handleSendComment = (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const commentObj: Comment = {
      id: `comment-${Date.now()}`,
      userName: 'Tú (Estudiante Estrella)',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      role: 'student',
      text: newComment.trim(),
      timestamp: 'Ahora mismo',
    };
    
    onPostComment(commentObj);
    setNewComment('');
  };

  // Keep volumeRef synced with state
  useEffect(() => {
    volumeRef.current = metronomeVolume;
  }, [metronomeVolume]);

  const getTempoName = (bpm: number): string => {
    if (bpm < 60) return 'Largo (Muy lento)';
    if (bpm < 80) return 'Lento / Adagio';
    if (bpm < 108) return 'Andante (Al paso)';
    if (bpm < 120) return 'Moderato';
    if (bpm < 168) return 'Allegro (Rápido)';
    return 'Presto (Muy rápido)';
  };

  const playMetronomeSound = (isFirstBeat: boolean) => {
    try {
      if (!metronomeAudioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        metronomeAudioCtxRef.current = new AudioContextClass();
      }
      const ctx = metronomeAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.setValueAtTime(isFirstBeat ? 1000 : 600, ctx.currentTime);
      osc.type = 'sine';

      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      const targetVolume = (volumeRef.current / 100) * 0.45;
      gain.gain.linearRampToValueAtTime(targetVolume, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (isFirstBeat ? 0.06 : 0.04));

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (err) {
      console.warn('Fallo al reproducir tic de metrónomo:', err);
    }
  };

  const handleToggleMetronome = () => {
    if (metronomePlaying) {
      setMetronomePlaying(false);
    } else {
      setMetronomeBeat(1);
      playMetronomeSound(true);
      setMetronomePlaying(true);
    }
  };

  const handleTapTempo = () => {
    const now = Date.now();
    const taps = tapTimestampsRef.current;
    taps.push(now);

    if (taps.length > 5) {
      taps.shift();
    }

    if (taps.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }

      const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      if (calculatedBpm >= 40 && calculatedBpm <= 240) {
        setMetronomeBpm(calculatedBpm);
      }
    }

    setTapActive(true);
    setTimeout(() => setTapActive(false), 100);
  };

  useEffect(() => {
    let timer: any = null;
    if (metronomePlaying) {
      const intervalMs = (60 / metronomeBpm) * 1000;
      timer = setInterval(() => {
        setMetronomeBeat(prev => {
          const nextBeat = (prev % metronomeSignature) + 1;
          playMetronomeSound(nextBeat === 1);
          return nextBeat;
        });
      }, intervalMs);
    } else {
      setMetronomeBeat(1);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [metronomePlaying, metronomeBpm, metronomeSignature]);

  // Clean up AudioContext on unmount
  useEffect(() => {
    return () => {
      if (metronomeAudioCtxRef.current) {
        metronomeAudioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Calculate percentage of completed classes in all loaded modules
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessonsCount = modules.reduce((acc, m) => acc + m.lessons.filter(l => l.completed).length, 0);
  const completionPercentage = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 45;

  const activeSubVideo = activeLesson.videos?.find(v => v.id === selectedSubVideoId) || activeLesson.videos?.[0];

  return (
    <div className="space-y-8 pb-24 px-4 max-w-4xl mx-auto pt-4" id="classroom-view-main">
      {/* Breadcrumbs matching image 3 */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono" id="classroom-breadcrumbs">
        <span>Cursos</span>
        <ChevronRight size={12} />
        <span className="text-brand-primary font-bold">{course.category} Musical</span>
        <ChevronRight size={12} />
        <span className="text-slate-850 font-bold truncate">{activeLesson.title || 'El Círculo de Quintas'}</span>
      </div>

      {/* Styled Responsive Video Player Card */}
      <section className="space-y-4" id="video-player-section">
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 group shadow-2xl">
          {audioPlaying ? (
            activeSubVideo && activeSubVideo.url ? (
              <div className="w-full h-full relative" id="iframe-video-player-container">
                <iframe
                  src={activeSubVideo.url}
                  title={activeSubVideo.title}
                  className="w-full h-full border-0 animate-fade-in"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                
                {/* Floating controls bar */}
                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/85 backdrop-blur-sm px-3 py-1.5 rounded-xl flex justify-between items-center text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="font-mono text-[#ffb0cc] font-bold">🎹 Reproduciendo: {activeSubVideo.title}</span>
                  <button 
                    onClick={() => setAudioPlaying(false)}
                    className="px-2 py-0.5 bg-red-500 hover:bg-red-600 rounded text-white font-bold cursor-pointer transition-colors"
                  >
                    Detener
                  </button>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-6 space-y-4">
                {/* Active Soundwaves animation */}
                <div className="flex items-end gap-1.5 h-16">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-brand-primary to-brand-secondary rounded-full animate-bounce"
                      style={{
                        height: `${20 + Math.random() * 80}%`,
                        animationDelay: `${i * 120}ms`,
                        animationDuration: `${0.6 + Math.random() * 0.7}s`
                      }}
                    />
                  ))}
                </div>
                
                <div className="text-center">
                  <span className="text-xs font-mono text-[#ffb0cc] uppercase tracking-widest block font-bold">Lección en Reproducción</span>
                  <h4 className="text-sm font-semibold text-white mt-1">{activeLesson.title}</h4>
                  <p className="text-[11px] text-[#bdc8d1]/65 mt-1 font-mono">Duración: {activeLesson.duration} | Velocidad de reproducción: {playbackSpeed}x</p>
                </div>

                {/* Action bar on active video */}
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                  <button
                    onClick={() => setPlaybackSpeed(prev => (prev === 2 ? 0.75 : prev + 0.25))}
                    className="text-xs font-mono px-2 py-1 hover:bg-white/5 rounded text-[#83cfff]"
                    title="Cambiar velocidad"
                  >
                    ⚡ {playbackSpeed}x
                  </button>
                  <button
                    onClick={() => {
                      // Play notes of active lesson scale
                      playNote(523.25, 'sine', 0.4);
                    }}
                    className="p-2 hover:bg-white/5 rounded text-white"
                    title="Afinar"
                  >
                    <Music size={14} />
                  </button>
                  <button
                    onClick={() => setAudioPlaying(false)}
                    className="px-4 py-1.5 bg-[#ff45a1] hover:bg-[#ff1e87] text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                  >
                    <Pause size={12} fill="currentColor" /> Pausar
                  </button>
                </div>
              </div>
            )
          ) : (
            <>
              {/* Course Specific Background Photo */}
              <img
                src={course.imageUrl}
                alt="Fondo de aula virtual"
                className="w-full h-full object-cover opacity-75 grayscale brightness-75 filter blur-[0.5px]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              
              {/* Giant Translucent Play Button Centered */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => {
                    setAudioPlaying(true);
                    // Play welcome tone
                    playNote(NOTE_FREQS['DO'], 'sine', 0.5);
                  }}
                  className="w-20 h-20 rounded-full bg-brand-primary-container/20 hover:bg-[#ffb0cc] hover:text-slate-900 border border-white/20 hover:scale-105 active:scale-95 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-xl cursor-pointer"
                  id="classroom-lesson-play-btn"
                >
                  <Play size={32} className="ml-1.5" fill="currentColor" />
                </button>
              </div>

              {/* Playback bar metadata */}
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs font-mono text-white/80">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#ff45a1] rounded-full animate-ping" />
                  Listo para transmitir
                </span>
                <span>{activeLesson.duration || '22:00'} mins</span>
              </div>
            </>
          )}
        </div>

        {/* Multiplevideos/Clips Playlist container (Carga de 6 a 10 videos de piano o instrumento) */}
        {activeLesson.videos && activeLesson.videos.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 space-y-4 shadow-xl text-left" id="classroom-multiple-clips-playlist">
            <div className="flex flex-col sm:flex-row sm:items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-display font-black text-[#ffb0cc] uppercase tracking-wide flex items-center gap-2">
                  <PlayCircle size={15} className="text-[#ffb0cc] animate-pulse" />
                  Playlist Interactiva de la Clase ({activeLesson.videos.length} Videos Cargados)
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                  Esta clase de {course.category.toLowerCase()} tiene cargada una secuencia de {activeLesson.videos.length} videos didácticos:
                </p>
              </div>
              <span className="text-[10px] font-mono bg-brand-primary-container/20 text-[#83cfff] px-2.5 py-0.5 rounded border border-[#83cfff]/20 font-bold self-start sm:self-auto">
                🎹 {course.category} Nivel 1
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1" id="playlist-loaded-videos-tray">
              {activeLesson.videos.map((vid, idx) => {
                const isSubSelected = selectedSubVideoId === vid.id;
                return (
                  <button
                    key={vid.id}
                    onClick={() => {
                      setSelectedSubVideoId(vid.id);
                      setAudioPlaying(true);
                      // Custom melody feedback matching the video index
                      playNote(NOTE_FREQS['DO'] + (idx * 27), 'sine', 0.15);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSubSelected
                        ? 'bg-slate-800 border-brand-primary/50 text-white shadow-md'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/45 hover:text-white'
                    }`}
                    id={`btn-playlist-video-${vid.id}`}
                  >
                    <div className={`w-6 h-6 rounded-lg font-mono text-[10px] flex items-center justify-center font-bold border shrink-0 ${
                      isSubSelected 
                        ? 'bg-[#ffb0cc] text-slate-950 border-transparent font-black shadow-[0_0_8px_rgba(255,176,204,0.4)]'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-grow">
                      <span className="block text-xs font-bold truncate text-white">{vid.title}</span>
                      <span className="block text-[9px] font-mono text-slate-450 truncate">{vid.url}</span>
                    </div>
                    {vid.duration && (
                      <span className="text-[9px] font-mono text-slate-400 self-center bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800 shrink-0">
                        {vid.duration}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Video info meta & core buttons */}
        <div className="bg-white border border-slate-250 p-6 rounded-2xl space-y-4 shadow-md text-left" id="lesson-detail-panel">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-secondary bg-brand-secondary/10 px-2.5 py-0.5 rounded border border-brand-secondary/20 font-bold">
                {activeModule.title ? activeModule.title.split(':')[0] : 'Módulo Actual'}
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900 tracking-tight">
                {activeLesson.title || 'Lección de Prueba'}
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Resources toggle simulator */}
              <button
                onClick={() => triggerDownload('Guía de Clases.pdf')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-150 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download size={14} />
                Recursos
              </button>

              <button
                onClick={handleMarkAsCompleted}
                disabled={activeLesson.completed}
                className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                  activeLesson.completed
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-brand-primary hover:brightness-110 text-white font-display'
                }`}
              >
                <CheckSquare size={14} />
                {activeLesson.completed ? 'Completada ✔' : 'Marcar Completada'}
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
            {activeLesson.description || 'Domina los conceptos teóricos y prácticos clave para avanzar de forma progresiva en tu educación musical.'}
          </p>

          {/* Tab lists: Resumen, Transcripción, Discusiones */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex gap-4 border-b border-slate-150 text-xs font-mono pb-2">
              <button
                onClick={() => setActiveTab('resumen')}
                className={`pb-2 px-1 relative cursor-pointer font-bold ${activeTab === 'resumen' ? 'text-brand-primary font-black' : 'text-slate-500'}`}
              >
                Resumen
                {activeTab === 'resumen' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
              </button>
              <button
                onClick={() => setActiveTab('transcrip')}
                className={`pb-2 px-1 relative cursor-pointer font-bold ${activeTab === 'transcrip' ? 'text-brand-primary font-black' : 'text-slate-500'}`}
              >
                Transcripción
                {activeTab === 'transcrip' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
              </button>
              <button
                onClick={() => setActiveTab('disc')}
                className={`pb-2 px-1 relative cursor-pointer font-bold ${activeTab === 'disc' ? 'text-brand-primary font-black' : 'text-slate-500'}`}
              >
                Discusión ({comments.length})
                {activeTab === 'disc' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
              </button>
            </div>

            {/* Tab contents */}
            {activeTab === 'resumen' && (
              <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed font-semibold animate-fade-in" id="tab-summary-content">
                <div className="flex items-start gap-2.5">
                  <span className="text-brand-primary font-black">🎵 Concepto Llave:</span>
                  <span>Práctica activa regulada por el círculo de quintas.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-brand-secondary font-black">🎹 Requisitos:</span>
                  <span>Instrumento afinado a frecuencia de concierto clásica (A4 = 440Hz).</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-brand-tertiary font-black">⏱ Tarea del Módulo:</span>
                  <span>Tocar 4 vueltas completas sobre la pista de acompañamiento de G Major y registrar tu tiempo en la hoja de autoevaluación.</span>
                </div>
              </div>
            )}

            {activeTab === 'transcrip' && (
              <div className="text-xs text-slate-600 leading-relaxed italic animate-fade-in max-h-32 overflow-y-auto bg-slate-50 p-3.5 border border-slate-250 rounded-lg space-y-2 shadow-inner" id="tab-transcript-content">
                <p><strong>[00:15 - Prof. Carlos]:</strong> "Bienvenidos de vuelta, queridos alumnos de la Academia. Hoy entramos de lleno en lo que nos gusta llamar el 'Reloj Musical' o Círculo de Quintas..."</p>
                <p><strong>[02:40 - Prof. Carlos]:</strong> "Como pueden apreciar, si empezamos en Do Mayor, no tenemos ninguna alteración en la armadura de clave. Pero al avanzar un intervalo de quinta justa hacia adelante, llegamos a Sol..."</p>
                <p><strong>[05:15 - Prof. Carlos]:</strong> "Ese movimiento de quintas añade de forma constante un sostenido adicional que sigue un patrón predecible. Esto nos ayuda a improvisar en cualquier tonalidad sin vacilar..."</p>
              </div>
            )}

            {activeTab === 'disc' && (
              <div className="space-y-4 animate-fade-in" id="tab-discussion-content">
                {/* Send form */}
                <form onSubmit={handleSendComment} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Escribe tu duda o comentario de músico..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 rounded-lg border border-slate-205 text-slate-800 text-xs focus:outline-none focus:border-brand-primary placeholder-slate-400 shadow-inner font-mono font-medium"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-brand-secondary to-brand-tertiary hover:brightness-110 text-white text-xs font-bold rounded-lg cursor-pointer shrink-0 transition-all shadow"
                  >
                    Enviar
                  </button>
                </form>

                {/* Comment streams */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {comments.map((c) => (
                    <div key={c.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex gap-3 shadow-sm">
                      <img
                        src={c.avatarUrl}
                        alt={c.userName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between items-center">
                          <span className={`font-bold ${c.role === 'teacher' ? 'text-brand-primary' : 'text-slate-800'}`}>
                            {c.userName} {c.role === 'teacher' && '⭐ (Profesor)'}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">{c.timestamp}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed font-semibold">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Dynamic Metronome Practice Card Tool */}
      <section className="bg-white border border-slate-200 p-6 rounded-2xl space-y-6 shadow-md text-left relative overflow-hidden" id="metronome-practice-card">
        {/* Decorative ambient background blur */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-display font-black text-slate-900 flex items-center gap-2">
              <Volume2 size={18} className="text-brand-primary animate-pulse" />
              Metrónomo Rítmico de Práctica
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-lg font-semibold">
              Entrena tu timing y precisión de ejecución. Ajusta los beats por minuto (BPM), la signatura de compás y ensaya con un pulso constante.
            </p>
          </div>

          {/* Quick Info Badge */}
          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-[11px] font-mono font-bold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            Web Audio API Activo
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Column 1: Speed Display and Tap Pulse with Physical Pendulum */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-2xl relative shadow-inner text-center space-y-3 shrink-0">
            <div className="space-y-1 w-full">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase block">Tempo Actual</span>
              <div className="flex items-baseline justify-center gap-1.5" id="metronome-bpm-display-container">
                <span className="text-5xl font-mono font-black text-slate-900 tracking-tighter" id="metronome-bpm-text">
                  {metronomeBpm}
                </span>
                <span className="text-xs font-mono font-bold text-brand-secondary animate-pulse">BPM</span>
              </div>
              <span className="text-xs font-mono font-extrabold text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-full inline-block" id="metronome-tempo-name">
                {getTempoName(metronomeBpm)}
              </span>
            </div>

            {/* Elegant physical pendulum visualization containing the needle */}
            <div className={`w-full h-24 rounded-xl border relative overflow-hidden flex flex-col justify-end p-2 transition-all duration-300 w-full ${
              pendulumStyle === 'classic'
                ? 'bg-amber-50/40 border-amber-200/85 shadow-inner'
                : pendulumStyle === 'neon'
                  ? 'bg-slate-950 border-cyan-500/30'
                  : 'bg-slate-100 border-slate-200 shadow-inner'
            }`} id="metronome-mechanical-pendulum shadow-sm">
              {/* Optional Background visual flash effect (glow wave) */}
              {metronomePlaying && metronomeFlashEnabled && (
                <div 
                  className={`absolute inset-0 opacity-10 transition-opacity duration-100 pointer-events-none ${
                    metronomeBeat === 1 
                      ? 'bg-amber-400' 
                      : 'bg-brand-primary'
                  }`}
                  style={{
                    opacity: metronomePlaying ? (metronomeBeat === 1 ? 0.3 : 0.15) : 0
                  }}
                />
              )}

              {/* Angle scale tick marks */}
              <div className="absolute top-1.5 left-0 right-0 flex justify-between px-6 text-[8px] font-mono select-none font-bold text-slate-400">
                <span>◀ L</span>
                <span className="text-[10px]">▼</span>
                <span>R ▶</span>
              </div>

              {/* Small LED Lamp Indicator */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full transition-all duration-75 block ${
                  metronomePlaying
                    ? metronomeBeat === 1
                      ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24] scale-110'
                      : 'bg-brand-primary shadow-[0_0_8px_#3b82f6]'
                    : 'bg-slate-350'
                }`} />
                <span className="text-[8px] font-mono uppercase font-black tracking-widest text-slate-400 select-none">
                  {metronomePlaying ? `BEAT ${metronomeBeat}` : 'OFF'}
                </span>
              </div>

              {/* Pendulum Base/Pivot Point */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 rounded-full bg-slate-400 z-10" />

              {/* The Swinging Arm/Needle */}
              <div 
                className={`w-0.5 origin-bottom absolute bottom-2 left-1/2 -translate-x-1/2 ${
                  pendulumStyle === 'classic'
                    ? 'h-16 bg-amber-800'
                    : pendulumStyle === 'neon'
                      ? 'h-16 bg-cyan-400 shadow-[0_0_10px_#22d3ee]'
                      : 'h-16 bg-slate-800'
                }`}
                style={{
                  transform: `rotate(${
                    metronomePlaying 
                      ? (metronomeBeat % 2 === 0 ? '-30deg' : '30deg')
                      : '0deg'
                  })`,
                  // The duration must match the exact time gap between beats (60 / BPM) rounded
                  transition: metronomePlaying 
                    ? `transform ${(60 / metronomeBpm) * 980}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)` 
                    : 'transform 300ms ease'
                }}
              >
                {/* Slidable sliding weight on the traditional metronome stem */}
                <div 
                  className={`w-3.5 h-2.5 rounded border shadow absolute -translate-x-[6px] transition-all duration-300 ${
                    pendulumStyle === 'classic'
                      ? 'bg-amber-600 border-amber-900'
                      : pendulumStyle === 'neon'
                        ? 'bg-emerald-400 border-white shadow-[0_0_4px_#34d399]'
                        : 'bg-slate-700 border-slate-900'
                  }`}
                  style={{
                    // Historically: fast rates => weight slided DOWN (closer to pivot). slow rates => weight slided UP
                    top: `${Math.max(10, Math.min(50, 60 - ((metronomeBpm - 40) / 200) * 40))}px`
                  }}
                  title="Peso Deslizante de Afinación"
                />
              </div>
            </div>

            {/* Visual Beat Indicator Dots */}
            <div className="flex items-center justify-center gap-2.5 py-1 w-full" id="metronome-beats-dots">
              {Array.from({ length: metronomeSignature }).map((_, idx) => {
                const beatIndex = idx + 1;
                const isActive = metronomeBeat === beatIndex && metronomePlaying;
                const isAccent = beatIndex === 1;
                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full border transition-all duration-100 flex items-center justify-center ${
                      isActive
                        ? isAccent
                          ? 'bg-amber-500 border-amber-600 scale-125 shadow-lg shadow-amber-500/40 text-white'
                          : 'bg-brand-primary border-brand-primary scale-125 shadow-lg shadow-brand-primary/40 text-white'
                        : 'bg-slate-200 border-slate-300'
                    }`}
                    title={isAccent ? 'Primer Pulso (Acentuado)' : `Pulso ${beatIndex}`}
                  >
                    {isAccent && <span className="text-[7px] text-white font-mono font-bold">1</span>}
                  </div>
                );
              })}
            </div>

            {/* Play Button */}
            <button
              onClick={handleToggleMetronome}
              className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-display text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer ${
                metronomePlaying
                  ? 'bg-red-500 hover:bg-red-600 text-white hover:shadow-lg hover:shadow-red-500/25'
                  : 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white hover:brightness-110 hover:shadow-lg hover:shadow-brand-primary/25'
              }`}
              id="btn-metronome-toggle"
            >
              {metronomePlaying ? (
                <>
                  <Pause size={14} fill="currentColor" />
                  Detener Metrónomo
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" />
                  Iniciar Metrónomo
                </>
              )}
            </button>
          </div>

          {/* Column 2: Controls Panel */}
          <div className="md:col-span-7 space-y-5">
            {/* BPM Slider */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center text-xs gap-1.5">
                <label className="font-mono font-bold text-slate-500" htmlFor="metronome-bpm-slider">Ajustar Tempo (BPM)</label>
                <div className="flex gap-1.5 font-mono text-[11px] font-bold">
                  <button 
                    onClick={() => setMetronomeBpm(prev => Math.max(40, prev - 1))}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded cursor-pointer transition-colors"
                    id="btn-bpm-minus-1"
                  >
                    -1
                  </button>
                  <button 
                    onClick={() => setMetronomeBpm(prev => Math.max(40, prev - 5))}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded cursor-pointer transition-colors"
                    id="btn-bpm-minus-5"
                  >
                    -5
                  </button>
                  <button 
                    onClick={() => setMetronomeBpm(prev => Math.min(240, prev + 5))}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded cursor-pointer transition-colors"
                    id="btn-bpm-plus-5"
                  >
                    +5
                  </button>
                  <button 
                    onClick={() => setMetronomeBpm(prev => Math.min(240, prev + 1))}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded cursor-pointer transition-colors"
                    id="btn-bpm-plus-1"
                  >
                    +1
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="40"
                max="240"
                value={metronomeBpm}
                onChange={(e) => setMetronomeBpm(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 border border-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                id="metronome-bpm-slider"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>40 BPM (Lento)</span>
                <span>120 BPM (Moderado)</span>
                <span>240 BPM (Rápido)</span>
              </div>
            </div>

            {/* Time Signature selector and Tap buttons row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="block text-xs font-mono font-bold text-slate-500">Métrica del Compás</span>
                <div className="grid grid-cols-4 gap-1">
                  {[2, 3, 4, 6].map((sig) => (
                    <button
                      key={sig}
                      onClick={() => {
                        setMetronomeSignature(sig);
                        setMetronomeBeat(1);
                      }}
                      className={`py-1.5 text-xs font-mono font-bold border rounded-lg transition-all cursor-pointer ${
                        metronomeSignature === sig
                          ? 'bg-brand-primary border-brand-primary text-white font-black shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                      id={`btn-time-sig-${sig}`}
                      title={`Compás de ${sig === 6 ? '6/8' : `${sig}/4`}`}
                    >
                      {sig === 6 ? '6/8' : `${sig}/4`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="block text-xs font-mono font-bold text-slate-500">Tap Tempo</span>
                <button
                  type="button"
                  onClick={handleTapTempo}
                  className={`w-full py-1.5 text-xs font-mono font-extrabold border rounded-lg uppercase tracking-wider transition-all duration-100 cursor-pointer ${
                    tapActive
                      ? 'bg-green-500 border-green-600 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95'
                  }`}
                  id="btn-metronome-tap"
                >
                  🖐️ TAP TEMPO
                </button>
              </div>
            </div>

            {/* Preset shortcuts section and volume */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <span className="block text-xs font-mono font-bold text-slate-500">Accesos Rápidos</span>
                <div className="flex flex-wrap gap-1.5">
                  ={[
                    { label: '60 Adagio', val: 60, id: 'chip-speed-lento' },
                    { label: '90 Andante', val: 90, id: 'chip-speed-andante' },
                    { label: '120 Moderato', val: 120, id: 'chip-speed-moderato' },
                    { label: '160 Allegro', val: 160, id: 'chip-speed-alegre' },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      onClick={() => setMetronomeBpm(preset.val)}
                      className={`text-[10px] font-mono font-bold px-2 py-1 rounded-md border cursor-pointer transition-all ${
                        metronomeBpm === preset.val
                          ? 'bg-brand-secondary border-brand-secondary text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                      id={preset.id}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-mono font-bold text-slate-500">Volumen del Metrónomo</span>
                  <span className="font-mono font-extrabold text-slate-700">{metronomeVolume}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 size={13} className="text-slate-400 shrink-0" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={metronomeVolume}
                    onChange={(e) => setMetronomeVolume(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 border border-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
                    id="metronome-volume-slider"
                  />
                </div>
              </div>
            </div>

            {/* Visual Decoration and Effects Customizer Row */}
            <div className="border-t border-slate-100 pt-4 mt-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="block text-xs font-mono font-bold text-slate-500">Estilo del Péndulo Mecánico</span>
                <div className="flex gap-1.5">
                  {(['classic', 'modern', 'neon'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => setPendulumStyle(style)}
                      className={`px-3 py-1 text-[11px] font-mono font-bold border rounded-md uppercase transition-all cursor-pointer ${
                        pendulumStyle === style
                          ? style === 'classic'
                            ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
                            : style === 'neon'
                              ? 'bg-cyan-500 border-cyan-500 text-slate-950 font-black shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                              : 'bg-slate-700 border-slate-700 text-white shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                      id={`btn-pendulum-style-${style}`}
                    >
                      {style === 'classic' ? '🪵 Madera' : style === 'neon' ? '⚡ Neón' : '⚙️ Acero'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-500">Fuegos de Acompañamiento</span>
                  <button
                    onClick={() => setMetronomeFlashEnabled(prev => !prev)}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold border rounded-md transition-all cursor-pointer ${
                      metronomeFlashEnabled
                        ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                        : 'bg-slate-100 border-slate-200 text-slate-400'
                    }`}
                    id="btn-toggle-metronome-pulse"
                  >
                    {metronomeFlashEnabled ? 'Flash de Beat (Activo)' : 'Apagado'}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  Genera destellos rítmicos luminosos en pantalla para entrenamiento visual silencioso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Circle of Quintas Special Interactive Widget for Theory modules */}
      {course.id === 'teoria-armonia' && (
        <section className="bg-white border border-slate-250 p-6 rounded-2xl space-y-6 shadow-md" id="circle-quintas-instrument">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-lg font-display font-black text-slate-900 flex items-center justify-center sm:justify-start gap-2">
              <Music size={18} className="text-[#ffb786] animate-pulse" />
              Herramienta: Círculo de Quintas Interactivo
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl font-semibold">
              ¡Música Real! Haz clic en cualquier nota para escuchar su acorde tríada mayor y ver su alteración de clave. Haz clic en la opción de <strong>Min</strong> para escuchar el relativo menor correspondiente y estudiar la armonía con oído afinado.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
            {/* Circle wheel rendering representation */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-slate-200 bg-slate-50/50 flex items-center justify-center shadow-lg p-4">
              {/* Outer boundary labels */}
              <div className="absolute inset-0 rounded-full border-2 border-brand-primary/20 animate-spin-slow opacity-30 pointer-events-none" />
              
              {/* Render 12 Node slices */}
              {CIRCLE_NODES.map((node) => {
                const rad = (node.angle - 90) * (Math.PI / 185);
                const distance = 98; // radius distance
                const x = Math.cos(rad) * distance;
                const y = Math.sin(rad) * distance;
                
                const isSelected = selectedCircleNode?.note === node.note;
                
                return (
                  <div
                    key={node.note}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                    className={`absolute flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border cursor-pointer group transition-all duration-300 ${
                      isSelected
                        ? 'bg-brand-primary border-slate-900 text-white scale-110 font-bold shadow-lg shadow-brand-primary/25'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-[#ffb0cc]/80 hover:bg-slate-50'
                    }`}
                    onClick={() => handlePlayCircleNode(node, false)}
                    id={`circle-node-${node.note}`}
                  >
                    <span className="text-[11px] sm:text-xs font-mono font-black">{node.note}</span>
                    <span className="text-[7px] font-mono opacity-60 group-hover:opacity-100">{node.sharpsOrFlats}</span>
                  </div>
                );
              })}

              {/* Inner Circle Relative Minors */}
              <div className="w-36 h-36 rounded-full border border-slate-200 bg-white flex items-center justify-center relative shadow-inner">
                {CIRCLE_NODES.map((node) => {
                  const rad = (node.angle - 90) * (Math.PI / 185);
                  const distance = 46; // inner radius distance
                  const x = Math.cos(rad) * distance;
                  const y = Math.sin(rad) * distance;
                  
                  const isSelected = selectedCircleNode?.note === node.note;

                  return (
                    <button
                      key={node.relative}
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                      className={`absolute text-[8px] sm:text-[9px] font-bold font-mono px-1 rounded-sm border cursor-pointer hover:scale-105 transition-all ${
                        isSelected 
                          ? 'bg-brand-secondary text-white border-slate-900 scale-110 font-black shadow-sm'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-950 hover:border-brand-secondary/55'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayCircleNode(node, true);
                      }}
                    >
                      {node.relative.split(' ')[0]}
                    </button>
                  );
                })}

                {/* Central Info Node */}
                <div className="text-center space-y-0.5">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Afinación</span>
                  <span className="text-xs font-black font-mono text-brand-secondary">440 Hz</span>
                </div>
              </div>
            </div>

            {/* Side Node details information box */}
            <div className="flex-1 space-y-4 w-full">
              {selectedCircleNode ? (
                <div className="bg-slate-50/80 border border-slate-200 p-4 rounded-xl text-xs space-y-3 animate-fade-in" id="chord-helper-details">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-250">
                    <span className="font-extrabold text-sm text-slate-900">Detalles del Acorde: {selectedCircleNode.note} Mayor</span>
                    <span className="text-[10px] font-mono text-brand-primary font-bold">{selectedCircleNode.sharpsOrFlats}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>
                      <span className="block text-slate-500 font-bold">Tríada Mayor:</span>
                      <span className="text-slate-800 font-black">{selectedCircleNode.note} - {selectedCircleNode.note === 'DO' ? 'MI' : selectedCircleNode.note === 'SOL' ? 'SI' : 'Alteraciones'} - {selectedCircleNode.note === 'DO' ? 'SOL' : 'Quinta'}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 font-bold">Relativo Menor:</span>
                      <span className="text-brand-secondary font-black">{selectedCircleNode.relative}</span>
                    </div>
                  </div>

                  <div className="bg-brand-primary/10 border border-brand-primary/20 p-2.5 rounded text-[10px] text-slate-705 leading-relaxed font-semibold">
                    💡 <strong>Tip Teórico:</strong> La armadura de {selectedCircleNode.note} Mayor contiene <strong>{selectedCircleNode.sharpsOrFlats}</strong>. Comparte exactamente el mismo set de notas naturales/alteradas que su escala relativa de <strong>{selectedCircleNode.relative}</strong>.
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePlayCircleNode(selectedCircleNode, false)}
                      className="flex-1 py-1.5 px-2.5 bg-brand-primary hover:brightness-110 text-white font-bold font-mono rounded text-[10px] cursor-pointer"
                    >
                      🔊 Tríada Mayor
                    </button>
                    <button
                      onClick={() => handlePlayCircleNode(selectedCircleNode, true)}
                      className="flex-1 py-1.5 px-2.5 bg-brand-secondary hover:brightness-110 text-white font-bold font-mono rounded text-[10px] cursor-pointer"
                    >
                      🔊 Tríada Menor
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl text-center space-y-3 py-8 text-xs text-slate-500 font-bold shadow-inner">
                  <AlertCircle size={28} className="mx-auto text-brand-secondary animate-bounce" />
                  <p>Selecciona una tonalidad del Círculo para ver sus intervalos, acordes armonizadores, armadura y escuchar la síntesis acústica en tiempo real.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Progress tracking section bar matching image 3 */}
      <section className="bg-white border border-slate-205 p-5 rounded-2xl text-left shadow-md" id="student-progress-bar-card">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-805">
              Progresa en tu formación integral de 36 módulos
            </span>
            <span className="text-xs font-mono font-black text-brand-secondary">
              {completionPercentage}% Completado
            </span>
          </div>
          
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-200">
            <div
              className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-tertiary h-1.5 rounded-full transition-all duration-700 ease-out shadow-inner"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 font-mono text-right font-semibold">
            Llevas {completedLessonsCount} de {totalLessons} lecciones completadas este mes
          </p>
        </div>
      </section>

      {/* Course curriculum content listing items */}
      <section className="bg-white border border-slate-250 rounded-2xl overflow-hidden shadow-md text-left" id="curriculum-roadmap">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-base font-display font-black text-slate-900 flex justify-between items-center">
            <span>Contenido del Módulo</span>
            <span className="text-xs font-mono text-brand-secondary bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 font-bold">{activeModule.lessons?.length || 4} Lecciones</span>
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {activeModule.lessons?.map((lesson) => {
            const isSelected = activeLesson.id === lesson.id;
            
            return (
              <div
                key={lesson.id}
                onClick={() => handleLessonSelect(lesson, activeModule)}
                className={`p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors ${
                  isSelected ? 'bg-brand-primary/5' : ''
                }`}
                id={`curriculum-lesson-${lesson.id}`}
              >
                <div className="flex items-center gap-3">
                  {/* Lesson Index Circle matching mockups */}
                  <div className={`w-9 h-9 rounded-full font-mono text-xs flex items-center justify-center font-bold border transition-all ${
                    isSelected 
                      ? 'bg-brand-primary text-white border-transparent'
                      : lesson.completed
                        ? 'bg-green-50 text-green-600 border-green-200'
                        : 'bg-slate-100 text-slate-700 border-slate-204'
                  }`}>
                    {lesson.number}
                  </div>

                  <div className="space-y-0.5">
                    <h4 className={`text-xs font-bold transition-colors ${
                      isSelected ? 'text-brand-primary' : 'text-slate-800'
                    }`}>
                      {lesson.title}
                    </h4>
                    <span className="text-[10px] font-mono text-[#bdc8d1]/50">⏱ {lesson.duration} mins</span>
                  </div>
                </div>

                {/* Right side check mark or lock indicator */}
                <div>
                  {lesson.locked ? (
                    <Lock size={14} className="text-[#bdc8d1]/30" />
                  ) : lesson.completed ? (
                    <div className="w-5 h-5 bg-green-500/20 border border-green-500/30 text-green-400 rounded-full flex items-center justify-center text-xs">
                      ✓
                    </div>
                  ) : (
                    <div className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-brand-primary animate-ping' : 'bg-brand-primary/30'}`} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mis Recursos section box (Guías y pistas) */}
      <section className="bg-white border border-slate-250 p-6 rounded-2xl text-left shadow-md" id="classroom-resources">
        <h3 className="text-sm font-display font-black text-slate-900 flex items-center gap-2 mb-4">
          <BookOpen size={16} className="text-brand-secondary" />
          Mis Recursos & Materiales Prácticos
        </h3>

        <div className="space-y-3">
          {/* Resource 1 */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs gap-4 hover:border-brand-primary/40 transition-colors shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-500 shrink-0">
                <FileCode size={16} />
              </div>
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-800">Guía de Quintas.pdf</span>
                <span className="text-[10px] text-slate-450 font-mono">Formato PDF | 4.2 MB de teoría profunda</span>
              </div>
            </div>
            
            <button
              onClick={() => triggerDownload('Guía de Quintas.pdf')}
              className="text-brand-primary hover:bg-slate-100 p-2 rounded-lg transition-colors cursor-pointer"
            >
              {downloadProgress['Guía de Quintas.pdf'] ? (
                <span className="text-[10px] font-mono">{downloadProgress['Guía de Quintas.pdf']}%</span>
              ) : (
                <Download size={16} />
              )}
            </button>
          </div>

          {/* Resource 2 - Playable Backing Track with real synthesize music */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs gap-4 hover:border-brand-primary/40 transition-colors shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg shrink-0 border transition-all ${
                backingTrackPlaying 
                  ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary animate-spin-slow' 
                  : 'bg-brand-secondary/10 border-brand-secondary/20 text-[#ffb0cc]'
              }`}>
                <Music size={16} />
              </div>
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-800">Pista de Práctica G Major</span>
                <span className="text-[10px] text-slate-450 font-mono">
                  {backingTrackPlaying ? '🔊 Reproduciendo arpegio de acompañamiento...' : 'Pista MIDI interactiva | Tono Sol Mayor'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setBackingTrackPlaying(!backingTrackPlaying);
                if (!backingTrackPlaying) {
                  // play a start sound
                  playNote(NOTE_FREQS['SOL'], 'sine', 0.4);
                }
              }}
              className={`p-2 rounded-lg transition-all ${
                backingTrackPlaying 
                  ? 'bg-brand-secondary/20 text-brand-secondary border border-brand-secondary/35 font-mono text-[10px] px-2.5 py-1 font-bold' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              } cursor-pointer`}
              id="btn-play-backing-class"
            >
              {backingTrackPlaying ? 'Detener ⏹' : <PlayCircle size={18} />}
            </button>
          </div>

          {/* Resource footer view all simulation */}
          <div className="text-center pt-2">
            <button
              onClick={() => alert('¡Tienes acceso completo para descargar y reproducir los 24 archivos adjuntos del curso!')}
              className="text-brand-secondary hover:text-brand-tertiary font-mono text-xs font-bold hover:underline cursor-pointer"
            >
              Ver todos los recursos (24)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
