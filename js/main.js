// ESTRUCTURA DEL PROYECTO:
document.addEventListener('DOMContentLoaded', () => {
    //VARIABLES
    const inputBuscador = document.querySelector('#buscador');
    const buscadorFotos = document.querySelector('#buscadorFotos');
    const pError = document.querySelector('#pError');
    const orientacion = document.querySelector('#orientacion');
    const urlBase = `https://api.pexels.com/v1/`;
    const autorizacion = `851Ebzs3BlLqHHT4VZBNwGS0F7vmu9UH97VyAfhj9mjWBNZ4FRA4zrjt`; // key de Sonia
    const errorDOM = document.querySelector('#errorDOM');
    const containerGaleria = document.querySelector('#containerGaleria');
    const fragment = document.createDocumentFragment();
    const mainContainer = document.querySelector('#mainContainer');
    let busqueda = '';
    let paginaActual = document.querySelector('#paginaActual');
    let numeroPagina = paginaActual.value;
    // const imgCategoria = document.querySelectorAll('.imgCategoria');

    // div paginacion
    //botones paginacion
    // boton añadir favoritos 
    //boton eliminar favoritos
    // #favoritos para añidir las imagenes favoritas

    //EVENTOS
    /**
     * El evento que se activa al pulsar el botón 'buscar' y muestra las imágenes relacionadas con la búsqueda.
     * @event submit
     */
    buscadorFotos.addEventListener("submit", (ev) => {
        ev.preventDefault();
        busqueda = inputBuscador.value.trim().toLowerCase();
        if (validarInput(busqueda)) {
            pintarImagenes(busqueda);
        }
    });

    /**
     * El evento que se activa al seleccionar la orientación: horizontal, vertical o todo.
     * @event change
     */
    orientacion.addEventListener("change", (ev) => {
        console.log(ev.target.value);
        const valorOrientacion = ev.target.value;
        pintarImagenes(busqueda, valorOrientacion);
        // return valorOrientacion;
    });

    /**
     * El evento que se activa con un click del ratón según el elemento pulsado.
     * @event click
     */
    mainContainer.addEventListener("click", (ev) => {
        //Al pulsar cada una de las 3 categorías se cargan las fotos de la categoría seleccionada.
        if (ev.target.matches('.imgCategoria')) {
            const categoria = ev.target.id;
            pintarImagenes(categoria, 'horizontal');
        };
        //Añadir a favoritos  añadirFavoritos()
        // console.log(ev.target.matches('.favBtn'));
        if (ev.target.matches('.favBtn')) {
            const idFavoritos = ev.target.id;
            añadirFavoritos(idFavoritos);
            //!!!! al pintarImagen(hay que también recoger el id de caga imagen 
            // para usarlo en favoritos e eliminarFavoritos)
        }

        //Eliminar de favoritos
        // console.log(ev.target.matches('.elimBtn'));
        if (ev.target.matches('.elimBtn')) {
            const idEliminar = ev.target.id;
            eliminarFavoritos(idEliminar);
        }

        //Cambiar de página (pendiente: terminar y convertir en una o dos funciones)

        // console.log(ev.target.matches('#paginaAnterior'));
        if (ev.target.matches('#paginaAnterior')) {
            console.log(numeroPagina)
            if (numeroPagina > 1) {
                numeroPagina--;
                paginaActual.textContent = numeroPagina;
                //volver a pintar las imágenes pero ya con una página nueva como parámetro
            }
        }
        // console.log(ev.target.matches('#paginaSiguiente'));
        if (ev.target.matches('#paginaSiguiente')) {
            console.log(numeroPagina)
            if (numeroPagina < 300) {
                numeroPagina++;
                paginaActual.textContent = numeroPagina;
                //volver a pintar las imágenes pero ya con una página nueva como parámetro
            }
        }
    });



    //FUNCIONES
    /**
     * Validar el texto introducido en el buscador que solo puede contener palabras y espacios.
     * @function validarInput
     * @param {string} busqueda - la palabra que introduce el usuario para el tema de las fotos que se renderizarán.
     * @returns {boolean} true - confirmación que la palabra ha pasado la validación.
     */
    const validarInput = (busqueda) => {
        const regexp = /^[a-záéíóúÁÉÍÓÚüÜñÑ\s]+$/gi;

        if (!regexp.test(busqueda)) {
            inputBuscador.classList.add('errorForm');
            pError.textContent = `El texto no es válido. Solo se permiten letras y espacios.`
        } else {
            inputBuscador.classList.remove('errorForm');
            pError.innerHTML = '';
            return true;
        }
    }

    const escribirError = (error) => {
        errorDOM.textContent = error;
        errorDOM.classList.add('errorDOM');
    }

    const crearUrl = (busqueda, valorOrientacion, numeroPagina) => {
        let urlCompleta;
        if (valorOrientacion === 'horizontal') {
            urlCompleta = `${urlBase}search?query=${busqueda}&size=medium&orientation=landscape&page=${numeroPagina}&per_page=12&locale=es-ES`;
        } else if (valorOrientacion === 'vertical') {
            urlCompleta = `${urlBase}search?query=${busqueda}&size=medium&orientation=portrait&page${numeroPagina}&per_page=12&locale=es-ES`;
        } else {
            urlCompleta = `${urlBase}search?query=${busqueda}&size=medium&page=${numeroPagina}&per_page=12&locale=es-ES`;
        }
        return urlCompleta;
    }

    /**
     * Función para llamar a la API de Pexels y obtener las imágenes con el tema solicitado.
     * @function llamarApi
     * @param {string} urlCompleta - el enlace completa de la llamada.
     * @returns {Object} data - objeto con las imágenes y otra información.
     */
    const llamarApi = async (urlCompleta) => {
        try {
            const respuesta = await fetch(`${urlCompleta}`, {
                method: 'GET',
                headers: {
                    Authorization: autorizacion
                }
            });
            if (!respuesta.ok) throw `Error ${respuesta.status}!🕵️‍♀️No se ha encontrado la imagen solicitada.`;
            const data = await respuesta.json();
            console.log(data);
            return data;
        } catch (error) {
            escribirError(error);
        }
    }

    //Funcion Pintar imagenes:
    const pintarImagenes = async (busqueda, valorOrientacion, numeroPagina) => {
        try {
            containerGaleria.innerHTML = ''; // para limpiar imagenes previas - toda la galeria o el container de dentro???
            const urlCompleta = crearUrl(busqueda, valorOrientacion, numeroPagina);
            const datos = await llamarApi(urlCompleta);

            const fotosTotales = datos.photos;
            //console.log(fotosTotales);

            if (!fotosTotales || fotosTotales.length === 0) {  // si no existe, es null o indefined----o el array está vacío
                throw `No hay imágenes del tema ${busqueda}`;
            }
            fotosTotales.forEach((foto => {
                const articleGaleria = document.createElement('ARTICLE');
                const divGaleria = document.createElement('DIV');
                const imagen = document.createElement('IMG');
                const pAutor = document.createElement('P');
                const pDescripcion = document.createElement('P');
                const botonFavoritos = document.createElement('BUTTON');
                imagen.src = foto.src.medium; //revisar lo de medium
                imagen.alt = foto.alt;
                divGaleria.classList.add('sizeImagen');
                pAutor.textContent = `Autor: ${foto.photographer} `;
                pDescripcion.textContent = foto.alt;
                botonFavoritos.textContent = "♡ Favoritos";
                botonFavoritos.classList.add('btn');
                botonFavoritos.classList.add('favBtn');
                articleGaleria.classList.add('articleImg');

                divGaleria.append(imagen);
                articleGaleria.append(divGaleria, pAutor, pDescripcion, botonFavoritos);
                fragment.append(articleGaleria);
            }));
            containerGaleria.append(fragment); // o toda la galeria???
        } catch (error) {
            escribirError();
            console.error(error)
        }
    }


    /*
   Corazón relleno 
   &#9829;   ♥
   Corazón vacío
   &#9825;   ♡
   */

    // 5- Funcion añadirFavoritos
    // cuando pulsamos añadir a favoritos -> se guarda en localStorage (con nombre o id de imagen)
    // en localstorage tenemos un array de objetos
    // una funcion getLocalStorage
    // una funcion setLocalStorage

    const añadirFavoritos = (id) => {
        console.log(id)
        // let favoritos = JSON.parse(localStorage.getItem("favoritos")) || []; 
        // 1º Ver si hay algo en favoritos: localStorage.getItem devuelve string JSON o null si no hay nada 
        // con .parse se convierte en array de objs
        // si es null creamos un array vacio
        // if () {}
        // localStorage.setItem("favoritos", JSON.stringify(favoritos));
        //actualiza el array  y lo guarda en localStorage
    };


    // 6- Funcion pintarFavoritos() dudas: reutilzar pintarImagenes() ??


    //7- Funcion eliminarFavoritos()
    const eliminarFavoritos = (id) => {
        console.log(id)
        //Mirar local storage, buscar la imagen y eliminarla
        //Volver a pintar
    };

    // 8- Funcion cambiarPagina()

});