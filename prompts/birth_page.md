Construye un sitio web estático (HTML/CSS/JS vanilla, sin frameworks ni build tools)
para servir como el contenido de un tag NFC embebido en una figura personalizada
(bobblehead) de regalo de cumpleaños número 30, temática "Solo de Guitarra —
El Feeling — Edición Amigo". El sitio se abre desde el celular del dueño de la
figura cada vez que acerca su teléfono al tag. El objetivo es que sea una
experiencia tipo "reels": inmersiva, vertical, mobile-first, que muestre un
recuerdo (foto, video o carrusel) al azar cada vez que se abre o se le da a
un botón de reshuffle.

CONTEXTO DE DISEÑO YA DECIDIDO (no lo cuestiones, impleméntalo):
- Estética full-bleed estilo reels: la foto/video ocupa esencialmente toda
  la pantalla (100dvh, object-fit cover).
- El único elemento que conecta con el objeto físico (una figura con una
  placa de trofeo de madera y latón) es una barra inferior tipo placa
  metálica dorada/latón con un contador "RECUERDO N.º 00X" que sube en
  cada vista. Esta barra necesita su propio fondo sólido/degradado para
  mantener contraste sin importar qué imagen tenga detrás.
- Paleta: negro cálido de escenario (~#15120f), dorado latón (~#c9a227 /
  #e8c766), madera oscura (~#4a2e1f), crema (~#ede6d6), papel (~#f5f1e8).
  Tipografía: un display condensado tipo cartel de concierto para
  encabezados/plaquita, monoespaciada para texto utilitario, y una fuente
  bold tipo meme (blanco con contorno negro) SOLO para las frases sobre
  fotos.
- Botón de "otro recuerdo" con forma de púa de guitarra (clip-path),
  degradado latón.

FUNCIONALIDAD REQUERIDA:

1. Banco de contenido editable en un archivo de datos aparte (ej. data.js),
   sin tocar lógica ni estilos para actualizar contenido. Cada entrada es:
   - foto suelta (con fixedCaptions opcionales: 2-3 frases específicas para
     esa foto; si no las tiene, usa un pool genérico de frases compartido)
   - video suelto (sin frase encima nunca)
   - carrusel: una lista fija de 2+ fotos/videos que SIEMPRE aparecen
     juntas como una sola unidad al azar (no se mezclan individualmente
     con el resto). El carrusel debe avisar visualmente que lo es
     (indicador de puntos o contador "1/N") y soportar swipe horizontal.
   - foto con audio opcional: si la entrada tiene un audio asociado,
     mostrar un botón de play visible sobre la foto (NO autoplay con
     sonido — los navegadores móviles lo bloquean sin gesto directo del
     usuario dentro de la página).

2. Selección aleatoria en cada carga / cada tap del botón "otro recuerdo",
   sin repetir el mismo elemento dos veces seguidas (guardar el último
   índice en localStorage).

3. Contador "RECUERDO N.º 00X" persistente en localStorage, incrementa en
   cada elemento mostrado.

4. Botones flotantes circulares (solo ícono, sin texto) con enlaces a las
   redes sociales del dueño de la figura, anclados cerca de la parte
   inferior de la pantalla PERO con margen de seguridad suficiente para
   no interferir con el gesto de "home" de iOS. Las URLs de las redes
   deben ser fácilmente editables (variable o archivo de configuración
   aparte).

5. Experiencia de "primera visita" (detectada vía localStorage — deja
   claro en el código que esto es por navegador/dispositivo, no global):
   la primera vez que un navegador entra al sitio, en lugar de ir directo
   al azar, se debe:
   a) Mostrar una capa de "envoltorio empañado": una imagen de motivo
      (el usuario la proveerá, usa un placeholder por ahora) con un color
      de fondo, que el usuario destapa arrastrando el dedo — usa la
      técnica de "scratch card" con canvas (composite operation
      destination-out) para borrar la capa donde pasa el dedo/touch.
      Cuando se haya destapado ~65-70% del área, anima el resto para que
      se desvanezca automáticamente (evitar frustración de destapar cada
      pixel).
   b) Debajo de esa capa, mostrar un set de contenido fijo específico
      para "primera vez" (definido también en el archivo de datos,
      separado del pool aleatorio general).
   c) Marcar el navegador como "ya visitado" para que las siguientes
      veces vaya directo al modo aleatorio normal.

6. Todo el almacenamiento de media (fotos, videos, audios) vive en
   carpetas dentro del propio proyecto (ej. /media) — NO conectar
   servicios externos (sin AWS, sin Cloudinary, sin backend). Es un
   sitio 100% estático, desplegable en GitHub Pages / Netlify / Vercel.

7. Accesibilidad y buenas prácticas mínimas: contraste de texto legible,
   respetar prefers-reduced-motion (especialmente en la animación del
   envoltorio y transiciones), soporte táctil correcto para swipe en
   carruseles y para el gesto de destapar.

No pidas confirmación por cada decisión menor de implementación — toma
decisiones razonables y documenta en el README cómo el usuario debe
agregar su contenido real (fotos, videos, audios, imagen del envoltorio,
URLs de redes sociales, y las frases fijas/genéricas).