/**
 * Módulo encargado de la persistencia en localStorage.
 */

const Storage = {
  /**
   * Carga la configuración guardada, fusionándola con los valores por defecto.
   */
  loadSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored
        ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
        : { ...DEFAULT_SETTINGS };
    } catch (e) {
      console.warn('Error cargando settings', e);
      return { ...DEFAULT_SETTINGS };
    }
  },

  /**
   * Guarda la configuración.
   */
  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  /**
   * Carga el contador de sesiones completadas.
   */
  loadCompleted() {
    const stored = localStorage.getItem(STORAGE_KEYS.COMPLETED);
    return stored ? Number(stored) || 0 : 0;
  },

  /**
   * Guarda el contador de sesiones completadas.
   */
  saveCompleted(count) {
    localStorage.setItem(STORAGE_KEYS.COMPLETED, String(count));
  },
};