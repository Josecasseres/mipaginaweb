// ============ CONFIGURACIÓN DEL SITIO (cámbialo aquí) ============
// Número de WhatsApp (formato internacional, sin + ni espacios)
var WA_NUMBER = "573226651897";
// Cómo se muestra el número en el footer
var WA_DISPLAY = "+57 322 665 1897";

// Mensajes predefinidos. "planes" se calcula según el paquete elegido.
var WA_MESSAGES = {
  general: "Hola Jose, quiero información sobre tus páginas web.",
  cotizar: "Hola Jose, quiero cotizar una página web para mi negocio.",
  planes: function (plan) {
    return "Hola Jose, quiero el paquete " + planValido(plan) + " para mi página web.";
  }
};

// Lista permitida: solo estos paquetes existen. Cualquier otro valor se ignora
var PLANES = ["Básico", "Profesional", "Completo"];
var PLAN_POR_DEFECTO = "Profesional";

// Devuelve un paquete válido; si el valor no está en la lista, usa el predeterminado
function planValido(plan) {
  return PLANES.indexOf(plan) !== -1 ? plan : PLAN_POR_DEFECTO;
}

// Arma un enlace de WhatsApp con el texto indicado (codificado)
function waLink(texto) {
  return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(texto);
}

function buildLink(plan) {
  return waLink(WA_MESSAGES.planes(plan));
}

var select = document.getElementById("planSelect");
var buyBtn = document.getElementById("buyBtn");

function updateBuy() { buyBtn.href = buildLink(select.value); }
select.addEventListener("change", updateBuy);
updateBuy(); // enlace correcto desde que carga la página

// Los enlaces marcados con data-wa se construyen desde la configuración de arriba.
// El href escrito en el HTML queda como respaldo si JavaScript no está disponible.
document.querySelectorAll("[data-wa]").forEach(function (el) {
  var mensaje = WA_MESSAGES[el.getAttribute("data-wa")];
  if (mensaje) el.href = waLink(mensaje);
});
// El teléfono visible del footer también sale de la configuración
var waText = document.getElementById("waText");
if (waText) waText.textContent = WA_DISPLAY;

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

function setMenu(abierto) {
  menu.classList.toggle("open", abierto);
  menuBtn.setAttribute("aria-expanded", abierto);
  menuBtn.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
}

menuBtn.addEventListener("click", function () {
  setMenu(!menu.classList.contains("open"));
});
// Cierra el menú al elegir una opción
menu.querySelectorAll("a").forEach(function (a) {
  a.addEventListener("click", function () { setMenu(false); });
});
// Escape cierra el menú y devuelve el foco al botón que lo abrió
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && menu.classList.contains("open")) {
    setMenu(false);
    menuBtn.focus();
  }
});
// Un clic fuera del menú también lo cierra
document.addEventListener("click", function (e) {
  if (menu.classList.contains("open") && !menu.contains(e.target) && !menuBtn.contains(e.target)) {
    setMenu(false);
  }
});

// Año actual en el footer
document.getElementById("year").textContent = new Date().getFullYear();

// ============ DESDE AQUÍ: NAVBAR FIJO Y SCROLL REVEAL ============

// --- Navbar: resalta el enlace de la sección que se está viendo ---
var enlacesNav = document.querySelectorAll(".nav-links a[href^='#'], .mobile-menu a[href^='#']");
function marcarActivo(id) {
  enlacesNav.forEach(function (a) {
    var activo = id !== null && a.getAttribute("href") === "#" + id;
    a.classList.toggle("active", activo);
    if (activo) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
}

// --- Navbar: sombra y tamaño reducido al bajar ---
// Un solo listener de scroll para el navbar y el resaltado: menos trabajo por cuadro.
var header = document.querySelector("header");
var esperandoFrame = false; // evita trabajar más de una vez por cuadro
function alScrollear() {
  if (esperandoFrame) return;
  esperandoFrame = true;
  requestAnimationFrame(function () {
    var y = window.scrollY;
    header.classList.toggle("scrolled", y > 8);
    // Arriba del todo (galería/inicio) no hay enlace resaltado
    if (y < 200) marcarActivo(null);
    esperandoFrame = false;
  });
}
window.addEventListener("scroll", alScrollear, { passive: true });
alScrollear(); // estado correcto si la página carga ya con scroll

var seccionesNav = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
  // La franja de detección está en la parte alta de la pantalla
  var vigilaSecciones = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) marcarActivo(e.target.id);
    });
  }, { rootMargin: "-30% 0px -50% 0px" });
  seccionesNav.forEach(function (s) { vigilaSecciones.observe(s); });
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
  // Escalonado: hermanos en la misma fila entran con 90 ms de diferencia (máx. 5 pasos).
  // Se cuenta por padre una sola vez en lugar de buscar hermanos dentro del bucle.
  var indicePorPadre = new WeakMap();
  objetivos.forEach(function (el) {
    var padre = el.parentNode;
    var indice = indicePorPadre.has(padre) ? indicePorPadre.get(padre) : 0;
    indicePorPadre.set(padre, indice + 1);
    el.style.setProperty("--d", Math.min(indice, 5) * 90 + "ms");
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

// app.js terminó sin errores: se cancela la red de seguridad de boot.js.
// Si algo fallaba antes, el timeout seguía activo y la página no se quedaba oculta.
clearTimeout(window.__revealFallback);
