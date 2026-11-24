/**
 * Punto de entrada.
 * Conecta el Timer con la UI.
 */

(function initApp() {
  // La UI se suscribe a los cambios del Timer
  Timer.onChange((state) => UI.render(state));

  // La UI conecta sus eventos
  UI.init();
})();