# Mango Publicidad

Sitio web de **Mango Publicidad**, diseño e impresión de lonas, carpas, banderolas, playeras full print, gorras con bordado 3D y uniformes deportivos (Mango Sports) en Mérida, Yucatán.

Sitio en línea: https://desruptivomx-sketch.github.io/mango-publicidad/

## Qué incluye

- **Configurador de lonas en el hero.** El visitante escribe el nombre de su negocio, elige medida (o una medida propia) y colores, ve su lona en vivo con ojillos y cotas, y la manda a cotizar por WhatsApp con todos los datos ya escritos.
- Secciones de servicios, activaciones de marca, Mango Sports, proceso de trabajo y contacto.
- Formulario de cotización que arma el mensaje de WhatsApp (productos, detalles, fecha y nombre).
- Botón flotante de WhatsApp, imagen para compartir en redes (Open Graph) y datos estructurados de negocio local para Google.
- Sin dependencias externas: la fuente Archivo está alojada en el propio sitio.

### Efectos

- Mangos reales que caen sobre la lona al cargar, flotan y se mueven con el cursor y el scroll a distintas profundidades.
- La lona se tensa al cargar, se mece con el viento y aletea al cambiar medida o colores.
- Cintas cruzadas con los servicios que avanzan solas y aceleran al hacer scroll.
- Títulos que se estiran al aparecer, servicios con entrada escalonada e íconos animados.
- Banderolas que ondean, línea del proceso que se dibuja sola y jersey que gira en 3D.
- Estallido de mangos al tocar los botones de WhatsApp; lluvia de mangos al tocar el logo.
- Botones con efecto imán, gotas de jugo en el pie, barra de progreso y encabezado que se esconde al bajar.
- Todo se desactiva si la persona tiene activada la opción de reducir movimiento en su sistema, y las animaciones se pausan en las secciones que no están en pantalla.

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
assets/mangos/             Fotos de mangos recortadas (WebP, grande y miniatura)
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

Fotos de mangos de Wikimedia Commons, recortadas (se quitó el fondo). Los recortes en `assets/mangos/` se comparten bajo [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.es):

- Ivar Leidus: [Mangos, single and halved](https://commons.wikimedia.org/wiki/File:Mangos_-_single_and_halved.jpg), [Mango, single](https://commons.wikimedia.org/wiki/File:Mango_-_single.jpg) y [Mango fruit Nam Dok Mai](https://commons.wikimedia.org/wiki/File:Mango_fruit_Nam_Dok_Mai.jpg), CC BY-SA 4.0.
- HaJunkiyada: [Liat Portal for Foodie Disorder, Mango](https://commons.wikimedia.org/wiki/File:Liat_Portal_for_Foodie_Disorder_-_Mango.jpg), CC BY-SA 4.0.
- Leo219: [A mango fruit with speckled red skin](https://commons.wikimedia.org/wiki/File:A_mango_fruit_with_speckled_red_skin.png), CC BY-SA 4.0.
- Ninjatacoshell: [Mango on a white background](https://commons.wikimedia.org/wiki/File:Mango_on_a_white_background.png), CC BY-SA 3.0.
- Renee Comet: [Mango (1)](https://commons.wikimedia.org/wiki/File:Mango_(1).jpg), dominio público.

Los créditos también aparecen en el pie de la página. Si se agregan fotos nuevas, deben tener una licencia que permita uso comercial.
