// Se ejecuta en el <head>, antes de pintar la página.
// Marca que hay JavaScript: solo entonces el CSS oculta los bloques para animarlos.
document.documentElement.classList.add("js");

// Red de seguridad: si app.js no carga o falla, a los 4 segundos se muestra todo.
// app.js cancela este temporizador apenas arranca bien.
window.__revealFallback = setTimeout(function () {
  document.documentElement.classList.add("reveal-off");
}, 4000);
