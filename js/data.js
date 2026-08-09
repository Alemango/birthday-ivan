/**
 * data.js — BANCO DE CONTENIDO EDITABLE
 * ============================================================================
 * Aquí vive TODO el contenido real: fotos, videos, carruseles y el set fijo
 * de "primera visita". No hace falta tocar app.js ni styles.css para
 * agregar, quitar o reordenar recuerdos.
 *
 * Tipos de entrada válidos:
 *
 * 1) Foto suelta:
 *    {
 *      type: 'photo',
 *      src: 'media/photos/archivo.jpg',
 *      alt: 'Descripción corta para accesibilidad',
 *      fixedCaptions: ['Frase 1', 'Frase 2'],   // opcional, 2-3 frases propias
 *      audio: 'media/audio/archivo.mp3'          // opcional
 *    }
 *    - Si NO pones `fixedCaptions`, se usa una frase al azar del pool
 *      genérico definido en config.js (GENERIC_CAPTIONS) — hoy vacío a
 *      propósito, ver nota más abajo.
 *    - Si pones `audio`, aparece un botón de play sobre la foto (nunca
 *      suena solo, requiere que el usuario lo toque).
 *
 * 2) Video suelto (NUNCA lleva frase encima):
 *    {
 *      type: 'video',
 *      src: 'media/videos/archivo.mp4',
 *      poster: 'media/videos/archivo-poster.jpg'  // opcional, primer frame
 *    }
 *
 * 3) Carrusel (2 o más fotos/videos que SIEMPRE aparecen juntas, nunca se
 *    mezclan sueltas con el resto del pool):
 *    {
 *      type: 'carousel',
 *      items: [
 *        { type: 'photo', src: '...', alt: '...', fixedCaptions: [...] },
 *        { type: 'video', src: '...' },
 *        ...
 *      ]
 *    }
 *
 * Todas las rutas son relativas a la raíz del sitio (carpeta /media).
 *
 * NOTA sobre las frases: por ahora `GENERIC_CAPTIONS` (en config.js) está
 * vacío a propósito — con contenido real tan variado (familia, Sonido
 * Eterno, la obra de febrero) no tenía sentido reciclar las frases de
 * ejemplo "Solo de Guitarra". Ninguna foto de acá abajo tiene
 * `fixedCaptions`, así que hoy no se muestra ninguna leyenda. Se puede
 * reactivar llenando GENERIC_CAPTIONS o agregando fixedCaptions puntuales
 * cuando haya tiempo para eso.
 * ============================================================================
 */

/* ----------------------------------------------------------------------
 * POOL ALEATORIO GENERAL
 * Se sortea una entrada al azar en cada carga normal y en cada tap del
 * botón "otro recuerdo" (sin repetir la última mostrada).
 * ---------------------------------------------------------------------- */
window.MEMORIES = [
  /* ---- Fotos ---- */
  { type: 'photo', src: 'media/photos/20230208_173714.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/20230208_173715.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/20230208_175414.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/20230208_175422.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/20230208_175429.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/20230208_175642.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/20230208_175703.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/FB_IMG_1568862530129.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/FB_IMG_1578376506352.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/FB_IMG_1578376545481.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/FB_IMG_1578888993906.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/FB_IMG_1604942543840.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/FB_IMG_1625760051143.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20170413-WA0003.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20170413-WA0005.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20180305-WA0003.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20180719-WA0001.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20190304-WA0001.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20190318-WA0002.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20190619-WA0000.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20190619-WA0008.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20190725-WA0002.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20190806-WA0041.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20190914-WA0011.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20191028-WA0000.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20191201-WA0027.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20191201-WA0031.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20191201-WA0036.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20200118-WA0009.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20200423-WA0068.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20200621-WA0002.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20200729-WA0010.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20201030-WA0002.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20201204-WA0013.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20210529-WA0004.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20210620-WA0001.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20210828-WA0001.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20220423-WA0004.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20230122-WA0004.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG-20230810-WA0002.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_0017.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_0256.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_0261.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_0268.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_0275.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_0285.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_0312.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_0322.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_0348.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_0351.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_0494.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_0499.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_20181125_175007.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_20181208_155448_1.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_20190526_201039.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_20190618_204912.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_20200228_190418_BURST001_COVER.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_2362.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_3314.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_3315.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_3316.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_3317.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/IMG_3318.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/Screenshot_2017-09-24-10-23-58.png', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/Screenshot_20190923_231554.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/exalta-3.png', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/img_1238.jpg', alt: 'Recuerdo' },
  { type: 'photo', src: 'media/photos/rtc-snapshot-5949821584597065719.jpg', alt: 'Recuerdo' },

  /* ---- Fotos con audio (Obra Febrero — mismo audio, dos tramos) ---- */
  { type: 'photo', src: 'media/photos/IMG-20190806-WA0035.jpg', alt: 'Recuerdo con audio', audio: 'media/audio/obra-1.m4a' },
  { type: 'photo', src: 'media/photos/IMG-20190806-WA0032.jpg', alt: 'Recuerdo con audio', audio: 'media/audio/obra-2.m4a' },

  /* ---- Videos ---- */
  { type: 'video', src: 'media/videos/20230208_170211.mp4' },
  { type: 'video', src: 'media/videos/20230208_171134.mp4' },
  { type: 'video', src: 'media/videos/20230208_175305.mp4' },
  { type: 'video', src: 'media/videos/20230208_175334.mp4' },
  { type: 'video', src: 'media/videos/20230208_175441.mp4' },
  { type: 'video', src: 'media/videos/20230208_175528.mp4' },
  { type: 'video', src: 'media/videos/20230208_175540.mp4' },
  { type: 'video', src: 'media/videos/20230208_175615.mp4' },
  { type: 'video', src: 'media/videos/20230208_175850.mp4' },
  { type: 'video', src: 'media/videos/20230208_201905.mp4' },
  { type: 'video', src: 'media/videos/at17-memorial.mp4' },
  { type: 'video', src: 'media/videos/comp-1.mp4' },
  { type: 'video', src: 'media/videos/gh010021.mp4' },
  { type: 'video', src: 'media/videos/gh010026.mp4' },
  { type: 'video', src: 'media/videos/gh020044.mp4' },
  { type: 'video', src: 'media/videos/img-0272.mp4' },
  { type: 'video', src: 'media/videos/img-0347.mp4' },
  { type: 'video', src: 'media/videos/img-0482.mp4' },
  { type: 'video', src: 'media/videos/mvi-6962.mp4' },
  { type: 'video', src: 'media/videos/ninos1.mp4' },
  { type: 'video', src: 'media/videos/vid-20190623-wa0006.mp4' },
  { type: 'video', src: 'media/videos/vid-20200119-wa0003.mp4' },
  { type: 'video', src: 'media/videos/vid_20161002_181654.mp4' },
  { type: 'video', src: 'media/videos/vid_20170412_013852.mp4' },
  { type: 'video', src: 'media/videos/vid_20170519_171843.mp4' },
  { type: 'video', src: 'media/videos/vid_20190415_232249.mp4' },
  { type: 'video', src: 'media/videos/vid_20190415_232346.mp4' },
  { type: 'video', src: 'media/videos/vid_20190415_232941.mp4' },
  { type: 'video', src: 'media/videos/vid_20190723_222707.mp4' },
  { type: 'video', src: 'media/videos/vid_20230208_170059.mp4' },
  { type: 'video', src: 'media/videos/vid_20230208_170117.mp4' },
  { type: 'video', src: 'media/videos/videoairport.mp4' },

  /* ---- Carrusel: Sonido Eterno (10 al azar de 92 fotos de la carpeta) ---- */
  {
    type: 'carousel',
    items: [
      { type: 'photo', src: 'media/carousel/sonido-eterno-img_6897.jpg', alt: 'Sonido Eterno' },
      { type: 'photo', src: 'media/carousel/sonido-eterno-img_6900.jpg', alt: 'Sonido Eterno' },
      { type: 'photo', src: 'media/carousel/sonido-eterno-img_6930.jpg', alt: 'Sonido Eterno' },
      { type: 'photo', src: 'media/carousel/sonido-eterno-img_6939.jpg', alt: 'Sonido Eterno' },
      { type: 'photo', src: 'media/carousel/sonido-eterno-img_6945.jpg', alt: 'Sonido Eterno' },
      { type: 'photo', src: 'media/carousel/sonido-eterno-img_6960.jpg', alt: 'Sonido Eterno' },
      { type: 'photo', src: 'media/carousel/sonido-eterno-img_6984.jpg', alt: 'Sonido Eterno' },
      { type: 'photo', src: 'media/carousel/sonido-eterno-img_6993.jpg', alt: 'Sonido Eterno' },
      { type: 'photo', src: 'media/carousel/sonido-eterno-img_6994.jpg', alt: 'Sonido Eterno' },
      { type: 'photo', src: 'media/carousel/sonido-eterno-img_6999.jpg', alt: 'Sonido Eterno' },
    ],
  },
];

/* ----------------------------------------------------------------------
 * SET FIJO DE "PRIMERA VISITA"
 * Aparece debajo del envoltorio (scratch card) SOLO la primera vez que
 * un navegador/dispositivo entra al sitio. No participa del sorteo
 * aleatorio general. Al tener más de una entrada, app.js las muestra
 * juntas como un mini-carrusel fijo automáticamente.
 * ---------------------------------------------------------------------- */
window.FIRST_VISIT = [
  { type: 'video', src: 'media/videos/bienvenida.mp4' },
  { type: 'photo', src: 'media/photos/DNP_1971.jpg', alt: 'Bienvenida' },
  { type: 'photo', src: 'media/photos/IMG_3319.jpg', alt: 'Bienvenida' },
];
