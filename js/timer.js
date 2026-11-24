/**
 * Módulo del temporizador.
 * Encapsula el estado, la lógica y los callbacks.
 */

const Timer = (function () {
  let settings = Storage.loadSettings();
  let sessionType = SESSION_TYPES.WORK;
  let timeLeft = settings.work * 60;
  let isRunning = false;
  let completedSessions = Storage.loadCompleted();
  let intervalId = null;

  // Callback opcional que se ejecuta cuando cambia el estado
  let onChangeCallback = () => {};

  /**
   * Notifica cambios a la UI.
   */
  function notify() {
    onChangeCallback({
      sessionType,
      timeLeft,
      isRunning,
      completedSessions,
      settings,
    });
  }

  /**
   * Formatea segundos a MM:SS.
   */
  function format(seconds) {
    const safe = Math.max(0, Math.floor(seconds));
    const m = Math.floor(safe / 60);
    const s = safe % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  /**
   * Cambia el tipo de sesión y reinicia el tiempo.
   */
  function switchSession(type) {
    sessionType = type;
    timeLeft = settings[type] * 60;
    isRunning = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    notify();
  }

  /**
   * Lógica al finalizar una sesión.
   */
  function handleSessionEnd() {
    isRunning = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    AudioAlert.play();

    if (sessionType === SESSION_TYPES.WORK) {
      completedSessions += 1;
      Storage.saveCompleted(completedSessions);

      if (completedSessions % settings.sessionsUntilLongBreak === 0) {
        switchSession(SESSION_TYPES.LONG_BREAK);
      } else {
        switchSession(SESSION_TYPES.SHORT_BREAK);
      }
    } else {
      switchSession(SESSION_TYPES.WORK);
    }
  }

  /**
   * Tick del temporizador (cada segundo).
   */
  function tick() {
    if (timeLeft <= 1) {
      timeLeft = 0;
      notify();
      handleSessionEnd();
      return;
    }
    timeLeft -= 1;
    notify();
  }

  // ========== API PÚBLICA ==========
  return {
    /**
     * Registra un callback para cambios.
     */
    onChange(cb) {
      onChangeCallback = cb;
      notify(); // primer render
    },

    start() {
      if (isRunning) return;
      isRunning = true;
      intervalId = setInterval(tick, 1000);
      notify();
    },

    pause() {
      isRunning = false;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      notify();
    },

    toggle() {
      isRunning ? this.pause() : this.start();
    },

    reset() {
      this.pause();
      timeLeft = settings[sessionType] * 60;
      notify();
    },

    resetAll() {
      this.pause();
      sessionType = SESSION_TYPES.WORK;
      timeLeft = settings.work * 60;
      completedSessions = 0;
      Storage.saveCompleted(0);
      notify();
    },

    changeSession(type) {
      switchSession(type);
    },

    updateSettings(newSettings) {
      settings = newSettings;
      Storage.saveSettings(settings);
      if (!isRunning) {
        timeLeft = settings[sessionType] * 60;
      }
      notify();
    },

    getSettings() {
      return { ...settings };
    },

    getSessionType() {
      return sessionType;
    },

    isRunning() {
      return isRunning;
    },
  };
})();