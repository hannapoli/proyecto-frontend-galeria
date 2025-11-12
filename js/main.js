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
    const containerFavoritos = document.querySelector('#favoritos');
    const tresCategorias = document.querySelector('#tresCategorias');
    const paginacionButtons = document.querySelector('#paginacionButtons');
    let busqueda;
    let valorOrientacion = null;
    let paginaActual = 1;
    let totalResultados;
    let resultadosPorPagina = 12;
    let primeraPagBloque;
    let ultimaPagBloque;

    //EVENTOS
    /**
     * El evento que se activa al pulsar el botón 'buscar' y muestra las imágenes relacionadas con la búsqueda.
     * @event submit
     */
    buscadorFotos?.addEventListener("submit", (ev) => {
        ev.preventDefault();
        busqueda = inputBuscador.value.trim().toLowerCase();
        if (validarInput(busqueda)) {
            paginaActual = 1;
            pintarImagenes();
            inputBuscador.value = '';
        }
    });

    /**
     * El evento que se activa al seleccionar la orientación: horizontal, vertical o todo.
     * @event change
     */
    orientacion?.addEventListener("change", (ev) => {
        valorOrientacion = ev.target.value;
        pintarImagenes();
    });

    /**
     * El evento que se activa con un click del ratón según el elemento pulsado.
     * @event click
     */
    document.addEventListener("click", (ev) => {
        //Al pulsar cada una de las 3 categorías se cargan las fotos de la categoría seleccionada.
        if (ev.target.matches('.imgCategoria')) {
            busqueda = ev.target.id;
            pintarImagenes();
        };
        //Añadir a favoritos  agregarFavoritos()
        if (ev.target.matches('.favBtn')) {
            const idFavoritos = ev.target.id;
            if (ev.target.textContent == '♡ Favoritos') {
                ev.target.textContent = '♥ Favoritos';
                agregarFavoritos(idFavoritos);
            } else {
                ev.target.textContent = '♡ Favoritos';
                eliminarFavoritos(idFavoritos);
            }
        }

        //Eliminar de favoritos
        if (ev.target.matches('.elimBtn')) {
            const idEliminar = ev.target.id;
            eliminarFavoritos(idEliminar);
        }

        //Elegir la página y cargar las fotos de esta página
        if (ev.target.matches('.btnPaginacion')) {
            paginaActual = ev.target.id;
            pintarImagenes()
        }

        //ir a la página anterior
        if (ev.target.matches('#paginaAnterior')) {
            if (paginaActual > 9) {
                paginaActual = primeraPagBloque - 1;
                pintarImagenes();
                pintarBotones();
            }
        }

        //ir a la página siguiente
        if (ev.target.matches('#paginaSiguiente')) {
            paginaActual = ultimaPagBloque + 1;
            pintarImagenes();
            pintarBotones();
        }
    });

    //FUNCIONES
    /**
     * Validar el texto introducido en el buscador que solo puede contener palabras y espacios.
     * @function validarInput
     * @param {string} busqueda - la palabra que introduce el usuario para el tema de las fotos que se renderizarán.
     * @returns {boolean} true si la palabra ha pasado la validación o false si no es así.
     */
    const validarInput = (busqueda) => {
        const regexp = /^[a-záéíóúÁÉÍÓÚüÜñÑ\s]+$/gi;

        if (!regexp.test(busqueda)) {
            inputBuscador.classList.add('errorForm');
            pError.textContent = `El texto no es válido. Solo se permiten letras y espacios.`;
            return false;
        } else {
            inputBuscador.classList.remove('errorForm');
            pError.innerHTML = '';
            return true;
        }
    }

    const escribirError = (error) => {
        errorDOM.textContent = '';
        errorDOM.textContent = error;
        errorDOM.classList.add('errorDOM');
    }

    const crearUrl = (id = null) => {
        let urlCompleta;
        if (!valorOrientacion) {
            urlCompleta = `${urlBase}search?query=${busqueda}&size=medium&page=${paginaActual}&per_page=${resultadosPorPagina}&locale=es-ES`;
        } else {
            urlCompleta = `${urlBase}search?query=${busqueda}&size=medium&orientation=${valorOrientacion}&page=${paginaActual}&per_page=${resultadosPorPagina}&locale=es-ES`;
        }
        if (id) {
            urlCompleta = `${urlBase}photos/${id}`;
        }
        return urlCompleta;
    }

    /**
     * Función para llamar a la API de Pexels y obtener las imágenes con el tema solicitado.
     * @function llamarApi
     * @param {string} urlCompleta - el enlace completa de la llamada.//corregir
     * @returns {Object} data - objeto con las imágenes y otra información.
     */
    const llamarApi = async (id = null) => {
        try {
            const urlCompleta = crearUrl(id);
            const respuesta = await fetch(urlCompleta, {
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

    const pintarTodasCategorias = () => {
        const arrayCategorias = [{
            id: 39627,
            categoria: 'Animales'
        },
        {
            id: 16743523,
            categoria: 'Comida'
        },
        {
            id: 1430677,
            categoria: 'Playa'
        }]
        tresCategorias.innerHTML = '';
        arrayCategorias.forEach((categoria) => pintarCategorias(categoria));
    }

    //Función pintarCaregorias()
    const pintarCategorias = async ({ id, categoria }) => {
        try {
            const objetoFoto = await llamarApi(id);
            if (!objetoFoto) {
                throw `No hay imágenes del tema ${categoria}`;
            }
            const articleCategoria = document.createElement('ARTICLE');
            const tituloCategoria = document.createElement('H3');
            const divCategoria = document.createElement('DIV');
            const imgCategoria = document.createElement('IMG');

            articleCategoria.classList.add('categoria', 'flexContainer');
            tituloCategoria.textContent = categoria;
            divCategoria.classList.add('imagenCategoria');
            imgCategoria.src = objetoFoto.src.medium;
            imgCategoria.alt = objetoFoto.alt;
            imgCategoria.classList.add('imgCategoria');
            imgCategoria.id = categoria;

            divCategoria.append(imgCategoria);
            articleCategoria.append(tituloCategoria, divCategoria);
            tresCategorias.append(articleCategoria);
        } catch (error) {
            escribirError(error);
        }
    }

    const pintarBotones = () => {
        paginacionButtons.innerHTML = '';
        const numPaginas = Math.ceil(totalResultados / resultadosPorPagina);
        //Tenemos unos bloques de 10 botones.
        //Calculamos en qué bloque está el botón pulsado:
        const bloqueInicio = Math.floor((paginaActual - 1) / 10);
        //Calculamos el primer botón en este bloque:
        primeraPagBloque = bloqueInicio * 10 + 1;
        //Calculamos el último botón en este bloque, 
        // teniendo en cuenta si hay menos de 10 botones en el último bloque:
        ultimaPagBloque = Math.min((primeraPagBloque + 9), numPaginas);

        const botonAnterior = document.createElement('BUTTON');
        botonAnterior.classList.add('btn', 'btnCambiarPagina');
        botonAnterior.id = 'paginaAnterior';
        botonAnterior.textContent = '<';
        const botonPosterior = document.createElement('BUTTON');
        botonPosterior.classList.add('btn', 'btnCambiarPagina');
        botonPosterior.id = 'paginaSiguiente';
        botonPosterior.textContent = '>';

        const contenedorBotones = document.createElement('DIV');
        for (let i = primeraPagBloque; i <= ultimaPagBloque; i++) {
            const botonPagina = document.createElement('BUTTON');
            botonPagina.id = i;
            botonPagina.textContent = i;
            botonPagina.classList.add('btn', 'btnPaginacion');
            fragment.append(botonPagina);
        }
        contenedorBotones.append(fragment);
        paginacionButtons.append(botonAnterior, contenedorBotones, botonPosterior);
    }

    //Funcion Pintar imagenes:
    const pintarImagenes = async () => {
        try {
            errorDOM.innerHTML = '';
            containerGaleria.innerHTML = '';
            const datos = await llamarApi();
            if (!datos || datos.photos.length === 0) {
                throw `No hay imágenes del tema ${busqueda}`;
            }
            const fotosTotales = datos.photos;
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
                botonFavoritos.classList.add('btn', 'favBtn');
                articleGaleria.classList.add('articleImg');

                divGaleria.append(imagen);
                articleGaleria.append(divGaleria, pAutor, pDescripcion, botonFavoritos);
                fragment.append(articleGaleria);
            }));
            containerGaleria.append(fragment);
            totalResultados = datos.total_results;
            pintarBotones();
        } catch (error) {
            escribirError(error);
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

    // 5- Funcion agregarFavoritos
    const agregarFavoritos = async (id) => {
        try {
            const data = await llamarApi(id)
            const favoritos = getLocalStorage()
            const existeFavorito = favoritos.find(foto => foto.id == id);
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
        } catch (error) {
            escribirError(error)
        }

    };

    // 6- Funcion pintarFavoritos()
    const pintarFavoritos = () => {
        containerFavoritos.innerHTML = '';
        const favoritosActualizados = getLocalStorage();
        favoritosActualizados.forEach((objetoFotos) => {
            const articleFav = document.createElement('ARTICLE');
            const divFav = document.createElement('DIV');
            const imgFav = document.createElement('IMG');
            const pDescripcionFav = document.createElement('P');
            const pautorFav = document.createElement('P');
            const botonEliminar = document.createElement('BUTTON');
            const botonAmpliar = document.createElement('BUTTON');

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
            botonAmpliar.classList.add('btn');
            botonAmpliar.textContent = "Ampliar";
            articleFav.classList.add('articleImg');

            divFav.append(imgFav);
            articleFav.append(divFav, pDescripcionFav, pautorFav, botonEliminar);
            fragment.append(articleFav);
        })
        containerFavoritos.append(fragment);
    }

    // 7- Funcion eliminarFavoritos()
    const eliminarFavoritos = (id) => {
        let favoritos = getLocalStorage();
        favoritos = favoritos.filter((foto) => foto.id != id);
        setLocalStorage(favoritos);
        containerFavoritos.innerHTML = '';
        pintarFavoritos();
    };

    const init = () => {
        if (location.pathname.includes("favoritos")) {
            pintarFavoritos();
        } else if (location.pathname.includes("index")) {
            pintarTodasCategorias();
        }
    }
    init();
});