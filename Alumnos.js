const cargarJSON = async function(url) {
    try {
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error("Error al cargar el archivo: " + url);
        }

        const data = await respuesta.json();
        return data;

    } catch (error) {
        console.error("Error al cargar los datos:", error);
        alert("No se pudo cargar el archivo: " + url);
        throw error;
    }
}

const ciudades = async () => await cargarJSON(`http://127.0.0.1:3000/ciudades`);
const usuario = async (cityId) => await cargarJSON(`http://127.0.0.1:3000/usuarios?cityId=${cityId}`);
const materiasUsuario = async (userId) => await cargarJSON(`http://127.0.0.1:3000/materia_usuario?userId=${userId}`);
const materias = async (ID) => await cargarJSON(`http://127.0.0.1:3000/materias?id=${ID}`);
const notas = async (subjectUserId) => await cargarJSON(`http://127.0.0.1:3000/notas?subjectUserId=${subjectUserId}`);
const notasprom = async (note) => await cargarJSON(`http://127.0.0.1:3000/notas?note=${note}`);


const ejecucion = async () => {
    
    const ciudad = await ciudades();

    const datos = await Promise.all(

        ciudad.map(async (city) => {
            //console.log(user.id,"a");

            const users = await usuario (city.id)

            const datosUser = await Promise.all(

                users.map(async (user) => {

                    const materUsuario = await materiasUsuario(user.id)
                    
                    //const materUsuario = await materiasUsuario(user.id);
                    // const subjects = await materias (user.id);
    
                    if (materUsuario==0){return{...user, Materias:"El Alumno no esta matriculado en ninguna materia" }}

                    const materiasDeUser = await Promise.all(
    
                        materUsuario.map(async (Mat) => {
    
                            const subjects = await materias (Mat.subjectId)

                            const mark = await notas (Mat.id)

                            let total = 0 ;

                            mark.map (({note})=> total+=note)

                            const prom = total/3;

                            return {...Mat, nombre_materia:subjects, notas: mark, promedio: prom.toFixed(2)}
                            
                        })


    
                    );
    
                    return{...user, Materias:materiasDeUser}
                })
            )

            

            //return user;
            return { ...city, Usuarios: datosUser}
        })//final de users.map

    );//Final de Promise all "datos"

    console.log(datos);
}//Final de const ejecucion

ejecucion();
