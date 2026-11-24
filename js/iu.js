/**
 * Módulo de UI.
 * Se encarga de reflejar el estado en el DOM y conectar los botones.
 */

const UI = (function () {
  // Referencias del DOM
  const timerText = document.getElementById('timerText');
  const sessionLabel = document.getElementById('sessionLabel');
  const progressRing = document.getElementById('progressRing');
  const startPauseBtn = document.getElementById('startPauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const resetAllBtn = document.getElementById('resetAllBtn');
  const completedCount = document.getElementById('completedCount');
  const nextLongBreak = document.getElementById('nextLongBreak');
  const tabs = document.querySelectorAll('.session-tab');

  const settingsModal = document.getElementById('settingsModal');
  const openSettings = document.getElementById('openSettings');
  const closeSettings = document.getElementById('closeSettings');
  const saveBtn = document.getElementById('saveBtn');
  const restoreBtn = document.getElementById('restoreBtn');
  const inputWork = document.getElementById('inputWork');
  const inputShort = document.getElementById('inputShort');
  const inputLong = document.getElementById('inputLong');
  const inputSessions = document.getElementById('inputSessions');

  /**
   * Renderiza el estado del temporizador en el DOM.
   */
  function render({ sessionType, timeLeft, isRunning, completedSessions, settings }) {
    const totalTime = settings[sessionType] * 60;
    const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

    timerText.textContent = formatMMSS(timeLeft);
    sessionLabel.textContent = LABELS[sessionType];
    progressRing.style.setProperty('--progress', `${progress}%`);
    startPauseBtn.textContent = isRunning ? '⏸ Pausar' : '▶ Iniciar';
    completedCount.textContent = completedSessions;

    const mod = completedSessions % settings.sessionsUntilLongBreak;
    const remaining =
      mod === 0 && completedSessions > 0
        ? settings.sessionsUntilLongBreak
        : settings.sessionsUntilLongBreak - mod;
    nextLongBreak.textContent = remaining;

    tabs.forEach((tab) => {
      const active = tab.dataset.type === sessionType;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
  }

  function formatMMSS(seconds) {
    const safe = Math.max(0, Math.floor(seconds));
    const m = Math.floor(safe / 60);
    const s = safe % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  /**
   * Conecta todos los eventos de la interfaz.
   */
  function bindEvents() {
    // Botones principales
    startPauseBtn.addEventListener('click', () => Timer.toggle());
    resetBtn.addEventListener('click', () => Timer.reset());
    resetAllBtn.addEventListener('click', () => {
      if (confirm('¿Reiniciar todo? Se perderá el contador de sesiones.')) {
        Timer.resetAll();
      }
    });

    // Pestañas
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        if (Timer.isRunning()) {
          const ok = confirm('El temporizador está en marcha. ¿Cambiar de sesión?');
          if (!ok) return;
        }
        Timer.changeSession(tab.dataset.type);
      });
    });

    // Modal
    openSettings.addEventListener('click', () => {
      const s = Timer.getSettings();
      inputWork.value = s.work;
      inputShort.value = s.shortBreak;
      inputLong.value = s.longBreak;
      inputSessions.value = s.sessionsUntilLongBreak;
      settingsModal.classList.add('open');
    });

    closeSettings.addEventListener('click', () => {
      settingsModal.classList.remove('open');
    });

    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        settingsModal.classList.remove('open');
      }
    });

    restoreBtn.addEventListener('click', () => {
      inputWork.value = DEFAULT_SETTINGS.work;
      inputShort.value = DEFAULT_SETTINGS.shortBreak;
      inputLong.value = DEFAULT_SETTINGS.longBreak;
      inputSessions.value = DEFAULT_SETTINGS.sessionsUntilLongBreak;
    });

    saveBtn.addEventListener('click', () => {
      const newSettings = {
        work: Math.max(1, Number(inputWork.value) || 1),
        shortBreak: Math.max(1, Number(inputShort.value) || 1),
        longBreak: Math.max(1, Number(inputLong.value) || 1),
        sessionsUntilLongBreak: Math.max(2, Number(inputSessions.value) || 2),
      };
      Timer.updateSettings(newSettings);
      settingsModal.classList.remove('open');
    });
  }

  return {
    init() {
      bindEvents();
    },
    render,
  };
})();