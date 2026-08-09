/**
 * config.js — CONFIGURACIÓN EDITABLE
 * ============================================================================
 * Este archivo es uno de los DOS únicos lugares que necesitas tocar para
 * personalizar el sitio con contenido real (el otro es data.js).
 * No hay que tocar app.js ni styles.css para nada de lo que hay aquí.
 *
 * Ver README.md para instrucciones detalladas.
 * ============================================================================
 */

/* ----------------------------------------------------------------------
 * REDES SOCIALES
 * Edita `url` con el link real de cada red. Puedes borrar o agregar
 * entradas al array; cada una genera un botón circular flotante con
 * el ícono correspondiente. `icon` acepta: 'instagram', 'spotify',
 * 'whatsapp', 'tiktok', 'youtube', 'x' — o deja tu propio SVG en
 * app.js (función ICONS) si quieres otra red.
 * ---------------------------------------------------------------------- */
window.SOCIAL_LINKS = [
  { icon: 'instagram', url: 'https://instagram.com/ivan__rm', label: 'Instagram' },
];

/* ----------------------------------------------------------------------
 * FRASES GENÉRICAS
 * Pool compartido de frases tipo meme que se usa en cualquier foto que
 * NO tenga `fixedCaptions` propias en data.js. Se elige una al azar
 * cada vez que esa foto aparece. Los videos nunca muestran frase.
 *
 * Vacío a propósito: con contenido real ya cargado (familia, Sonido
 * Eterno, Obra Febrero), las frases de ejemplo "Solo de Guitarra" no
 * pegaban con fotos tan variadas. Agregá frases acá cuando quieras
 * reactivar el efecto meme sobre las fotos sin fixedCaptions propias.
 * ---------------------------------------------------------------------- */
window.GENERIC_CAPTIONS = [];

/* ----------------------------------------------------------------------
 * ENVOLTORIO DE PRIMERA VISITA (scratch card)
 * `image`: ruta a la imagen que se "destapa" con el dedo. Reemplaza el
 * placeholder por el motivo real en /media.
 * `bgColor`: color de fondo detrás/alrededor de la imagen mientras se
 * dibuja el canvas (por si la imagen no cubre 100% o tarda en cargar).
 * `revealThreshold`: fracción (0-1) del área borrada a partir de la cual
 * se anima automáticamente el resto para que desaparezca.
 * ---------------------------------------------------------------------- */
window.WRAPPER = {
  image: 'media/placeholders/wrapper.svg',
  bgColor: '#2a1a10',
  revealThreshold: 0.68,
  brushRadius: 34,
};

/* ----------------------------------------------------------------------
 * TEXTOS DE LA PLACA / VARIOS
 * ---------------------------------------------------------------------- */
window.SITE_TEXT = {
  plateLabel: 'RECUERDO N.º',
  plateNumberPad: 3, // "001", "002", ... ajusta el padding si esperas 1000+
};
