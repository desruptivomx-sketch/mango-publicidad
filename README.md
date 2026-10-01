# Mango Publicidad

Sitio web de **Mango Publicidad**, diseño e impresión de lonas, carpas, banderolas, playeras full print, gorras con bordado 3D y uniformes deportivos (Mango Sports) en Mérida, Yucatán.

Sitio en línea: https://desruptivomx-sketch.github.io/mango-publicidad/

## Qué incluye

- **Configurador de lonas en el hero.** El visitante escribe el nombre de su negocio, elige medida (o una medida propia) y colores, ve su lona en vivo con ojillos y cotas, y la manda a cotizar por WhatsApp con todos los datos ya escritos.
- Secciones de servicios, activaciones de marca, Mango Sports, proceso de trabajo y contacto.
- Formulario de cotización que arma el mensaje de WhatsApp (productos, detalles, fecha y nombre).
- Botón flotante de WhatsApp, imagen para compartir en redes (Open Graph) y datos estructurados de negocio local para Google.
- Sin dependencias externas: la fuente Archivo está alojada en el propio sitio.

## Estructura

```
index.html                 Contenido de la página
assets/styles.css          Estilos
assets/app.js              Configurador de lona, formulario y botón flotante
assets/logo-mango.png      Logo para fondos claros
assets/logo-mango-blanco.png  Logo para fondos oscuros
assets/og-image.png        Imagen al compartir el enlace
assets/favicon.svg         Ícono de pestaña
assets/apple-touch-icon.png   Ícono al guardar en iPhone
assets/fonts/              Archivo (variable, licencia OFL)
```

## Cómo editar datos de contacto

El teléfono aparece en estos lugares; si cambia, actualízalo en todos:

1. `assets/app.js`, constante `PHONE` (formato `52` + 10 dígitos, sin espacios).
2. `index.html`, enlaces `https://wa.me/529903917701` y `tel:+529903917701`.
3. `index.html`, bloque `application/ld+json` (campo `telephone`).

La dirección y las redes sociales están en la sección `#contacto` de `index.html` y en el mismo bloque `ld+json`.

## Dominio propio

Para usar un dominio como `mangopublicidad.mx`: en GitHub ve a **Settings → Pages → Custom domain**, escribe el dominio y crea en tu proveedor un registro `CNAME` que apunte a `desruptivomx-sketch.github.io`. Después actualiza las URLs de `canonical`, `og:url`, `og:image` y `ld+json` en `index.html`.

## Créditos

Tipografía [Archivo](https://github.com/Omnibus-Type/Archivo) de Omnibus-Type, bajo SIL Open Font License (ver `assets/fonts/OFL.txt`).
