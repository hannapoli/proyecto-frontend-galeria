// ESTRUCTURA DEL PROYECTO:
document.addEventListener('DOMContentLoaded', () => {
    //VARIABLES
    const inputBuscador = document.querySelector('#buscador');
    //console.log(inputBuscador);
    const formulario = document.querySelector('#BuscadorFotos');
    //console.log(formulario);
    const botonBuscar = document.querySelector('botonBuscar');//botón submit
    //selector y sus opciones
    //los 3 articles de categorias de imagenes: hay que darles un id en html!!
    const containerGaleria = document.querySelector('#containerGaleria');
    // div paginacion
    //botones paginacion
    // boton añadir favoritos 
    //boton eliminar favoritos
    // #favoritos para añidir las imagenes favoritas
    const fragment = document.createDocumentFragment();
    const urlBase = `https://api.pexels.com/v1/`;
    const autorizacion = `851Ebzs3BlLqHHT4VZBNwGS0F7vmu9UH97VyAfhj9mjWBNZ4FRA4zrjt`; // key de Sonia
    const galeria = document.querySelector('#galeria');

    ////en autorizacion poner su token////

    /*
const arrayPrueba = [
    {
        id: 1,
        src: 'selva1.jpg',
        alt: 'selva lorem',
        p: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    },
    {
        id: 2,
        src: 'selva2.jpg',
        alt: 'pasarela de madera en el mar',
        p: 'Consequuntur maxime libero aspernatur sequi quidem deserunt illum praesentium, itaque voluptatibus.',
    },
    {
        id: 1,
        src: 'selva1.jpg',
        alt: 'selva lorem',
        p: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    },
    {
        id: 3,
        src: 'selva3.jpg',
        alt: 'pasarela de madera en el mar',
        p: 'Hola Consequuntur munt illum praesentium, itaque voluptatibus.',
    },
];
*/

    //EVENTOS
    //Al pulsar el boton buscar que muestre las imagenes - evento de formulario. pintarImagenes()

    formulario.addEventListener("submit", (ev) => {
        ev.preventDefault();
        const palabra = inputBuscador.value.trim().toLowerCase();
        if (validarInput(palabra)) {
            pintarImagenes();
        }
    });

    //Al pulsar la orientacion cambiarOrientacion() y  pintarImagenes() ?
    //Al pulsar cada una de las 3 categorías
    //Añadir a favoritos  añadirFavoritos()
    //Eliminar de favoritos
    //Cambiar de página


    //FUNCIONES
    // 1- Funcion Validar el texto introducido en el buscador:
    // Regex: evitar símbolos, números; recortar espacios al principio y al final; pasar todo a minuscula
    // hay que invocarla dentro del evento "pulsar boton buscar"
    // REVISAR !!!!!!!! -> intentar hacerlo con un bucle cuando la palabra no es válida
    const validarInput = (texto) => {
        const regexp = /^[a-záéíóúÁÉÍÓÚüÜñÑ\s]+$/gi;

        if (!regexp.test(texto)) {
            alert("El texto no es válido. Solo se permiten letras y espacios.");
        } else {
            return true; // válido
        }
    }
    const escribirError = (error) => {
        galeria.innerHTML = ''; // duda: el mensaje de error se va a escribir en "galeria o containerGaleria??"
        const errorMsg = document.createElement('P');
        errorMsg.textContent = error.message;
        //crear esta clase y editarla en CSS (grande)
        errorMsg.classList.add('errorDOM');
        galeria.append(errorMsg);
    }

    // 2- Funcion llamar a la API
    //Variables temporales = para probar si funciona !!!!
    const url = `search`;
    let busqueda = `gato`;

    const llamarApi = async (url, busqueda) => {
        try {
            const respuesta = await fetch(`${urlBase}${url}?query=${busqueda}&size=medium&per_page=12&locale=es-ES`, {
                method: 'GET',
                headers: {
                    Authorization: autorizacion
                }
            });
            if (!respuesta.ok) throw Error(`Error ${respuesta.status}! No se ha encontrado la imagen solicitada.`);
            const data = await respuesta.json();
            console.log(data);
            return data;
            //pensar cómo y dónde gestionar este error (mensaje en el DOM)?
        } catch (error) {
            escribirError(error);
            console.error(error);
        }
    }

    //quitar de aquí y mover al eventListener o en la función de pintar
    llamarApi(url, busqueda);

    //Pintamos las fotos debajo de categorías

    // 3- Funcion Pintar imagenes:
    const pintarImagenes = async () => {
        try {
            containerGaleria.innerHTML = ''; // para limpiar imagenes previas - toda la galeria o el container de dentro???
            const datos = await llamarApi(url, busqueda); // creo que para poder poner 12 fotos tienes que pasar 1º el parametro perPage = 12, en la funcion llamarApi y aquí seria (url, busqueda, 12)
            const fotosTotales = datos.photos;
            console.log(fotosTotales);

            if (!fotosTotales || fotosTotales.length === 0) {  // si no existe, es null o indefined----o el array está vacío
                escribirError({ message: 'No se encontraron imágenes' });
                return; // se para la función
            }
            fotosTotales.forEach((foto => {
                const article = document.createElement('ARTICLE');
                const div = document.createElement('DIV');
                const imagen = document.createElement('IMG')
                const pAutor = document.createElement('P');
                const pDescripcion = document.createElement('P');
                const botonFavoritos = document.createElement('BUTTON');
                imagen.src = foto.src.medium; //revisar lo de medium
                imagen.alt = foto.alt;
                //imagen.classList.add(); (estilo CSS: flexbox etc)
                pAutor.textContent = `Autor: ${foto.photographer} `;
                pDescripcion.textContent = foto.alt;
                botonFavoritos.textContent = "♡";
                botonFavoritos.classList.add('btn');
                div.append(imagen);
                article.append(div, pAutor, pDescripcion, botonFavoritos);
                fragment.append(article);
            }));
            containerGaleria.append(fragment); // o toda la galeria???
        } catch (error) {
            escribirError();
        }
    }

    pintarImagenes()

    // llamar a la funcion -> validar()
    //comprobar si no es valido -> hacer un bucle para enviar un mensaje para que introduzca datos validos
    //Si valido -> llamar API
    //BUCLE forEach para crear elementos en el DOM
    /*
   Corazón relleno 
   &#9829;   ♥
   Corazón vacío
   &#9825;   ♡
   */
    // 4- Funcion cambiarOrientacion()

    // 5- Funcion añadirFavoritos()
    // cuando pulsamos añadir a favoritos -> se guarda en localStorage (con nombre o id de imagen)
    // en localstorage tenemos un array de objetos
    // una funcion getLocalStorage
    // una funcion setLocalStorage

    /*const añadirFavoritos = () => {
        let favoritos = JSON.parse(localStorage.getItem("favoritos")) || []; 
        // 1º Ver si hay algo en favoritos: localStorage.getItem devuelve string JSON o null si no hay nada 
        // con .parse se convierte en array de objs
        // si es null creamos un array vacio
        if () {

        }
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        //actualiza el array  y lo guarda en localStorage
    }
        */

    // 6- Funcion pintarFavoritos() dudas: reutilzar pintarImagenes() ??


    //7- Funcion eliminarFavoritos()
    //Mirar local storage, buscar la imagen y eliminarla
    //Volver a pintar

    // 8- Funcion cambiarPagina()

    //INVOCACIONES

});