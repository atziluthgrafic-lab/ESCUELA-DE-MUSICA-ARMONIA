/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Course, Module, Comment } from './types';

// Audio Synthesis Helper using Web Audio API
let audioCtx: AudioContext | null = null;

export function playNote(frequency: number, type: 'sine' | 'triangle' | 'square' | 'sawtooth' = 'sine', duration: number = 0.6) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    // Smooth envelope (attack, decay, sustain, release)
    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.12, now + 0.2); // Decay
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration); // Release
    
    osc.start(now);
    osc.stop(now + duration + 0.1);
  } catch (error) {
    console.warn('Audio synthesis not supported or blocked by user interaction gesture: ', error);
  }
}

// Map music note names to frequencies (C4 reference)
export const NOTE_FREQS: Record<string, number> = {
  'DO': 261.63,  // C4
  'DO#': 277.18, // C#4
  'RE': 293.66,  // D4
  'RE#': 311.13, // D#4
  'MI': 329.63,  // E4
  'FA': 349.23,  // F4
  'FA#': 369.99, // F#4
  'SOL': 392.00, // G4
  'SOL#': 415.30, // G#4
  'LA': 440.00,  // A4
  'LA#': 466.16, // A#4
  'SI': 493.88,  // B4
  'DO5': 523.25, // C5
  'RE5': 587.33, // D5
  'MI5': 659.25, // E5
  'FA5': 698.46, // F5
  'SOL5': 783.99, // G5
};

// Course modules structure
export const INITIAL_MODULES_BY_COURSE: Record<string, Module[]> = {
  'piano-maestro': [
    {
      id: 'piano-m1',
      title: 'Módulo 1: Fundamentos de las Comodidades del Teclado',
      description: 'Alineación corporal correcta, digitación básica y reconocimiento fluido de notas.',
      progress: 100,
      lessons: [
        { 
          id: 'p1', 
          number: '01', 
          title: 'Postura y Coordinación de Manos', 
          duration: '10:45', 
          completed: true, 
          locked: false, 
          description: 'Aprende los pilares físicos para evitar tensiones de muñeca y optimizar el sonido natural.',
          videos: [
            { id: 'pv1', title: '1. Postura de Espalda y Distancia del Asiento', url: 'https://www.youtube.com/embed/1A_XmCsmBq0', duration: '02:15' },
            { id: 'pv2', title: '2. Forma de la Mano y "Sostener la Manzana"', url: 'https://www.youtube.com/embed/2B_YnDsmeP4', duration: '01:40' },
            { id: 'pv3', title: '3. El Angulo de las Muñecas y Relajación', url: 'https://www.youtube.com/embed/3C_ZoEtkRy5', duration: '03:10' },
            { id: 'pv4', title: '4. Coordinación Básica de Izquierda y Derecha', url: 'https://www.youtube.com/embed/4D_FeGrkTy6', duration: '04:25' },
            { id: 'pv5', title: '5. Calentamiento de Dedos: Ejercicio de 5 Notas', url: 'https://www.youtube.com/embed/5E_KpRtWPy7', duration: '03:45' },
            { id: 'pv6', title: '6. Estiramiento Preventivo de Tendones', url: 'https://www.youtube.com/embed/6F_LpQtWPy8', duration: '02:05' },
            { id: 'pv7', title: '7. El Toque de Peso Natural (Gravedad)', url: 'https://www.youtube.com/embed/7G_MpRtWPy9', duration: '04:12' },
            { id: 'pv8', title: '8. Corrección de Falanges Colapsadas', url: 'https://www.youtube.com/embed/8H_NpRtWPy0', duration: '03:00' }
          ]
        },
        { id: 'p2', number: '02', title: 'Las Notas Blancas e Intervalos Básicos', duration: '14:20', completed: true, locked: false, description: 'Cómo identificar rápidamente Do, Re, Mi, Fa, Sol, La, Si.' }
      ]
    },
    {
      id: 'piano-m2',
      title: 'Módulo 2: Ejercicios de Independencia de Manos',
      description: 'Ejercicios de Hanon y pequeños estudios para liberar los cinco dedos de cada mano de forma independiente.',
      progress: 50,
      lessons: [
        { id: 'p3', number: '03', title: 'Hanon 1: Fuerza y Fluidez', duration: '12:15', completed: true, locked: false, description: 'El ejercicio base número 1 para balancear la fuerza de ambas manos.' },
        { id: 'p4', number: '04', title: 'Ritmo Cruzado: Polirritmia 2 contra 3', duration: '18:50', completed: false, locked: false, description: 'Desafío rítmico para independizar compás binario y ternario.' }
      ]
    },
    {
      id: 'piano-m3',
      title: 'Módulo 3: Primeras Melodías y Acordes Clásicos',
      description: 'Interpretación de temas eternos de Beethoven y Mozart estructurados de manera fácil.',
      progress: 0,
      lessons: [
        { id: 'p5', number: '05', title: 'Para Elisa: Primeros Compases', duration: '20:10', completed: false, locked: true, description: 'Sección principal y balance de dinámicas fuerte-piano.' },
        { id: 'p6', number: '06', title: 'Acordes Mayores e Inversiones', duration: '24:00', completed: false, locked: true, description: 'Las tres posiciones indispensables para acompañar cualquier melodía.' }
      ]
    }
  ],
  'guitarra-acustica': [
    {
      id: 'guitar-m1',
      title: 'Módulo 1: Tus Primeros Acordes y Rasgueo Básico',
      description: 'Acompaña tus primeras canciones con solo 4 acordes infalibles: Sol, Do, Mi menor y Re.',
      progress: 100,
      lessons: [
        { id: 'g1', number: '01', title: 'Afinación Perfecta y Anatomía', duration: '08:30', completed: true, locked: false, description: 'Usa afinadores digitales y cuida la tensión del mástil.' },
        { id: 'g2', number: '02', title: 'El Rasgueo Universal (Pop/Rock)', duration: '15:10', completed: true, locked: false, description: 'Abajo, abajo, arriba, arriba, abajo, arriba. El patrón rítmico esencial.' }
      ]
    },
    {
      id: 'guitar-m2',
      title: 'Módulo 2: Introducción a la Cejilla y Acordes Barré',
      description: 'Supera el mítico obstáculo del Fa Mayor con técnicas ergonómicas de apoyo del pulgar.',
      progress: 0,
      lessons: [
        { id: 'g3', number: '03', title: 'El Truco Biomecánico del Fa', duration: '22:45', completed: false, locked: false, description: 'Cómo exprimir la fuerza de gravedad para lograr notas limpias sin cansancio.' },
        { id: 'g4', number: '04', title: 'Círculo de Sol con Cejillas', duration: '20:30', completed: false, locked: true, description: 'Transportando el tono con barras fijas en el diapasón.' }
      ]
    }
  ],
  'teoria-armonia': [
    {
      id: 'theory-m1',
      title: 'Módulo 1: Las Escalas y Claves Musicales',
      description: 'Comprende el pentagrama, la clave de Sol, de Fa y la estructura matemática del tono y semitono.',
      progress: 100,
      lessons: [
        { id: 't1', number: '01', title: 'El Pentagrama y Sonido', duration: '11:20', completed: true, locked: false, description: 'Ubicación visual de frecuencias altas y bajas.' },
        { id: 't2', number: '02', title: 'Estructura de la Escala Mayor', duration: '16:05', completed: true, locked: false, description: 'Tono, Tono, Semitono, Tono, Tono, Tono, Semitono. La fórmula mágica.' }
      ]
    },
    {
      id: 'theory-m2',
      title: 'Módulo 2: Intervalos y Tríadas Armónicas',
      description: 'Construcción teórica de acordes mayores, menores, disminuidos y aumentados.',
      progress: 50,
      lessons: [
        { id: 't3', number: '03', title: 'Intervalos Justos y Mayores', duration: '13:40', completed: true, locked: false, description: 'Segunda, tercera, cuarta justa, quinta justa, sexta, séptima.' },
        { id: 't4', number: '04', title: 'Construcción de Tríadas Consonantes', duration: '19:15', completed: false, locked: false, description: 'Combinando fundamentales, terceras y quintas para colores estables.' }
      ]
    },
    {
      id: 'theory-m3',
      title: 'Módulo 3: El Círculo de Quintas',
      description: 'Dominar el círculo de quintas es esencial para entender la armonía funcional, las tonalidades y la improvisación fluida en cualquier instrumento.',
      progress: 45,
      lessons: [
        { id: 't5', number: '01', title: 'Introducción al Círculo', duration: '12:45', completed: true, locked: false, description: 'Entiende el reloj armónico y cómo avanzar por quintas justas añade sostenidos.' },
        { id: 't6', number: '02', title: 'Intervalos de Quinta Justa', duration: '15:20', completed: true, locked: false, description: 'Ejercicios de reconocimiento auditivo de quintas ascendentes.' },
        { id: 't7', number: '03', title: 'Armaduras de Clave', duration: '18:10', completed: false, locked: true, description: 'Identificación instantánea de tonalidades mirando la armadura.' },
        { id: 't8', number: '04', title: 'Relativos Menores', duration: '22:00', completed: false, locked: true, description: 'Encuentra el tono melancólico oculto dentro de cada escala mayor.' }
      ]
    }
  ]
};

// Fallback modules list for courses that don't have specified lists
export const getFallbackModules = (courseId: string, titleSuffix: string): Module[] => {
  return [
    {
      id: `${courseId}-m1`,
      title: `Módulo 1: Iniciación al Mundo de ${titleSuffix}`,
      description: `Dominar los fundamentos, técnicas iniciales y recursos esenciales para comenzar en ${titleSuffix}.`,
      progress: 50,
      lessons: [
        { id: `${courseId}-l1`, number: '01', title: 'Introducción y Configuración', duration: '12:30', completed: true, locked: false, description: 'Todo lo indispensable que necesitas tener preparado antes de arrancar.' },
        { id: `${courseId}-l2`, number: '02', title: 'Tus Primeras Prácticas Guiadas', duration: '15:45', completed: false, locked: false, description: 'Sigue el ritmo en tiempo real paso a paso.' }
      ]
    },
    {
      id: `${courseId}-m2`,
      title: `Módulo 2: Técnicas Intermedias de ${titleSuffix}`,
      description: `Desarrolla velocidad, precisión y expresión para llevar tus habilidades en ${titleSuffix} al siguiente nivel.`,
      progress: 0,
      lessons: [
        { id: `${courseId}-l3`, number: '03', title: 'Ritmo, Sincronía y Estilo', duration: '19:20', completed: false, locked: true, description: 'Expande la forma en que sientes la métrica.' },
        { id: `${courseId}-l4`, number: '04', title: 'Repertorio y Retos Creativos', duration: '25:10', completed: false, locked: true, description: 'Proyecto práctico final aplicando las destrezas aprendidas.' }
      ]
    }
  ];
};

export const INITIAL_COURSES: Course[] = [
  {
    id: 'piano-maestro',
    title: 'PAQUETE ARMONIA START',
    price: '$690.000 COP',
    category: 'Piano',
    type: 'En Vivo',
    imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=600&auto=format&fit=crop',
    shortDescription: 'Un programa integral de 36 masterclasses online para músicos modernos en Piano.',
    description: 'Aprende a leer partituras desde tu primera lección en vivo, desde teoría clásica hasta producción digital con el rey de los instrumentos de teclado.',
    unlocked: true,
    durationInMonths: 4,
    modulesCount: 3
  },
  {
    id: 'guitarra-acustica',
    title: 'Guitarra Acústica',
    price: '$690.000 COP',
    category: 'Guitarra',
    type: 'En Línea',
    imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=600&auto=format&fit=crop',
    shortDescription: 'Domina los acordes esenciales, arpegios y técnicas de rasgueo online.',
    description: 'Explora géneros populares, aprende afinamiento de oído con herramientas web y ejercicios ergonómicos profesionales para avanzar cómodamente desde tu casa.',
    unlocked: false,
    durationInMonths: 5,
    modulesCount: 2
  },
  {
    id: 'ukelele-pop',
    title: 'Ukelele Pop',
    price: '$690.000 COP',
    category: 'Ukelele',
    type: 'Masterclass',
    imageUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=600&auto=format&fit=crop',
    shortDescription: 'Diversión, ritmo caribeño y tus canciones favoritas en 4 cuerdas 100% online.',
    description: 'El ukelele es el instrumento ideal para descubrir la música rápidamente en nuestro formato interactivo. Simple, portátil y súper divertido. Ideal para niños y jóvenes de corazón.',
    unlocked: false,
    durationInMonths: 3,
    modulesCount: 2
  },
  {
    id: 'violin-clasico',
    title: 'Violín Clásico',
    price: '$690.000 COP',
    category: 'Violín',
    type: 'En Vivo',
    imageUrl: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?q=80&w=600&auto=format&fit=crop',
    shortDescription: 'Explora la excelencia clásica en 36 mentorías online de alto nivel.',
    description: 'Perfecciona tu técnica de arco, la postura del mástil y domina la lectura de partituras e intervalos en vivo con profesores sinfónicos profesionales mediante transmisión HD.',
    unlocked: false,
    durationInMonths: 6,
    modulesCount: 2
  },
  {
    id: 'produccion-musical',
    title: 'Producción Musical',
    price: '$690.000 COP',
    category: 'Producción',
    type: 'Masterclass',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop',
    shortDescription: 'Transforma tu creatividad en 36 clases magistrales de producción digital.',
    description: 'Domina el lenguaje musical y las tecnologías desde tu home studio. Graba, mezcla, sintetiza y masteriza con Ableton Live, Logic Pro o Pro Tools de nivel profesional con nuestro soporte virtual permanente.',
    unlocked: false,
    durationInMonths: 6,
    modulesCount: 2
  },
  {
    id: 'teoria-armonia',
    title: 'Teoría y Armonía',
    price: '$690.000 COP',
    category: 'Teoría',
    type: 'En Línea',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=600&auto=format&fit=crop',
    shortDescription: 'Desbloquea los secretos de la música en 36 lecciones virtuales fundamentales.',
    description: 'Aprende a leer y entender cada nota desde el primer día en nuestra Aula Virtual interactiva. El Círculo de Quintas, armonización de escalas menores y progresión de grados.',
    unlocked: false,
    featured: true,
    durationInMonths: 4,
    modulesCount: 3
  }
];

export const INITIAL_DISCUSSIONS: Comment[] = [
  {
    id: 'c1',
    userName: 'Prof. Carlos Mendoza',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    role: 'teacher',
    text: '¡Hola a todos! Recuerden que para dominar la transición al relativo menor, solo deben bajar una Tercera Menor (3 semitonos) desde la nota fundamental mayor. Por ejemplo: Do mayor tiene como relativo menor a La menor.',
    timestamp: 'Hace 2 horas'
  },
  {
    id: 'c2',
    userName: 'Mateo González',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    role: 'student',
    text: 'Esta lección me aclaró la vida. Siempre memorizaba las tonalidades de memoria, pero ver el círculo de quintas como un reloj hace que todo tenga sentido matemático.',
    timestamp: 'Hace 1 día'
  },
  {
    id: 'c3',
    userName: 'Andrea Rojas',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    role: 'student',
    text: '¿La pista de práctica de Sol Mayor (G Major) se puede usar también para improvisar en Mi Menor (E Minor)? Como comparten la misma armadura...',
    timestamp: 'Hace 2 días'
  },
  {
    id: 'c4',
    userName: 'Prof. Carlos Mendoza',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    role: 'teacher',
    text: 'Excelente pregunta Andrea. ¡Totalmente sí! Solo asegúrate de dar mayor énfasis o reposo rítmico en la nota Mi (en lugar de Sol) para marcar la sonoridad natural eólica (menor).',
    timestamp: 'Hace 2 días'
  }
];

// Circle of Quintas Interactive Chords Map
export interface QuintasNode {
  note: string;
  relative: string;
  sharpsOrFlats: string;
  angle: number; // degrees for circular rendering
  chordFrequencies: number[]; // Major Triad frequencies
  relativeFrequencies: number[]; // Minor Triad frequencies
}

export const CIRCLE_NODES: QuintasNode[] = [
  { note: 'DO', relative: 'LA min', sharpsOrFlats: '0 ♯/♭', angle: 0, chordFrequencies: [261.63, 329.63, 392.00], relativeFrequencies: [220.00, 261.63, 329.63] }, // C, Am
  { note: 'SOL', relative: 'MI min', sharpsOrFlats: '1 ♯', angle: 30, chordFrequencies: [392.00, 493.88, 587.33], relativeFrequencies: [329.63, 392.00, 493.88] }, // G, Em
  { note: 'RE', relative: 'SI min', sharpsOrFlats: '2 ♯', angle: 60, chordFrequencies: [293.66, 369.99, 440.00], relativeFrequencies: [246.94, 293.66, 369.99] }, // D, Bm
  { note: 'LA', relative: 'FA# min', sharpsOrFlats: '3 ♯', angle: 90, chordFrequencies: [440.00, 554.37, 659.25], relativeFrequencies: [369.99, 440.00, 554.37] }, // A, F#m
  { note: 'MI', relative: 'DO# min', sharpsOrFlats: '4 ♯', angle: 120, chordFrequencies: [329.63, 415.30, 493.88], relativeFrequencies: [277.18, 329.63, 415.30] }, // E, C#m
  { note: 'SI', relative: 'SOL# min', sharpsOrFlats: '5 ♯', angle: 150, chordFrequencies: [493.88, 622.25, 739.99], relativeFrequencies: [415.30, 493.88, 622.25] }, // B, G#m
  { note: 'FA#', relative: 'RE# min', sharpsOrFlats: '6 ♯', angle: 180, chordFrequencies: [369.99, 466.16, 554.37], relativeFrequencies: [311.13, 369.99, 466.16] }, // F#, D#m
  { note: 'RE♭', relative: 'SI♭ min', sharpsOrFlats: '5 ♭', angle: 210, chordFrequencies: [277.18, 349.23, 415.30], relativeFrequencies: [233.08, 277.18, 349.23] }, // Db, Bbm
  { note: 'LA♭', relative: 'FA min', sharpsOrFlats: '4 ♭', angle: 240, chordFrequencies: [415.30, 523.25, 622.25], relativeFrequencies: [349.23, 415.30, 523.25] }, // Ab, Fm
  { note: 'MI♭', relative: 'DO min', sharpsOrFlats: '3 ♭', angle: 270, chordFrequencies: [311.13, 392.00, 466.16], relativeFrequencies: [261.63, 311.13, 392.00] }, // Eb, Cm
  { note: 'SI♭', relative: 'SOL min', sharpsOrFlats: '2 ♭', angle: 300, chordFrequencies: [466.16, 587.33, 698.46], relativeFrequencies: [392.00, 466.16, 587.33] }, // Bb, Gm
  { note: 'FA', relative: 'RE min', sharpsOrFlats: '1 ♭', angle: 330, chordFrequencies: [349.23, 440.00, 523.25], relativeFrequencies: [293.66, 349.23, 440.00] } // F, Dm
];
