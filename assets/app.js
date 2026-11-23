// Número de WhatsApp (formato internacional, sin + ni espacios)
var WA_NUMBER = "573226651897";

// Lista permitida: solo estos paquetes existen. Cualquier otro valor se ignora
var PLANES = ["Básico", "Profesional", "Completo"];
var PLAN_POR_DEFECTO = "Profesional";

// Devuelve un paquete válido; si el valor no está en la lista, usa el predeterminado
function planValido(plan) {
  return PLANES.indexOf(plan) !== -1 ? plan : PLAN_POR_DEFECTO;
}

// Arma el enlace de WhatsApp con el paquete elegido (el texto va codificado)
function buildLink(plan) {
  var msg = "Hola Jose, quiero el paquete " + planValido(plan) + " para mi página web.";
  return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
}

var select = document.getElementById("planSelect");
var buyBtn = document.getElementById("buyBtn");

function updateBuy() { buyBtn.href = buildLink(select.value); }
select.addEventListener("change", updateBuy);
updateBuy(); // enlace correcto desde que carga la página

// Al pulsar "Elegir ..." en un paquete, se selecciona ese paquete en la sección de compra
document.querySelectorAll("[data-plan]").forEach(function (el) {
  el.addEventListener("click", function () {
    select.value = planValido(el.getAttribute("data-plan"));
    updateBuy();
  });
});

// Menú desplegable del celular
var menuBtn = document.getElementById("menuBtn");
var menu = document.getElementById("mobileMenu");
menuBtn.addEventListener("click", function () {
  var open = menu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
// Cierra el menú al elegir una opción
menu.querySelectorAll("a").forEach(function (a) {
  a.addEventListener("click", function () {
    menu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// Año actual en el footer
document.getElementById("year").textContent = new Date().getFullYear();

// ============ DESDE AQUÍ: NAVBAR FIJO Y SCROLL REVEAL ============

// app.js arrancó bien: se cancela la red de seguridad de boot.js
clearTimeout(window.__revealFallback);

// --- Navbar: sombra y tamaño reducido al bajar ---
var header = document.querySelector("header");
var esperandoFrame = false; // evita trabajar más de una vez por cuadro
function alScrollear() {
  if (esperandoFrame) return;
  esperandoFrame = true;
  requestAnimationFrame(function () {
    header.classList.toggle("scrolled", window.scrollY > 8);
    esperandoFrame = false;
  });
}
window.addEventListener("scroll", alScrollear, { passive: true });
alScrollear(); // estado correcto si la página carga ya con scroll

// --- Navbar: resalta el enlace de la sección que se está viendo ---
var enlacesNav = document.querySelectorAll(".nav-links a[href^='#'], .mobile-menu a[href^='#']");
function marcarActivo(id) {
  enlacesNav.forEach(function (a) {
    a.classList.toggle("active", id !== null && a.getAttribute("href") === "#" + id);
  });
}
var seccionesNav = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
  // La franja de detección está en la parte alta de la pantalla (35% desde arriba)
  var vigilaSecciones = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) marcarActivo(e.target.id);
    });
  }, { rootMargin: "-35% 0px -60% 0px" });
  seccionesNav.forEach(function (s) { vigilaSecciones.observe(s); });
  // Arriba del todo (galería/inicio) no hay enlace resaltado
  window.addEventListener("scroll", function () {
    if (window.scrollY < 200) marcarActivo(null);
  }, { passive: true });
}

// --- Scroll reveal: cada bloque aparece al entrar en pantalla ---
// Debe coincidir con la lista de selectores del CSS (.js :where(...))
var SELECTOR_REVEAL = ".section-head, .hero-text, .shot, .card, .buy, details, .note, .product > div";
var objetivos = Array.prototype.slice.call(document.querySelectorAll(SELECTOR_REVEAL));
var menosMovimiento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!("IntersectionObserver" in window) || menosMovimiento) {
  // Sin soporte o sin animaciones: todo visible de una vez
  objetivos.forEach(function (el) { el.classList.add("is-visible"); });
} else {
  // Escalonado: hermanos en la misma fila entran con 90 ms de diferencia (máx. 5 pasos)
  objetivos.forEach(function (el) {
    var hermanos = objetivos.filter(function (o) { return o.parentNode === el.parentNode; });
    var posicion = Math.min(hermanos.indexOf(el), 5);
    el.style.setProperty("--d", posicion * 90 + "ms");
  });
  var vigilaReveal = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-visible");
      vigilaReveal.unobserve(e.target); // aparece una sola vez
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  objetivos.forEach(function (el) { vigilaReveal.observe(el); });
}
