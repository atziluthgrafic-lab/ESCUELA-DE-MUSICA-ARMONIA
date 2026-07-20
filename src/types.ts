/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActiveTab = 'inicio' | 'cursos' | 'aula' | 'whatsapp' | 'perfil' | 'admin';

export interface BookingData {
  nombre: string;
  correo: string;
  whatsapp: string;
  instrumento: string;
}

export interface Lesson {
  id: string;
  number: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  videoUrl?: string;
  videos?: { id: string; title: string; url: string; duration?: string }[];
  description: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  progress: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  price: number | string;
  category: string;
  type: 'En Línea' | 'En Vivo' | 'Masterclass';
  imageUrl: string;
  description: string;
  shortDescription: string;
  unlocked: boolean;
  featured?: boolean;
  durationInMonths?: number;
  modulesCount?: number;
}

export interface Comment {
  id: string;
  userName: string;
  avatarUrl: string;
  role: 'student' | 'teacher';
  text: string;
  timestamp: string;
}
