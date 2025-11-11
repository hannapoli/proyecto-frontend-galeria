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
    //let numeroPagina = paginaActual.value;
    const containerFavoritos = document.querySelector('#favoritos');
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
    buscadorFotos?.addEventListener("submit", (ev) => {
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
    orientacion?.addEventListener("change", (ev) => {
        console.log(ev.target.value);
        const valorOrientacion = ev.target.value;
        pintarImagenes(busqueda, valorOrientacion);
        // return valorOrientacion;
    });

    /**
     * El evento que se activa con un click del ratón según el elemento pulsado.
     * @event click
     */
    document.addEventListener("click", (ev) => {
        //Al pulsar cada una de las 3 categorías se cargan las fotos de la categoría seleccionada.
        if (ev.target.matches('.imgCategoria')) {
            busqueda = ev.target.id;
            pintarImagenes(busqueda, 'horizontal');
        };
        //Añadir a favoritos  addFavoritos()
        // console.log(ev.target.matches('.favBtn'));
        if (ev.target.matches('.favBtn')) {
            const idFavoritos = ev.target.id;
            ev.target.textContent = '♥ Favoritos';
            addFavoritos(idFavoritos);
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

    const crearUrl = (busqueda, numeroPagina, id = null, valorOrientacion = null) => {
        let urlCompleta;
        if (!valorOrientacion) {
            urlCompleta = `${urlBase}search?query=${busqueda}&size=medium&page=${numeroPagina}&per_page=12&locale=es-ES`;

        } else {
            if (valorOrientacion === 'horizontal') {
                urlCompleta = `${urlBase}search?query=${busqueda}&size=medium&orientation=landscape&page=${numeroPagina}&per_page=12&locale=es-ES`;
            } else if (valorOrientacion === 'vertical') {
                urlCompleta = `${urlBase}search?query=${busqueda}&size=medium&orientation=portrait&page${numeroPagina}&per_page=12&locale=es-ES`;
            }
        }

        if (id) {
            urlCompleta = `${urlBase}photos/${id}`;
        }

        return urlCompleta;
    }

    /**
     * Función para llamar a la API de Pexels y obtener las imágenes con el tema solicitado.
     * @function llamarApi
     * @param {string} urlCompleta - el enlace completa de la llamada.
     * @returns {Object} data - objeto con las imágenes y otra información.
     */
    const llamarApi = async (busqueda, numeroPagina, id = null, valorOrientacion = null) => {
        // console.log({busqueda})
        try {
            const urlCompleta = crearUrl(busqueda, numeroPagina, id, valorOrientacion);
            const respuesta = await fetch(`${urlCompleta}`, {
                method: 'GET',
                headers: {
                    Authorization: autorizacion
                }
            });
            if (!respuesta.ok) throw `Error ${respuesta.status}!🕵️‍♀️No se ha encontrado la imagen solicitada.`;
            const data = await respuesta.json();
            return data;
        } catch (error) {
            escribirError(error);
        }
    }

    //Funcion Pintar imagenes:
    const pintarImagenes = async (busqueda, numeroPagina, id = null, valorOrientacion = null) => {
        try {
            containerGaleria.innerHTML = '';
            const datos = await llamarApi(busqueda, numeroPagina, id, valorOrientacion);

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
                imagen.src = foto.src.medium;
                imagen.alt = foto.alt;
                imagen.id = foto.id;
                //divGaleria.classList.add('sizeImagen');
                pAutor.textContent = `Autor: ${foto.photographer} `;
                pDescripcion.textContent = foto.alt;
                botonFavoritos.id = foto.id;
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

    // funcion getLocalStorage para VER = OBTENER lo que hay en favoritos:
    // localStorage.getItem devuelve string JSON o null si no hay nada 
    // .parse se convierte en array de objs
    // si es null creamos un array vacio
    const getLocalStorage = () =>
        JSON.parse(localStorage.getItem("favoritos")) || [];

    // funcion setLocalStorage para GUARDAR los favoritos en Local Storage
    const setLocalStorage = (favoritos) =>
        localStorage.setItem("favoritos", JSON.stringify(favoritos));

    // 5- Funcion addFavoritos
    const addFavoritos = async (id) => {
        const data = await llamarApi(null, null, id, null)
        console.log(data)
        const favoritos = getLocalStorage()
        console.log(favoritos)
        const existeFavorito = favoritos.find(foto => foto.id === id);
        if (!existeFavorito) {
            const nuevoFavorito =
            {
                id: data.id,
                srcM: data.src.medium,
                srcG: data.src.large,
                alt: data.alt,
                autor: data.photographer
            };
            setLocalStorage([...favoritos, nuevoFavorito]);
        }
    };

    // 6- Funcion pintarFavoritos()

    const pintarFavoritos = () => {
        const favoritosActualizados = getLocalStorage()
        console.log(favoritosActualizados)
        favoritosActualizados.forEach((objetoFotos) => {
            const articleFav = document.createElement('ARTICLE');
            const divFav = document.createElement('DIV');
            const imgFav = document.createElement('IMG');
            const pDescripcionFav = document.createElement('P');
            const pautorFav = document.createElement('P');
            const botonEliminar = document.createElement('BUTTON');

            imgFav.alt = objetoFotos.alt;
            imgFav.src = objetoFotos.srcM;

            imgFav.id = objetoFotos.id;
            //divGaleria.classList.add('sizeImagen');
            pautorFav.textContent = `Autor: ${objetoFotos.autor} `;
            pDescripcionFav.textContent = objetoFotos.alt;
            botonEliminar.id = objetoFotos.id;
            botonEliminar.textContent = "Eliminar";
            botonEliminar.classList.add('btn');
            botonEliminar.classList.add('elimBtn');
            articleFav.classList.add('articleImg');

            divFav.append(imgFav);
            articleFav.append(divFav, pDescripcionFav, pautorFav, botonEliminar);
            fragment.append(articleFav);
        })
        containerFavoritos.append(fragment);
    }

    const init = () => {

        console.log(location.pathname)
        if (location.pathname.includes("favoritos")) {
            pintarFavoritos();
        } else if (location.pathname.includes("index")) {
            console.log('Pintar categorías')
        }
    }
    init();

    /*
    7- Funcion eliminarFavoritos()

    const eliminarFavoritos = (id) => {
        console.log(id)
        //Mirar local storage, buscar la imagen y eliminarla
        //Volver a pintar
    };
    */

    // 8- Funcion cambiarPagina()

});