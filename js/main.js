// ESTRUCTURA DEL PROYECTO:
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
// API-KEY
// URL-Base



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

// 2- Funcion llamar a la API
// const llamarApi(`${url}`)
//Usar async, try: fetch(`${url-base}${url}`)
/*  try {
        const resp = await fetch('url')
        //console.log(resp)
        if (resp.ok) {
            const data = await resp.json()
            console.log(data)
            return data
        } else {
            throw "Error 404. Page not found"
        }
    } catch (error) {
        throw (error)
    }
*/

// 3- Funcion Pintar imagenes:
// const pintarImagenes()
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


