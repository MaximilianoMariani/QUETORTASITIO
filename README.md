# Qué Torta - Proyecto final de E-commerce

Sitio web de demostración para una pastelería llamada **Qué Torta**. Permite visualizar el catálogo propio, agregar tortas al carrito, modificar cantidades, eliminar productos y simular una compra. También incluye una sección de productos de otros comercios, cargados desde una API REST.

## Archivos
- `index.html`: estructura semántica, navegación, catálogo, sección de otros comercios, carrito y formulario.
- `styles.css`: estilos, Flexbox, Grid y media queries.
- `script.js`: consumo de API REST con `fetch`, manipulación del DOM, validación y carrito con `localStorage`.

## Tecnologías
HTML5, CSS3, Bootstrap 5, JavaScript, Fetch API, LocalStorage y Formspree.

## API REST
La sección **Productos de nuestros otros comercios** consulta `https://dummyjson.com/products?limit=8` mediante `fetch()`. La respuesta se convierte de JSON y se muestran tarjetas con imagen, nombre, descripción y precio. DummyJSON es una API de demostración y devuelve productos genéricos; no representa un catálogo real de comercios asociados.

El catálogo principal de Qué Torta permanece separado y utiliza los productos locales definidos en `script.js`.

## Carrito
El carrito permite agregar tortas del catálogo propio, modificar cantidades, eliminar productos y calcular el total. Los datos se guardan en `localStorage`. La compra es una simulación y no realiza cobros.

## Formulario
El formulario está conectado a Formspree mediante el endpoint incluido en `index.html`. Verificá que el endpoint corresponda a tu cuenta.

## Imágenes y video
Copiá tus imágenes a `Imagenes del sitio/` y el video a `VIDEO/tortas.mp4`. Conservá los nombres usados en el código o actualizá las rutas. Se incluyen las carpetas para que puedas colocar tus archivos.

## Cómo ejecutar
Abrí la carpeta con Visual Studio Code y ejecutá `index.html` usando Live Server. Se necesita conexión a internet para Google Fonts, Bootstrap, Formspree y la API.

## Publicación
Podés subir la carpeta a Netlify o a GitHub Pages.
