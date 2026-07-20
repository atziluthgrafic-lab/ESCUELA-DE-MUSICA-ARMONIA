/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  MessageSquare, 
  RotateCcw, 
  Trash2, 
  PlusCircle, 
  PlayCircle,
  ArrowLeft, 
  Users, 
  Compass, 
  Layers, 
  Key, 
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { Course, Module, Comment } from '../types';

interface AdminViewProps {
  courses: Course[];
  modulesByCourse: Record<string, Module[]>;
  comments: Comment[];
  onUpdateCourses: (updated: Course[]) => void;
  onUpdateModulesByCourse: (updated: Record<string, Module[]>) => void;
  onUpdateComments: (updated: Comment[]) => void;
  onGoToTab: (tab: 'inicio' | 'cursos' | 'aula' | 'whatsapp' | 'perfil') => void;
  studentName: string;
}

export default function AdminView({
  courses,
  modulesByCourse,
  comments,
  onUpdateCourses,
  onUpdateModulesByCourse,
  onUpdateComments,
  onGoToTab,
  studentName,
}: AdminViewProps) {
  const [announcementText, setAnnouncementText] = useState('');
  const [simulatedCapacity, setSimulatedCapacity] = useState(85);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // States for Video Management Form (Priority Instrument: Piano)
  const [vidCategory, setVidCategory] = useState('Piano');
  const [vidCourseId, setVidCourseId] = useState('piano-maestro');
  const [vidModuleId, setVidModuleId] = useState('piano-m1');
  const [vidLessonId, setVidLessonId] = useState('p1');
  
  const [newVidTitle, setNewVidTitle] = useState('');
  const [newVidUrl, setNewVidUrl] = useState('');
  const [newVidDuration, setNewVidDuration] = useState('04:30');

  // Trigger cascade selection when Category changes
  const handleCategorySelect = (category: string) => {
    setVidCategory(category);
    // Find first course with this category
    const matchingCourses = courses.filter(c => c.category.toLowerCase() === category.toLowerCase() || category === 'Todos');
    const firstCourse = matchingCourses[0] || courses[0];
    if (firstCourse) {
      handleCourseSelect(firstCourse.id);
    }
  };

  const handleCourseSelect = (courseId: string) => {
    setVidCourseId(courseId);
    const mods = modulesByCourse[courseId] || [];
    if (mods.length > 0) {
      setVidModuleId(mods[0].id);
      if (mods[0].lessons.length > 0) {
        setVidLessonId(mods[0].lessons[0].id);
      } else {
        setVidLessonId('');
      }
    } else {
      setVidModuleId('');
      setVidLessonId('');
    }
  };

  const handleModuleSelect = (moduleId: string) => {
    setVidModuleId(moduleId);
    const mods = modulesByCourse[vidCourseId] || [];
    const mod = mods.find(m => m.id === moduleId);
    if (mod && mod.lessons.length > 0) {
      setVidLessonId(mod.lessons[0].id);
    } else {
      setVidLessonId('');
    }
  };

  // Add individual custom video URL
  const handleAddVideo = (e: FormEvent) => {
    e.preventDefault();
    if (!vidCourseId || !vidModuleId || !vidLessonId) {
      alert('Por favor selecciona un curso, módulo y clase válido.');
      return;
    }
    if (!newVidTitle.trim() || !newVidUrl.trim()) {
      alert('Ingresa el título del video y el enlace.');
      return;
    }

    const updatedModulesState = { ...modulesByCourse };
    const mods = updatedModulesState[vidCourseId] ? [...updatedModulesState[vidCourseId]] : [];
    
    const modIdx = mods.findIndex(m => m.id === vidModuleId);
    if (modIdx === -1) return;
    
    const updatedMod = { ...mods[modIdx] };
    const updatedLessons = [...updatedMod.lessons];
    
    const lesIdx = updatedLessons.findIndex(l => l.id === vidLessonId);
    if (lesIdx === -1) return;
    
    const updatedLesson = { ...updatedLessons[lesIdx] };
    const currentVideos = updatedLesson.videos ? [...updatedLesson.videos] : [];
    
    const newVid = {
      id: `vid-${Date.now()}`,
      title: newVidTitle,
      url: newVidUrl,
      duration: newVidDuration
    };
    
    updatedLesson.videos = [...currentVideos, newVid];
    updatedLessons[lesIdx] = updatedLesson;
    updatedMod.lessons = updatedLessons;
    mods[modIdx] = updatedMod;
    updatedModulesState[vidCourseId] = mods;
    
    onUpdateModulesByCourse(updatedModulesState);
    
    setNewVidTitle('');
    setNewVidUrl('');
    showFeedback(`¡Video "${newVid.title}" agregado con éxito a la clase de piano!`);
  };

  // Pre-populate a batch of 6 to 10 piano videos to satisfy requirements
  const handleLoadSampleBatch = () => {
    if (!vidCourseId || !vidModuleId || !vidLessonId) {
      alert('Por favor selecciona un curso, módulo y clase válido.');
      return;
    }

    const sampleVideos = [
      { id: `sv1-${Date.now()}`, title: '1. Ejercicio Práctico de Postura de Espalda', url: 'https://www.youtube.com/embed/1A_XmCsmBq0', duration: '02:30' },
      { id: `sv2-${Date.now()}`, title: '2. Práctica Guiada de Altura Dinámica', url: 'https://www.youtube.com/embed/2B_YnDsmeP4', duration: '03:15' },
      { id: `sv3-${Date.now()}`, title: '3. El Movimiento de Péndulo Lateral de Codos', url: 'https://www.youtube.com/embed/3C_ZoEtkRy5', duration: '04:10' },
      { id: `sv4-${Date.now()}`, title: '4. Independencia del Dedo Pulgar y Anular', url: 'https://www.youtube.com/embed/4D_FeGrkTy6', duration: '02:45' },
      { id: `sv5-${Date.now()}`, title: '5. Calentamientos Hanon Simplificados N.1', url: 'https://www.youtube.com/embed/5E_KpRtWPy7', duration: '05:20' },
      { id: `sv6-${Date.now()}`, title: '6. Estiramiento Diario Intensivo del Pianista', url: 'https://www.youtube.com/embed/6F_LpQtWPy8', duration: '02:00' },
      { id: `sv7-${Date.now()}`, title: '7. El Arpegio Inicial en Do Mayor', url: 'https://www.youtube.com/embed/7G_MpRtWPy9', duration: '03:40' },
      { id: `sv8-${Date.now()}`, title: '8. Correcciones de Altura Correcta del Banco', url: 'https://www.youtube.com/embed/8H_NpRtWPy0', duration: '04:05' },
      { id: `sv9-${Date.now()}`, title: '9. Técnica de Muñeca Elevada y Muñeca Baja', url: 'https://www.youtube.com/embed/1A_XmCsmBq0', duration: '03:50' },
      { id: `sv10-${Date.now()}`, title: '10. Resumen, Autoevaluación y Tarea de la Semana', url: 'https://www.youtube.com/embed/2B_YnDsmeP4', duration: '05:00' }
    ];

    const updatedModulesState = { ...modulesByCourse };
    const mods = updatedModulesState[vidCourseId] ? [...updatedModulesState[vidCourseId]] : [];
    
    const modIdx = mods.findIndex(m => m.id === vidModuleId);
    if (modIdx === -1) return;
    
    const updatedMod = { ...mods[modIdx] };
    const updatedLessons = [...updatedMod.lessons];
    
    const lesIdx = updatedLessons.findIndex(l => l.id === vidLessonId);
    if (lesIdx === -1) return;
    
    const updatedLesson = { ...updatedLessons[lesIdx] };
    updatedLesson.videos = sampleVideos;
    
    updatedLessons[lesIdx] = updatedLesson;
    updatedMod.lessons = updatedLessons;
    mods[modIdx] = updatedMod;
    updatedModulesState[vidCourseId] = mods;
    
    onUpdateModulesByCourse(updatedModulesState);
    showFeedback('¡Cargada con éxito la tanda de 10 videos de piano recomendada para esta clase!');
  };

  // Delete video from selected lesson playlist
  const handleDeleteVideo = (vidId: string) => {
    const updatedModulesState = { ...modulesByCourse };
    const mods = updatedModulesState[vidCourseId] ? [...updatedModulesState[vidCourseId]] : [];
    
    const modIdx = mods.findIndex(m => m.id === vidModuleId);
    if (modIdx === -1) return;
    
    const updatedMod = { ...mods[modIdx] };
    const updatedLessons = [...updatedMod.lessons];
    
    const lesIdx = updatedLessons.findIndex(l => l.id === vidLessonId);
    if (lesIdx === -1) return;
    
    const updatedLesson = { ...updatedLessons[lesIdx] };
    updatedLesson.videos = updatedLesson.videos ? updatedLesson.videos.filter(v => v.id !== vidId) : [];
    
    updatedLessons[lesIdx] = updatedLesson;
    updatedMod.lessons = updatedLessons;
    mods[modIdx] = updatedMod;
    updatedModulesState[vidCourseId] = mods;
    
    onUpdateModulesByCourse(updatedModulesState);
    showFeedback('Vídeo de clase eliminado de la playlist.');
  };

  // Stats calculation
  const totalCourses = courses.length;
  const unlockedCoursesCount = courses.filter(c => c.unlocked).length;
  const totalComments = comments.length;
  
  // Calculate average completion rate of unlocked courses
  let totalLessons = 0;
  let completedLessons = 0;
  Object.values(modulesByCourse).forEach(modules => {
    modules.forEach(m => {
      m.lessons.forEach(l => {
        totalLessons++;
        if (l.completed) completedLessons++;
      });
    });
  });
  const avgCompletionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const showFeedback = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // 1. Reset all student progress to 0%
  const handleResetAllProgress = () => {
    if (!confirm('¿Estás seguro que deseas reiniciar TODO tu progreso? Se marcarán las lecciones como no completadas.')) {
      return;
    }

    const resetModules: Record<string, Module[]> = {};
    Object.keys(modulesByCourse).forEach((courseId) => {
      const originalModules = modulesByCourse[courseId];
      resetModules[courseId] = originalModules.map((mod, modIdx) => {
        const updatedLessons = mod.lessons.map((lesson, lessonIdx) => {
          // Lock lessons after index 0 or first module's index 0
          const shouldBeLocked = !((modIdx === 0 && lessonIdx === 0) || (mod.id === 'theory-m1'));
          return {
            ...lesson,
            completed: false, // reset setting
            locked: shouldBeLocked,
          };
        });
        return {
          ...mod,
          progress: 0,
          lessons: updatedLessons
        };
      });
    });

    onUpdateModulesByCourse(resetModules);
    showFeedback('¡Progreso de todos los módulos reiniciado a 0% con éxito!');
  };

  // 2. Unlock all existing courses in a single click
  const handleUnlockAllCourses = () => {
    const updated = courses.map(c => ({ ...c, unlocked: true }));
    onUpdateCourses(updated);
    showFeedback('¡Felicidades! Se han desbloqueado los 6 cursos de la Academia.');
  };

  // 3. Post a teacher comment / official announcement
  const handlePostAnnouncement = (e: FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    const newAnnouncement: Comment = {
      id: `announcement-${Date.now()}`,
      userName: 'Carlos Mendoza (Director)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', // Teacher Avatar
      role: 'teacher',
      text: announcementText,
      timestamp: 'Hace 1 seg | Anuncio Oficial'
    };

    onUpdateComments([newAnnouncement, ...comments]);
    setAnnouncementText('');
    showFeedback('¡Anuncio oficial publicado en discusiones de aula!');
  };

  // 4. Delete comment
  const handleDeleteComment = (commentId: string) => {
    const filtered = comments.filter(c => c.id !== commentId);
    onUpdateComments(filtered);
    showFeedback('Comentario de la discusión eliminado.');
  };

  return (
    <div className="space-y-6 pb-24 text-left animate-fade-in" id="admin-control-panel-container">
      {/* Back button and title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onGoToTab('perfil')}
            className="p-2 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            id="admin-btn-back"
            title="Volver al perfil"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="space-y-0.5">
            <h2 className="text-xl font-display font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="text-brand-primary animate-pulse" size={22} />
              Panel de Control Escolar
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Consola de administración académica del director y profesores de Armonía.
            </p>
          </div>
        </div>

        <button
          onClick={() => onGoToTab('aula')}
          className="px-3.5 py-1.5 bg-brand-primary hover:brightness-110 text-white font-mono text-[11px] font-bold rounded-lg cursor-pointer transition-all shadow-sm flex items-center gap-1.5"
          id="admin-btn-preview-class"
        >
          <Compass size={13} />
          Ir al Aula Virtual
        </button>
      </div>

      {/* Success notification flag */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-bounce shadow-sm">
          <Sparkles size={14} className="text-emerald-500" />
          {successMessage}
        </div>
      )}

      {/* Grid of Key Performance indicators */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4" id="admin-kpis-grid">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase">Cursos Totales</span>
            <BookOpen size={16} className="text-brand-primary" />
          </div>
          <span className="text-2xl font-mono font-black text-slate-900 block">{totalCourses}</span>
          <span className="text-[10px] text-slate-400 font-semibold block">Catálogo completo activo</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase">Acceso de Alumno</span>
            <CheckCircle size={16} className="text-emerald-500" />
          </div>
          <span className="text-2xl font-mono font-black text-slate-900 block">
            {unlockedCoursesCount} / {totalCourses}
          </span>
          <span className="text-[10px] text-slate-500 font-mono font-bold block">
            {Math.round((unlockedCoursesCount / totalCourses) * 100)}% desbloqueados
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase">Comentarios</span>
            <MessageSquare size={16} className="text-brand-secondary" />
          </div>
          <span className="text-2xl font-mono font-black text-slate-900 block">{totalComments}</span>
          <span className="text-[10px] text-slate-400 font-semibold block">Discusiones de alumnos</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-mono font-bold uppercase">Comprensión Promedio</span>
            <TrendingUp size={16} className="text-orange-500" />
          </div>
          <span className="text-2xl font-mono font-black text-slate-900 block">{avgCompletionRate}%</span>
          <span className="text-[10px] text-slate-400 font-semibold block">Lecciones completadas</span>
        </div>
      </section>

      {/* Main split work space */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Quick Admin Tools */}
        <div className="lg:col-span-6 space-y-6">
          {/* Quick Setup Actions Card */}
          <section className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm relative overflow-hidden" id="admin-setup-actions">
            <div className="space-y-1">
              <h3 className="text-sm font-display font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Layers size={14} className="text-brand-primary" />
                Acciones Escolares Rápidas
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold">
                Controles rápidos para ajustar el simulador de datos con un clic.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Reset progress */}
              <button
                onClick={handleResetAllProgress}
                className="p-3 bg-slate-50 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-800 hover:text-red-600 rounded-xl text-xs font-bold text-left transition-all cursor-pointer flex flex-col gap-2 shadow-inner group"
                id="btn-admin-reset-progress"
              >
                <div className="p-1.5 bg-slate-200 text-slate-600 rounded-lg group-hover:bg-red-200 group-hover:text-red-600 w-fit">
                  <RotateCcw size={14} />
                </div>
                <div>
                  <span className="block font-extrabold text-[11px]">Reiniciar Progreso</span>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold group-hover:text-red-500">Regresa todas las lecciones a 0%</span>
                </div>
              </button>

              {/* Unlock everything */}
              <button
                onClick={handleUnlockAllCourses}
                className="p-3 bg-slate-50 border border-slate-200 hover:border-brand-primary/40 hover:bg-brand-primary/5 text-slate-800 hover:text-brand-primary rounded-xl text-xs font-bold text-left transition-all cursor-pointer flex flex-col gap-2 shadow-inner group"
                id="btn-admin-unlock-all"
              >
                <div className="p-1.5 bg-slate-200 text-slate-600 rounded-lg group-hover:bg-brand-primary/20 group-hover:text-brand-primary w-fit">
                  <Key size={14} />
                </div>
                <div>
                  <span className="block font-extrabold text-[11px]">Desbloquear Todos</span>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold group-hover:text-brand-primary/80">Desbloquea los 6 cursos gratis</span>
                </div>
              </button>
            </div>
          </section>

          {/* School config adjustments */}
          <section className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm" id="admin-capacity-card">
            <h3 className="text-sm font-display font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Users size={14} className="text-brand-tertiary" />
              Sede Principal y Capacidad
            </h3>

            <div className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Capacidad Simbólica del Servidor</span>
                  <span className="font-mono font-bold text-brand-secondary">{simulatedCapacity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={simulatedCapacity}
                  onChange={(e) => setSimulatedCapacity(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 border border-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
                  id="admin-capacity-slider"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 block">SOPORTE DE ALUMNO ACTIVO</span>
                <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                  <strong>Alumno actual:</strong> {studentName} <br />
                  <strong>Matrícula Registrada:</strong> ARM-2026-09812 <br />
                  <strong>Conexión:</strong> Segura SSL LocalStorage
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Announcement and Comment Feed Modding */}
        <div className="lg:col-span-6 space-y-6">
          {/* Post announcement form */}
          <section className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4" id="admin-announcement-card">
            <h3 className="text-sm font-display font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <PlusCircle size={14} className="text-brand-secondary" />
              Publicar Anuncio de Profesor
            </h3>

            <form onSubmit={handlePostAnnouncement} className="space-y-3.5">
              <div className="space-y-1 text-xs">
                <label className="font-mono font-bold text-slate-500" htmlFor="admin-announcement-input">Mensaje del Profesor (Muestra Firma Oficial)</label>
                <textarea
                  id="admin-announcement-input"
                  rows={3}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="Escribe la felicitación o aviso oficial rítmico para el muro..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:border-brand-primary focus:bg-white shadow-inner font-mono font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={!announcementText.trim()}
                className="w-full py-2 bg-gradient-to-r from-brand-secondary to-brand-tertiary hover:brightness-110 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wide rounded-xl cursor-pointer transition-all shadow"
                id="admin-btn-post-pub"
              >
                Megafonía: Publicar en Muro
              </button>
            </form>
          </section>

          {/* Moderate comments timeline */}
          <section className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3" id="admin-moderate-card">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-display font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Trash2 size={14} className="text-red-500" />
                Moderar Comentarios ({comments.length})
              </h3>
              <span className="text-[10px] font-mono text-slate-400 font-bold">Muro de Discusión</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1" id="admin-mod-scroll">
              {comments.length === 0 ? (
                <div className="text-center py-6 text-slate-400 italic text-[11px] font-semibold border-2 border-dashed border-slate-100 rounded-xl bg-slate-50">
                  No hay comentarios públicos en este momento.
                </div>
              ) : (
                comments.map((comm) => (
                  <div key={comm.id} className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-200 text-[11px] flex justify-between items-start gap-4 shadow-sm" id={`admin-mod-comment-${comm.id}`}>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-1">
                        <span className={`font-bold ${comm.role === 'teacher' ? 'text-brand-primary' : 'text-slate-800'}`}>
                          {comm.userName}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">({comm.role})</span>
                      </div>
                      <p className="text-slate-600 line-clamp-2 leading-relaxed font-semibold">"{comm.text}"</p>
                    </div>

                    <button
                      onClick={() => handleDeleteComment(comm.id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 hover:text-red-650 rounded-lg cursor-pointer transition-colors"
                      title="Eliminar este comentario"
                      id={`btn-delete-comment-${comm.id}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Full Width Video & Class Link Management administrative module */}
        <div className="col-span-1 lg:col-span-12 space-y-6">
          <section className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md space-y-6 text-left relative overflow-hidden" id="admin-video-links-manager-card">
            {/* Ambient subtle glowing design effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <h3 className="text-base font-display font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <PlayCircle size={18} className="text-brand-primary animate-pulse" />
                  Gestión de Videos y Clases Virtuales
                </h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Configura y añade los vínculos de video interactivos de las clases. Selecciona la categoría, curso y carga entre 6 y 10 videos por clase.
                </p>
              </div>

              {/* Sample Batch Loader Button */}
              <button
                type="button"
                onClick={handleLoadSampleBatch}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white font-mono text-[11px] font-black rounded-lg cursor-pointer transition-all shadow flex items-center gap-1.5"
                title="Satisface el requisito cargando 10 videos didácticos preconfigurados de piano de una sola vez"
              >
                🔥 Cargar Lote de Pruebas (6-10 Videos Piano)
              </button>
            </div>

            {/* Step 1: Cascade Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-400">1. Categoría de Instrumento</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Piano', 'Teoría', 'Guitarra'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className={`px-3 py-1.5 text-xs font-bold border rounded-lg transition-all cursor-pointer ${
                        vidCategory === cat
                          ? 'bg-brand-primary border-brand-primary text-white shadow-sm'
                          : 'bg-slate-50 border-slate-205 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cat === 'Piano' ? '🎹 Piano' : cat === 'Teoría' ? '📚 Teoría' : '🎸 Guitarra'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-400" htmlFor="course-select-admin">2. Selecciona Curso</label>
                <select
                  id="course-select-admin"
                  value={vidCourseId}
                  onChange={(e) => handleCourseSelect(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-205 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-primary focus:bg-white shadow-inner font-bold cursor-pointer"
                >
                  {courses
                    .filter(c => c.category.toLowerCase() === vidCategory.toLowerCase() || vidCategory === 'Todos')
                    .map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))
                  }
                  {courses.filter(c => c.category.toLowerCase() === vidCategory.toLowerCase()).length === 0 && (
                    <option value="">Selecciona categoria...</option>
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-400" htmlFor="module-select-admin">3. Selecciona Módulo</label>
                <select
                  id="module-select-admin"
                  value={vidModuleId}
                  onChange={(e) => handleModuleSelect(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-205 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-primary focus:bg-white shadow-inner font-bold cursor-pointer"
                >
                  {(modulesByCourse[vidCourseId] || []).map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                  {(modulesByCourse[vidCourseId] || []).length === 0 && (
                    <option value="">No hay módulos</option>
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-400" htmlFor="lesson-select-admin">4. Selecciona Clase / Lección</label>
                <select
                  id="lesson-select-admin"
                  value={vidLessonId}
                  onChange={(e) => setVidLessonId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-205 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-primary focus:bg-white shadow-inner font-bold cursor-pointer"
                >
                  {((modulesByCourse[vidCourseId] || []).find(m => m.id === vidModuleId)?.lessons || []).map(l => (
                    <option key={l.id} value={l.id}>{l.number} - {l.title}</option>
                  ))}
                  {((modulesByCourse[vidCourseId] || []).find(m => m.id === vidModuleId)?.lessons || []).length === 0 && (
                    <option value="">No hay clases</option>
                  )}
                </select>
              </div>
            </div>

            {/* Split Grid for add new link form, and active checklist display */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 border-t border-slate-100">
              
              {/* Add form: Left column */}
              <div className="lg:col-span-5 bg-slate-50/70 p-4 border border-slate-200 rounded-xl space-y-4" id="add-video-form-subpanel">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <PlusCircle size={14} className="text-brand-primary" />
                    Enlace de Video Individual
                  </h4>
                  <p className="text-[10px] text-slate-500 italic">Ingresa un nuevo vínculo para agregarlo a la playlist didáctica.</p>
                </div>

                <form onSubmit={handleAddVideo} className="space-y-3 font-semibold text-xs text-slate-600">
                  <div className="space-y-1">
                    <label htmlFor="new-video-title-input" className="font-mono text-[10px] text-slate-450 uppercase block">Título del Fragmento</label>
                    <input
                      id="new-video-title-input"
                      type="text"
                      required
                      value={newVidTitle}
                      onChange={(e) => setNewVidTitle(e.target.value)}
                      placeholder="Ej. 1. Posición idónea para acompañamiento"
                      className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-250 text-slate-800 focus:outline-none focus:border-brand-primary shadow-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="new-video-url-input" className="font-mono text-[10px] text-slate-455 uppercase block">Vínculo del Video (YouTube o Transmisión)</label>
                    <input
                      id="new-video-url-input"
                      type="text"
                      required
                      value={newVidUrl}
                      onChange={(e) => setNewVidUrl(e.target.value)}
                      placeholder="Ej. https://www.youtube.com/embed/1A_XmCsmBq0"
                      className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-250 text-slate-800 focus:outline-none focus:border-brand-primary shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="new-video-duration-input" className="font-mono text-[10px] text-slate-455 uppercase block">Duración</label>
                      <input
                        id="new-video-duration-input"
                        type="text"
                        value={newVidDuration}
                        onChange={(e) => setNewVidDuration(e.target.value)}
                        placeholder="Ej. 03:45"
                        className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-250 text-slate-800 focus:outline-none focus:border-brand-primary shadow-sm"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-1.5 bg-brand-primary hover:brightness-110 text-white text-xs font-bold rounded-lg cursor-pointer transition-all shadow"
                        id="btn-submit-single-video"
                      >
                        Añadir Video ✔
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Videos display listing: Right Column */}
              <div className="lg:col-span-7 space-y-3" id="videos-checklist-feedback">
                <div className="flex justify-between items-center bg-slate-100/60 p-2 border border-slate-200 rounded-lg">
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                    Playlist Actual ({((modulesByCourse[vidCourseId] || []).find(m => m.id === vidModuleId)?.lessons.find(l => l.id === vidLessonId)?.videos || []).length} videos cargados)
                  </span>
                  
                  {/* Visual warning if there are fewer than 6 videos */}
                  {((modulesByCourse[vidCourseId] || []).find(m => m.id === vidModuleId)?.lessons.find(l => l.id === vidLessonId)?.videos || []).length < 6 ? (
                    <span className="text-[9px] font-mono font-bold bg-rose-50 text-rose-650 px-2 py-0.5 border border-rose-220 rounded-full flex items-center gap-1 animate-pulse">
                      <AlertTriangle size={10} /> Carga de 6 a 10 videos requerida
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono font-bold bg-green-50 text-green-650 px-2 py-0.5 border border-green-220 rounded-full">
                      ✓ Cantidad Óptima (6-10 Videos)
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1" id="admin-videos-list-scroller">
                  {(((modulesByCourse[vidCourseId] || []).find(m => m.id === vidModuleId)?.lessons.find(l => l.id === vidLessonId)?.videos || [])).length === 0 ? (
                    <div className="text-center py-8 text-slate-400 italic text-[11px] font-semibold border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center gap-2">
                      <span>No hay videos cargados para esta clase de música todavía.</span>
                      <button
                        type="button"
                        onClick={handleLoadSampleBatch}
                        className="px-3 py-1 bg-brand-secondary/10 hover:bg-brand-secondary/25 text-brand-secondary border border-brand-secondary/20 text-[10px] rounded"
                      >
                        ⚡ Cargar Lote de Demostración Automático
                      </button>
                    </div>
                  ) : (
                    ((modulesByCourse[vidCourseId] || []).find(m => m.id === vidModuleId)?.lessons.find(l => l.id === vidLessonId)?.videos || []).map((v, i) => (
                      <div key={v.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100/50 hover:border-brand-primary/20 flex justify-between items-center transition-all text-xs">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded bg-brand-primary/10 text-brand-primary font-mono text-[10px] font-black flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <div className="space-y-0.5 min-w-0">
                            <span className="font-extrabold text-slate-850 truncate block leading-tight">{v.title}</span>
                            <span className="text-[9px] font-mono text-slate-400 truncate block">{v.url}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {v.duration && (
                            <span className="text-[9px] font-mono bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                              {v.duration}
                            </span>
                          )}
                          <button
                            onClick={() => handleDeleteVideo(v.id)}
                            className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded cursor-pointer transition-colors"
                            title="Eliminar de la clase"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
