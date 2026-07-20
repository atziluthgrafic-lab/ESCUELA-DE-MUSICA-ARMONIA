/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeView from './components/HomeView';
import CoursesView from './components/CoursesView';
import ClassroomView from './components/ClassroomView';
import WhatsAppView from './components/WhatsAppView';
import ProfileView from './components/ProfileView';
import AdminView from './components/AdminView';

import { ActiveTab, Course, Module, Comment, BookingData } from './types';
import { 
  INITIAL_COURSES, 
  INITIAL_MODULES_BY_COURSE, 
  getFallbackModules, 
  INITIAL_DISCUSSIONS,
  playNote
} from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('inicio');
  const [courses, setCourses] = useState<Course[]>([]);
  const [modulesByCourse, setModulesByCourse] = useState<Record<string, Module[]>>({});
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedCourseForClass, setSelectedCourseForClass] = useState<string>('piano-maestro');
  const [interestInstrument, setInterestInstrument] = useState<string>('Piano');

  const studentName = 'Estivenson';
  const studentEmail = 'estivenson72@gmail.com';

  // Synchronize initial state with localStorage
  useEffect(() => {
    try {
      const storedCourses = localStorage.getItem('armonia_courses');
      const storedModules = localStorage.getItem('armonia_modules');
      const storedComments = localStorage.getItem('armonia_comments');

      if (storedCourses) {
        const parsed = JSON.parse(storedCourses) as Course[];
        // Enforce only the piano-maestro course is active (unlocked), others deactivated (locked)
        // Also ensure title and price of all courses are updated
        const updated = parsed.map(c => {
          if (c.id === 'piano-maestro') {
            return { 
              ...c, 
              title: 'PAQUETE ARMONIA START', 
              price: '$690.000 COP',
              unlocked: true 
            };
          } else {
            return { 
              ...c, 
              price: '$690.000 COP',
              unlocked: false 
            };
          }
        });
        setCourses(updated);
        localStorage.setItem('armonia_courses', JSON.stringify(updated));
      } else {
        const updated = INITIAL_COURSES.map(c => {
          if (c.id === 'piano-maestro') {
            return { 
              ...c, 
              title: 'PAQUETE ARMONIA START', 
              price: '$690.000 COP',
              unlocked: true 
            };
          } else {
            return { 
              ...c, 
              price: '$690.000 COP',
              unlocked: false 
            };
          }
        });
        setCourses(updated);
        localStorage.setItem('armonia_courses', JSON.stringify(updated));
      }

      if (storedModules) {
        setModulesByCourse(JSON.parse(storedModules));
      } else {
        setModulesByCourse(INITIAL_MODULES_BY_COURSE);
        localStorage.setItem('armonia_modules', JSON.stringify(INITIAL_MODULES_BY_COURSE));
      }

      if (storedComments) {
        setComments(JSON.parse(storedComments));
      } else {
        setComments(INITIAL_DISCUSSIONS);
        localStorage.setItem('armonia_comments', JSON.stringify(INITIAL_DISCUSSIONS));
      }
    } catch (e) {
      console.warn('LocalStorage error, using memory state fallback.', e);
      setCourses(INITIAL_COURSES);
      setModulesByCourse(INITIAL_MODULES_BY_COURSE);
      setComments(INITIAL_DISCUSSIONS);
    }
  }, []);

  // Update states
  const saveCoursesToStorage = (updated: Course[]) => {
    setCourses(updated);
    try {
      localStorage.setItem('armonia_courses', JSON.stringify(updated));
    } catch (_) {}
  };

  const saveModulesToStorage = (updated: Record<string, Module[]>) => {
    setModulesByCourse(updated);
    try {
      localStorage.setItem('armonia_modules', JSON.stringify(updated));
    } catch (_) {}
  };

  const saveCommentsToStorage = (updated: Comment[]) => {
    setComments(updated);
    try {
      localStorage.setItem('armonia_comments', JSON.stringify(updated));
    } catch (_) {}
  };

  const handleBookClass = (data: BookingData) => {
    setInterestInstrument(data.instrumento);
    // Simulate scheduling and save details locally if needed
  };

  const handleUnlockCourse = (courseId: string) => {
    const updated = courses.map((course) => {
      if (course.id === courseId) {
        return { ...course, unlocked: true };
      }
      return course;
    });
    saveCoursesToStorage(updated);

    // Initialize modules for this course if not exists
    if (!modulesByCourse[courseId]) {
      const titleSuffix = courseId.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      const newModules = getFallbackModules(courseId, titleSuffix);
      const updatedModules = { ...modulesByCourse, [courseId]: newModules };
      saveModulesToStorage(updatedModules);
    }

    // Set as current classroom course
    setSelectedCourseForClass(courseId);
  };

  const handleGoToClassroom = (courseId: string) => {
    setSelectedCourseForClass(courseId);
    setActiveTab('aula');
  };

  const handleCompleteLesson = (courseId: string, moduleId: string, lessonId: string) => {
    const courseModules = modulesByCourse[courseId] || [];
    
    const updatedModules = courseModules.map((mod) => {
      if (mod.id === moduleId) {
        const updatedLessons = mod.lessons.map((lesson) => {
          if (lesson.id === lessonId) {
            return { ...lesson, completed: true };
          }
          return lesson;
        });

        // Unlock next lesson in order if exists
        const currentLessonIdx = mod.lessons.findIndex(l => l.id === lessonId);
        if (currentLessonIdx !== -1 && currentLessonIdx + 1 < updatedLessons.length) {
          updatedLessons[currentLessonIdx + 1] = {
            ...updatedLessons[currentLessonIdx + 1],
            locked: false
          };
        }

        // Recalculate completed percentage
        const completedCount = updatedLessons.filter(l => l.completed).length;
        const total = updatedLessons.length;
        const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;

        return { ...mod, lessons: updatedLessons, progress };
      }
      return mod;
    });

    const fullUpdatedModulesByCourse = {
      ...modulesByCourse,
      [courseId]: updatedModules
    };
    saveModulesToStorage(fullUpdatedModulesByCourse);
  };

  const handlePostComment = (comment: Comment) => {
    const updated = [comment, ...comments];
    saveCommentsToStorage(updated);
  };

  // Find currently selected course in state
  const activeClassroomCourse = courses.find(c => c.id === selectedCourseForClass) || courses[0] || INITIAL_COURSES[0];
  const activeClassroomModules = modulesByCourse[activeClassroomCourse?.id || 'piano-maestro'] || INITIAL_MODULES_BY_COURSE['piano-maestro'];

  // Count uncompleted lessons in active dynamic course
  const totalClassroomLessons = activeClassroomModules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedClassroomLessons = activeClassroomModules.reduce((acc, m) => acc + m.lessons.filter(l => l.completed).length, 0);
  const classroomUncompletedCount = totalClassroomLessons - completedClassroomLessons;

  const unlockedCourses = courses.filter(c => c.unlocked);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans relative flex flex-col justify-between overflow-x-hidden selection:bg-[#ffb0cc] selection:text-slate-950" id="app-root-container">
      {/* Background glow stage lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-brand-secondary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#ffb786]/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Navigation Header */}
      <Header 
        onInscribirme={() => setActiveTab('cursos')}
        onGoToProfile={() => setActiveTab('perfil')}
        studentName={studentName}
      />

      {/* Tab Switcher Area */}
      <main className="flex-grow max-w-5xl mx-auto w-full px-2 sm:px-6 py-6" id="app-viewport">
        {activeTab === 'inicio' && (
          <HomeView 
            onGoToCourses={() => setActiveTab('cursos')}
            onBookClass={handleBookClass}
            onOpenWhatsApp={() => {
              setActiveTab('whatsapp');
            }}
          />
        )}

        {activeTab === 'cursos' && (
          <CoursesView 
            courses={courses}
            onUnlockCourse={handleUnlockCourse}
            onGoToClassroom={handleGoToClassroom}
          />
        )}

        {activeTab === 'aula' && (
          <ClassroomView 
            course={activeClassroomCourse}
            modules={activeClassroomModules}
            comments={comments}
            onCompleteLesson={handleCompleteLesson}
            onPostComment={handlePostComment}
          />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppView 
            initialInstrument={interestInstrument}
            onBookClick={() => setActiveTab('inicio')}
          />
        )}

        {activeTab === 'perfil' && (
          <ProfileView 
            unlockedCourses={unlockedCourses}
            completedLecturesCount={completedClassroomLessons}
            userName={studentName}
            userEmail={studentEmail}
            onEnterAdmin={() => {
              setActiveTab('admin');
              playNote(523.25, 'sine', 0.1);
            }}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView 
            courses={courses}
            modulesByCourse={modulesByCourse}
            comments={comments}
            onUpdateCourses={saveCoursesToStorage}
            onUpdateModulesByCourse={saveModulesToStorage}
            onUpdateComments={saveCommentsToStorage}
            onGoToTab={(tab) => {
              setActiveTab(tab);
              playNote(440, 'sine', 0.05);
            }}
            studentName={studentName}
          />
        )}
      </main>

      {/* Styled Footer Block matching screenshots */}
      <footer className="w-full bg-slate-50 border-t border-slate-100 py-8 px-6 text-center text-xs space-y-4 pb-28 mt-12" id="app-brand-footer">
        <div className="space-y-1">
          <span className="text-sm font-display font-black bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent font-extrabold uppercase tracking-wide">
            Armonía
          </span>
          <p className="text-[10px] text-slate-400 font-mono italic">
            "Deja que la música te toque" — Escuela de Música Elite v2.16
          </p>
        </div>

        <div className="flex justify-center gap-6 text-slate-500 font-mono text-[10px]">
          <button className="hover:text-slate-800 transition-colors" onClick={() => alert('Políticas de Privacidad del Alumno Armonía.')}>Privacidad</button>
          <button className="hover:text-slate-800 transition-colors" onClick={() => alert('Términos de servicio y condiciones de inscripción.')}>Términos</button>
          <button className="hover:text-slate-800 transition-colors" onClick={() => alert('Contacto Escuela: +52 (55) 2831 9281 | hola@armoniamusica.com')}>Contacto</button>
          <button className="hover:text-slate-800 transition-colors" onClick={() => alert('Soporte técnico para alumnos activos 24/7.')}>Soporte</button>
        </div>

        <p className="text-[10px] text-slate-400 font-mono">
          © 2026 Escuela de Música Armonía. Todos los derechos reservados.
        </p>
      </footer>

      {/* Navigation bottom bar */}
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          // Play a tiny audio tick for physical response when switching tabs 
          playNote(440, 'sine', 0.05); // A4 tick
        }}
        uncompletedLessonsCount={classroomUncompletedCount}
      />
    </div>
  );
}
