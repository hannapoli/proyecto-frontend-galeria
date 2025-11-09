// ESTRUCTURA DEL PROYECTO:
document.addEventListener('DOMContentLoaded', () => {
    //VARIABLES
    //Declarar las variables para capturar los elementos del DOM:
    //input
    //formulario -> para event listener
    //botón submit
    //selector y sus opciones
    //los 3 articles de categorias de imagenes
    // div containerGaleria
    // div paginacion
    //botones paginacion
    // boton añadir favoritos 
    //boton eliminar favoritos
    // fragment
    // #favoritos para añidir las imagenes favoritas
    const urlBase = `https://api.pexels.com/v1/`;
    const autorizacion = ``;
    const galeria = document.querySelector('#galeria');

    ////en autorizacion poner su token////


    //EVENTOS

    //Al pulsar el boton buscar que muestre las imagenes - evento de formulario. pintarImagenes()
    //Al pulsar la orientacion cambiarOrientacion() y  pintarImagenes() ?
    //Al pulsar cada una de las 3 categorías
    //Añadir a favoritos  añadirFavoritos()
    //Eliminar de favoritos
    //Cambiar de página


    //FUNCIONES
    // 1- Funcion Validar el texto introducido en el buscador:
    // const validar()
    // Regex: evitar símbolos, números; recortar espacios al principio y al final; pasar todo a minuscula
    // 

    const escribirError = (error) => {
        galeria.innerHTML = '';
        const errorMsg = document.createElement('P');
        errorMsg.textContent = error.message;
        //crear esta clase y editarla en CSS (grande)
        errorMsg.classList.add('errorDOM');
        galeria.append(errorMsg);
    }

    // 2- Funcion llamar a la API
    //Variables temporales
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
        const fotosTotales = await llamarApi(url, busqueda);
        console(fotosTotales);
        //fotosTotales.photos - array de fotos (12)
        // src.medium
        //id
        //alt: alt de photo y descripción (en textContent de p)
        // photographer
    }
    // llamar a la funcion -> validar()
    //comprobar si no es valido -> hacer un bucle para enviar un mensaje para que introduzca datos validos
    //Si valido -> llamar API
    //BUCLE forEach para crear elementos en el DOM:
    //ARTICLE
    //DIV
    //IMG: asignarle alt, src, clase CSS
    //2 párrafos
    //button favoritos
    //Meter img dentro de div
    //Meter dentro de article: div, ps y button
    //Meter article en fragment
    //Fuera del bucle meter fragment en containerGaleria

    // 4- Funcion cambiarOrientacion()

    // 5- Funcion añadirFavoritos()
    // cuando pulsamos añadir a favoritos -> se guarda en localStorage (con nombre o id de imagen)
    // en localstorage tenemos un array de objetos
    // una funcion getLocalStorage
    // una funcion setLocalStorage

    // 6- Funcion pintarFavoritos() dudas: reutilzar pintarImagenes() ??

    //7- Funcion eliminarFavoritos()
    //Mirar local storage, buscar la imagen y eliminarla
    //Volver a pintar

    // 8- Funcion cambiarPagina()


    //INVOCACIONES

});