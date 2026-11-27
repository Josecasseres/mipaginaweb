// Datos estructurados para Google (schema.org).
// Se inyectan desde un archivo externo para respetar el CSP (script-src 'self').
// Cuando tengas ciudad y dirección reales, añádelos aquí y en el Perfil de Empresa de Google con el mismo texto.
var datosNegocio = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Jose Casseres | Desarrollo Web",
  "description": "Páginas web claras, rápidas y adaptadas al celular para pequeños negocios.",
  "url": "https://josecasseres.github.io/mipaginaweb/",
  "telephone": "+573226651897",
  "areaServed": [
    { "@type": "City", "name": "Cartagena" },
    { "@type": "AdministrativeArea", "name": "Bolívar" },
    { "@type": "Country", "name": "Colombia" }
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Cartagena",
    "addressRegion": "Bolívar",
    "addressCountry": "CO"
  },
  "sameAs": [
    "https://www.tiktok.com/@desarrollo.web58",
    "https://www.instagram.com/desarrollo.web58"
  ]
};

var scriptDatos = document.createElement("script");
scriptDatos.type = "application/ld+json";
scriptDatos.textContent = JSON.stringify(datosNegocio);
document.head.appendChild(scriptDatos);
