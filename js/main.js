//@ts-nocheck
/**
 * @fileoverview Proyecto de galería de imágenes utilizando la API de Pexels.
 * Permite buscar, filtrar por orientación, paginar, y gestionar imágenes favoritas en LocalStorage.
 * @author
 * Hanna Polishchuk
 * Sonia Nseng Mikue
 */
//VARIABLES
document.addEventListener('DOMContentLoaded', () => {
    const inputBuscador = document.querySelector('#buscador');
    const buscadorFotos = document.querySelector('#buscadorFotos');
    const pError = document.querySelector('#pError');
    const orientacion = document.querySelector('#orientacion');
    const errorDOM = document.querySelector('#errorDOM');
    const containerGaleria = document.querySelector('#containerGaleria');
    const fragment = document.createDocumentFragment();
    const containerFavoritos = document.querySelector('#favoritos');
    const tresCategorias = document.querySelector('#tresCategorias');
    const paginacionButtons = document.querySelector('#paginacionButtons');
    const popup = document.querySelector('#popup');
    const popupImg = document.querySelector('#popupImg');
    const cerrarPopup = document.querySelector('#cerrarPopup');

    const urlBase = `https://api.pexels.com/v1/`;
    const autorizacion = `851Ebzs3BlLqHHT4VZBNwGS0F7vmu9UH97VyAfhj9mjWBNZ4FRA4zrjt`;
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
     * @listens buscadorFotos#submit
     */
    buscadorFotos?.addEventListener('submit', (ev) => {
        ev.preventDefault();
        busqueda = inputBuscador.value.trim().toLowerCase();
        if (validarInput(busqueda)) {
            paginaActual = 1;
            pintarImagenes();
            inputBuscador.value = '';
        }
    });

    /**
     * El evento que se activa al cambiar la orientación: horizontal, vertical o todo.
     * @event change
     * @listens orientacion#change
     */
    orientacion?.addEventListener('change', (ev) => {
        valorOrientacion = ev.target.value;
        pintarImagenes();
    });

    /**
     * El evento que se activa con un click del ratón según el elemento pulsado.
     * Maneja categorías, favoritos, paginación, y popup de imágenes.
     * @event click
     * @listens document#click
     */
    document.addEventListener('click', (ev) => {
        //Al pulsar cada una de las 3 categorías se cargan las fotos de la categoría seleccionada.
        if (ev.target.matches('.imgCategoria')) {
            busqueda = ev.target.id;
            pintarImagenes();
        };
        //Añadir o quitar de favoritos 
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

        //Eliminar de favoritos desde la página de favoritos
        if (ev.target.matches('.elimBtn')) {
            const idEliminar = ev.target.id;
            eliminarFavoritos(idEliminar);
        }

        //Elegir la página y cargar las fotos de esta página
        if (ev.target.matches('.btnPaginacion')) {
            paginaActual = ev.target.id;
            pintarImagenes()
        }

        //Ir a la página anterior
        if (ev.target.matches('#paginaAnterior')) {
            if (paginaActual > 9) {
                paginaActual = primeraPagBloque - 1;
                pintarImagenes();
                pintarBotones();
            }
        }

        //Ir a la siguiente página
        if (ev.target.matches('#paginaSiguiente')) {
            paginaActual = ultimaPagBloque + 1;
            pintarImagenes();
            pintarBotones();
        }

        // Al pulsar el boton 'Ampliar' se muestre en un popup con la imagen ampliada de favoritos.
        if (ev.target.matches('.ampliarBtn')) {
            const id = ev.target.id;
            const favoritos = getLocalStorage();
            const foto = favoritos.find(img => img.id == id);

            if (foto) {
                popupImg.src = foto.srcG;
                popupImg.alt = foto.alt;
                popup.classList.add('popup-visible'); // para que se muestre el popup oculto por defecto.
            }
        }

        // Cerrar el popup cuando se pulsa la 'X'. 
        if (ev.target === cerrarPopup) {
            popupImg.src = '';
            popup.classList.remove('popup-visible'); // para que deje de mostrarse.
        }
    });

    //FUNCIONES
    /**
     * Validar el texto introducido en el buscador que solo puede contener palabras y espacios.
     * @function validarInput
     * @param {string} busqueda - la palabra que introduce el usuario para el tema de las fotos que se renderizarán.
     * @returns {boolean} true si la palabra ha pasado la validación o false en caso contrario.
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
    /**
     * Muestra un mensaje de error en el DOM.
     * @function escribirError
     * @param {string} error - Mensaje de error.
     */
    const escribirError = (error) => {
        errorDOM.innerHTML = '';
        errorDOM.textContent = error;
        errorDOM.classList.add('errorDOM');
    }
    /**
     * Crea la URL completa para realizar una petición a la API de Pexels.
     * @param {?number} [id=null] - ID de la imagen si se solicita una sola. 
     * @returns {string} La cadena con la URL completa para usar en fetch.
     */
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
     * Función para llamar a la API de Pexels y obtener las imágenes con el tema solicitado o una imagen única por su ID.
     * @function llamarApi
     * @param {?number} [id=null] - ID de la imagen si se solicita una sola.
     * @returns {Promise<Object>} data - objeto JSON con las imágenes y otros datos.
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
    /**
     * Pinta las categorías en la página principal.
     * @function pintarTodasCategorias
     */
    const pintarTodasCategorias = () => {
        const arrayCategorias = [
            { id: 39627, categoria: 'Animales' },
            { id: 16743523, categoria: 'Comida' },
            { id: 1430677, categoria: 'Playa' }
        ]
        tresCategorias.innerHTML = '';
        arrayCategorias.forEach((categoria) => pintarCategorias(categoria));
    }
    /**
     * Renderiza una categoría con la imagen asignada por el ID.
     * @async
     * @function pintarCategorias
     * @param {{ id: number, categoria: string }} categoria - Objeto con ID y nombre de categoria.
     */
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
    /**
     * Genera los botones de paginación en bloques de 10.
     * @function pintarBotones
     */
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
    /**
     * Pinta las imagenes obtenidas de la API según la búsqueda.
     * @async
     * @function pintarImagenes
     */
    const pintarImagenes = async () => {
        try {
            errorDOM.innerHTML = '';
            if (!containerGaleria) return;
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
                pAutor.textContent = `Autor: ${foto.photographer} `;
                pDescripcion.textContent = foto.alt;
                botonFavoritos.id = foto.id;
                botonFavoritos.textContent = '♡ Favoritos';
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
    /**
     * Obtiene las imágenes favoritas del LocalStorage.
     * @function getLocalStorage
     * @returns {Array<Object>} Array de objetos con las fotos guardadas o un array vacío.
     */
    const getLocalStorage = () =>
        JSON.parse(localStorage.getItem('favoritos')) || [];
    /**
     * Guarga los favoritos en LocalStorage.
     * @function setLocalStorage
     * @param {Array<Object>} favoritos - Array con los objetos de fotos.
     */
    const setLocalStorage = (favoritos) =>
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
    /**
     * Añade una foto a la lista de favoritos.
     * @async
     * @function agregarFavoritos
     * @param {number} id - ID de la foto seleccionada.
     */
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
    /**
     * Pinta en el DOM todas las imágenes guardadas como favoritas.
     * @function pintarFavoritos
     */
    const pintarFavoritos = () => {
        if (!containerFavoritos) return;
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
            pautorFav.textContent = `Autor: ${objetoFotos.autor} `;
            pDescripcionFav.textContent = objetoFotos.alt;
            botonEliminar.id = objetoFotos.id;
            botonEliminar.textContent = 'Eliminar';
            botonEliminar.classList.add('btn');
            botonEliminar.classList.add('elimBtn');
            botonAmpliar.id = objetoFotos.id;
            botonAmpliar.classList.add('btn', 'ampliarBtn');
            botonAmpliar.textContent = 'Ampliar 🔍';
            articleFav.classList.add('articleImg');

            divFav.append(imgFav);
            articleFav.append(divFav, pDescripcionFav, pautorFav, botonEliminar, botonAmpliar);
            fragment.append(articleFav);
        })
        containerFavoritos.append(fragment);
    }
    /**
     * Elimina una imagen de los favoritos.
     * @function eliminarFavoritos
     * @param {number} id - ID de la imagen a eliminar.
     */
    const eliminarFavoritos = (id) => {
        let favoritos = getLocalStorage();
        favoritos = favoritos.filter((foto) => foto.id != id);
        setLocalStorage(favoritos);
        if (containerFavoritos) {
            containerFavoritos.innerHTML = '';
            pintarFavoritos();
        }
    };
    /**
     * Inicializa la aplicación según la página actual.
     * Carga categorías o favoritos según la página.
     * @function init
     */
    const init = () => {
        if (location.pathname.includes('favoritos')) {
            pintarFavoritos();
        } else if (location.pathname.includes('index')) {
            pintarTodasCategorias();
        }
    }
    init();
});