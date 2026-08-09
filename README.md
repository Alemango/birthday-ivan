# Solo de Guitarra — El Feeling — Edición Amigo

Sitio web estático (HTML/CSS/JS vanilla, sin frameworks ni build tools) pensado
para servir como contenido de un tag NFC embebido en una figura bobblehead de
regalo de cumpleaños. Al acercar el celular al tag, se abre una experiencia
tipo *reels*: vertical, a pantalla completa, que muestra un recuerdo (foto,
video o carrusel) al azar en cada apertura o al tocar el botón de púa
("otro recuerdo").

No usa build tools, ni backend, ni servicios externos (sin AWS, sin
Cloudinary). Es 100% estático: se puede abrir directo con `index.html` o
desplegar en GitHub Pages / Netlify / Vercel subiendo la carpeta tal cual.

## Cómo agregar tu contenido real

Todo lo que hay que tocar para personalizar el sitio vive en **dos
archivos**. No hace falta editar `app.js` ni `styles.css` para nada de esto.

### 1. Pon tu media en `/media`

```
media/
  photos/   ← tus fotos sueltas
  videos/   ← tus videos sueltos
  audio/    ← audios opcionales para acompañar alguna foto
  carousel/ ← fotos/videos que forman parte de un carrusel
```

(Las carpetas ya existen vacías; los archivos que están hoy en
`media/placeholders/` son solo de ejemplo para que el sitio funcione sin
contenido real — reemplázalos o déjalos de lado.)

### 2. Carga los recuerdos en `js/data.js`

Cada recuerdo es una entrada en `window.MEMORIES` (el pool aleatorio) o en
`window.FIRST_VISIT` (lo que se ve la primera vez, debajo del envoltorio).
Hay tres tipos:

- **Foto suelta**
  ```js
  {
    type: 'photo',
    src: 'media/photos/asado2019.jpg',
    alt: 'Descripción para accesibilidad',
    fixedCaptions: ['Frase específica 1', 'Frase específica 2'], // opcional
    audio: 'media/audio/audio1.mp3', // opcional, agrega botón de play
  }
  ```
  Si no pones `fixedCaptions`, se usa una frase al azar del pool genérico
  (`GENERIC_CAPTIONS` en `config.js`).

- **Video suelto** (nunca lleva frase encima)
  ```js
  { type: 'video', src: 'media/videos/recital.mp4', poster: 'media/videos/recital-poster.jpg' }
  ```

- **Carrusel** (2+ fotos/videos que siempre aparecen juntas, con swipe)
  ```js
  {
    type: 'carousel',
    items: [
      { type: 'photo', src: 'media/carousel/1.jpg', alt: '...' },
      { type: 'photo', src: 'media/carousel/2.jpg', alt: '...' },
      { type: 'video', src: 'media/carousel/3.mp4' },
    ],
  }
  ```

`window.FIRST_VISIT` funciona igual: pon ahí lo que quieres que se vea la
primera vez que alguien abre el sitio en su teléfono (antes de entrar al modo
aleatorio). Si pones más de una entrada, se muestran juntas como un carrusel
automáticamente.

### 2.1 Alternativa: llena la plantilla CSV en vez de editar `data.js` a mano

Si vas a cargar varias fotos/videos, puede ser más cómodo anotarlos en
`plantilla-contenido.csv` (en la raíz del proyecto) que editar `data.js`
directamente. Ábrelo con Excel, Numbers o Google Sheets. Cada fila es un
archivo de media; estas son las columnas:

| Columna           | Qué va                              | Notas |
|-------------------|--------------------------------------|-------|
| `pool`            | `MEMORIES` o `FIRST_VISIT`           | En qué colección vive el recuerdo. |
| `type`            | `photo` o `video`                    | Tipo de ese archivo. |
| `carousel_group`  | Vacío, o un identificador (ej. `g1`) | Filas con el mismo `carousel_group` forman un carrusel juntas, en el orden en que aparecen en el CSV. Vacío = entrada suelta. |
| `file`            | Ruta del archivo (ej. `media/photos/asado.jpg`) | Debe existir dentro de `/media`. |
| `alt`             | Descripción para accesibilidad        | Solo aplica a fotos. |
| `captions`        | Frases fijas separadas por `\|` (ej. `FRASE UNO\|FRASE DOS`) | Solo fotos. Vacío = se usa una frase al azar de `GENERIC_CAPTIONS`. Los videos nunca llevan frase, aunque pongas algo aquí se ignora. |
| `audio`           | Ruta de un audio opcional             | Solo fotos; agrega el botón de play. |
| `poster`          | Ruta de una imagen de portada opcional | Solo videos; primer frame antes de reproducir. |

El archivo ya trae filas de ejemplo (una de cada variante, incluyendo un
carrusel de 3 y una entrada de `FIRST_VISIT`) — bórralas o sobrescríbelas.

Flujo sugerido:

1. Copia tus fotos/videos reales a las carpetas correspondientes en `/media`
   (ver paso 1 arriba).
2. Llena una fila por archivo en `plantilla-contenido.csv`.
3. Avísame (a Claude Code) que ya llenaste la plantilla — la leo, agrupo los
   carruseles por `carousel_group` y genero las entradas correspondientes en
   `js/data.js` automáticamente. Si algún archivo referenciado no existe, o su
   nombre tiene espacios/paréntesis que conviene renombrar (como pasó con el
   video que se renombró a `recuerdo1.mp4`), te aviso antes de continuar.

### 3. Configura redes, frases y el envoltorio en `js/config.js`

- `SOCIAL_LINKS`: array de `{ icon, url, label }`. Iconos disponibles:
  `instagram`, `spotify`, `whatsapp`, `tiktok`, `youtube`, `x`. Cada uno
  genera un botón circular flotante.
- `GENERIC_CAPTIONS`: pool de frases tipo meme para fotos sin `fixedCaptions`.
- `WRAPPER.image`: la imagen del "envoltorio" que se destapa con el dedo la
  primera vez (reemplaza `media/placeholders/wrapper.svg` por tu motivo real,
  por ejemplo un diseño relacionado a la figura/trofeo).
- `WRAPPER.revealThreshold`: qué porcentaje hay que destapar antes de que el
  resto se desvanezca solo (por defecto 0.68 = 68%).
- `SITE_TEXT.plateNumberPad`: cantidad de ceros del contador en la placa
  ("001", "002", ...).

## Comportamiento a tener en cuenta

- El estado de "primera visita", el contador de recuerdos y el último
  recuerdo mostrado se guardan en `localStorage`, **por navegador/dispositivo,
  no global**. Cada teléfono que toque el tag NFC tiene su propia experiencia
  de primera vez y su propio contador. Para resetear la experiencia en un
  teléfono de prueba: `localStorage.clear()` en la consola del navegador, o
  borrar el sitio de "Datos de sitios web" en los ajustes del navegador.
- Los videos jamás muestran frase encima ni hacen autoplay con sonido (los
  navegadores móviles lo bloquean sin gesto directo del usuario); arrancan en
  mute y loop, y un tap sobre el video activa/desactiva el sonido.
- Las fotos con audio muestran un botón de play visible; el audio solo suena
  después de que el usuario lo toca.
- El sitio respeta `prefers-reduced-motion`: si está activado, la animación
  automática del envoltorio se reemplaza por un botón "Revelar recuerdo", y
  las transiciones se acortan.

## Probar en local

No hace falta build ni instalar nada. Alcanza con:

```sh
python3 -m http.server 8000
```

y abrir `http://localhost:8000` desde el celular (misma red Wi-Fi) o en el
modo responsive del navegador (viewport vertical, simular touch).

## Desplegar

Cualquier hosting estático sirve, sin configuración especial:

- **GitHub Pages**: subir el repo y activar Pages sobre la rama principal.
- **Netlify / Vercel**: arrastrar la carpeta o conectar el repo; no hace
  falta comando de build (dejar el build command vacío / "none").

Después, programa el tag NFC de la figura con la URL final del sitio
desplegado.
