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
