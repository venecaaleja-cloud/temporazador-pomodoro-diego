/**
 * Configuración global y constantes del proyecto.
 */

// Tipos de sesión disponibles
const SESSION_TYPES = {
  WORK: 'work',
  SHORT_BREAK: 'shortBreak',
  LONG_BREAK: 'longBreak',
};

// Etiquetas visibles para el usuario
const LABELS = {
  work: 'Trabajo',
  shortBreak: 'Descanso corto',
  longBreak: 'Descanso largo',
};

// Configuración por defecto
const DEFAULT_SETTINGS = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsUntilLongBreak: 4,
};

// Claves de localStorage
const STORAGE_KEYS = {
  SETTINGS: 'pomodoro-settings',
  COMPLETED: 'pomodoro-completed',
};