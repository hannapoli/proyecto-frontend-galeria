# Galería de Fotos con Pexels

Aplicación Web que permite buscar, filtrar y guardar imágenes favoritas utilizando la API de Pexels.

 ## Funcionalidades principales

### Página de inicio con categorías
Al cargar la aplicación se muestran tres categorías principales. Al hacer clic en cualquiera de ellas, se muestran imágenes relacionadas obtenidas desde la API de Pexels.

### Buscador de imágenes
* Campo de búsqueda que permite buscar imágenes por palabras clave.
* Se valida el texto ingresado mediante expresiones regulares (solo letras y espacios permitidos).
* Si el texto no pasa la validación, se muestra un mensaje de error visual.

### Filtro por orientación
* Permite elegir la orientación de las imágenes:
    * Todas
    * Verticales
    * Horizontales

### Paginación dinámica
* Los resultados se muestran con paginación de 12 imágenes por página.
* Se implementa paginación por bloques de 10 páginas, con botones “<” y “>” para moverse entre bloques.
* Al cambiar de página, se recargan las imágenes de forma dinámica sin recargar la web.

### Gestión de favoritos
* Cada imagen tiene un botón “♡ Favoritos” para añadirla a la lista de favoritos.
* Las imágenes favoritas se guardan en el LocalStorage del navegador.
* Se mantiene la persistencia de los datos incluso tras cerrar o recargar la aplicación.
* En la sección de favoritos:
    * Se pueden ver todas las imágenes guardadas.
    * Se pueden eliminar imágenes individualmente.
    * Se pueden ampliar las imágenes guardadas.

## Tecnologías utilizadas

- **HTML5:** estructura semántica de la aplicación.
- **CSS3:** estilos visuales y diseño responsive (Mobile First).
- **JavaScript (Vanilla):** peticiones a la API, renderizado dinámico y manejo del DOM.
- **Fetch API:** comunicación con la API de Pexels para recibir los datos.
- **LocalStorage:** para guardar, mostrar y eliminar imágenes favoritas.
- **JSDoc:** documentación del código fuente.


Autores: Hanna Polishchuk, Sonia Nseng Mikue.
API: [Pexels API](https://www.pexels.com/api/).

