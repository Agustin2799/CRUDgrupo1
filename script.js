//Valores de los inputs.
const inputGetId = document.getElementById("inputGet1Id");
const inputName = document.getElementById("inputPostNombre");
const inputLastname = document.getElementById("inputPostApellido");
const inputPutId = document.getElementById("inputPutId");
const inputDelete = document.getElementById("inputDelete");
const inputNameModal = document.getElementById("nameModal");
const inputLastnameModal = document.getElementById("lastnameModal");

//Botones
const btnBuscar = document.getElementById("btnGet1");
const btnAgregar = document.getElementById("btnPost");
const btnModificar = document.getElementById("btnPut");
const btnBorrar = document.getElementById("btnDelete");
const btnGuardarCambiosPut = document.getElementById("guardarCambiosPut");

//Contenedor
const containerDatos = document.getElementById("results");

//Variable bandera que usaremos dentro del evento click para el botón modificar para controlar si se activa el modal o no, en función de si el usuario existe en la base de datos.
let usuarioEncontrado = true;

//Nueva instancia de un objeto modal, con nuestro modal como parámetro.
var modal = new bootstrap.Modal(document.getElementById('modal'));

document.addEventListener("DOMContentLoaded", () => {
    //Eventos para los botones Buscar, Agregar,Modificar y Borrar.
    btnBuscar.addEventListener("click", () => {
        let url = `https://654ccc2077200d6ba85970c2.mockapi.io/users`
        let id = inputGetId.value;
        if (id) {
            url = `https://654ccc2077200d6ba85970c2.mockapi.io/users/${id}`;
        }
        fetch(url, {
            method: "GET",
            headers: { "content-type": "application/json" },
        })
            .then((res) => {
                console.log(res.body)
                if (res.ok) {
                    return res.json();
                } else {
                    alertas('roja', `No se pudo encontrar el usuario con ID: ${id}. No existe.`, 3000)
                }
            })
            .then((users) => {
                containerDatos.textContent = "";
                if (Array.isArray(users)) {
                    users.forEach((user) => {
                        if (user.id) {
                            mostrarDatos(user, containerDatos);
                        }
                    });
                    console.log('varios usuarios')
                } else {
                    mostrarDatos(users, containerDatos);
                    console.log('solo un usuario')
                }

            })
            .catch((error) => {
                console.log("Ocurrió un error con el get", error);
            });
    });
    btnAgregar.addEventListener("click", async () => {
        let url = `https://654ccc2077200d6ba85970c2.mockapi.io/users`

        let nuevoUser = {
            name: inputName.value, lastname: inputLastname.value
        }
        await fetch(url, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(nuevoUser)
        }).then(res => {
            if (res.ok) {
                alertas('verde', "Se agregó el usuario correctamente.", 3000)
                return res.json();
            }
        }).catch(error => {
            console.log("Ocurrió un error con el post:", error)
        })

        await fetch(url, {
            method: "GET",
            headers: { "content-type": "application/json" },
        })
            .then((res) => {
                console.log(res.body)
                if (res.ok) {
                    return res.json();
                }
            })
            .then((users) => {
                containerDatos.textContent = "";
                if (Array.isArray(users)) {
                    users.forEach((user) => {
                        if (user.id) {
                            mostrarDatos(user, containerDatos);
                        }
                    });

                } else {
                    mostrarDatos(users, containerDatos);
                }
            })
            .catch((error) => {
                console.log("Ocurrió un error con el get", error);
            });

    })
    btnModificar.addEventListener("click", () => {
        if (usuarioEncontrado) {
            modal.show();
        } else {
            modal.hide();
            alertas("roja", `No se puede modificar el usuario con el ID: ${inputPutId.value}. No existe.`, 3000)
        }
    })
    btnBorrar.addEventListener("click", async () => {

        let id = inputDelete.value;
        let url = `https://654ccc2077200d6ba85970c2.mockapi.io/users/${id}`

        if (url) {
            await fetch(url, {
                method: 'DELETE',
            }).then(res => {
                if (res.ok) {
                    alertas("verde", `Se ah borrado el usuario con ID: ${id} correctamente`, 3000)
                    return res.json();
                } else {
                    alertas("roja", `No se ha podido borrar el usuario con ID: ${id}. No existe.`, 3000)
                }
            }).catch(error => {
                console.log("Ocurrió un error con el DELETE:", error)
            })
        }
        await fetch(`https://654ccc2077200d6ba85970c2.mockapi.io/users`, {
            method: "GET",
            headers: { "content-type": "application/json" },
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((users) => {
                containerDatos.textContent = "";
                if (Array.isArray(users)) {
                    users.forEach((user) => {
                        if (user.id !== undefined) {
                            mostrarDatos(user, containerDatos);
                        }
                    });
                    containerDatos.lastChild.remove();
                } else {
                    mostrarDatos(users, containerDatos);
                }

            })
            .catch((error) => {
                console.log("Ocurrió un error con el get dentro del delete", error);
            });
    })

    //Evento para cuando obtener el usuario cuando se ingresa un dato, el cual queremos modificar, lo hacemos así para comprobar que exista el usuario primero y luego se habilita el modal.
    inputPutId.addEventListener("input", async () => {
        let id = inputPutId.value;
        url = `https://654ccc2077200d6ba85970c2.mockapi.io/users/${id}`;

        if (inputPutId.value) {
            await fetch(url, {
                method: "GET",
                headers: { "content-type": "application/json" },
            })
                .then((res) => {
                    if (res.ok) {
                        usuarioEncontrado = true;
                        console.log("Se encontró el usuario");
                        habilitaBoton1Input(inputPutId, btnModificar);
                        return res.json();

                    } else {
                        usuarioEncontrado = false;
                    }
                })
                .then((user) => {
                    if (user) {
                        inputNameModal.value = user.name
                        inputLastnameModal.value = user.name
                    }
                })
                .catch((error) => {
                    console.log("Ocurrió un error con el get del id del modificar", error);
                });
        }
        habilitaBoton1Input(inputPutId, btnModificar);
    })
    //Evento para el botón guardar cambios del modal.
    btnGuardarCambiosPut.addEventListener("click", async () => {

        let id = inputPutId.value;
        let url = `https://654ccc2077200d6ba85970c2.mockapi.io/users/${id}`
        //fetch que actualiza los datos
        await fetch(url, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ name: inputNameModal.value, lastname: inputLastnameModal.value })
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(element => {
            alertas("verde", "Se modifico el usuario correctamente.", 3000);
            modal.hide();
        }).catch(error => {
            console.log("Ocurrió un error con el post:", error)
        })

        //fetch que muestra los datos actualizados.
        await fetch(`https://654ccc2077200d6ba85970c2.mockapi.io/users`, {
            method: "GET",
            headers: { "content-type": "application/json" },
        })
            .then((res) => {
                console.log(res.body)
                if (res.ok) {
                    return res.json();
                }
            })
            .then((users) => {
                containerDatos.textContent = "";
                if (Array.isArray(users)) {
                    users.forEach((user) => {
                        if (user.id) {
                            mostrarDatos(user, containerDatos);
                        }
                    });
                } else {
                    mostrarDatos(users, containerDatos);
                }

            })
            .catch((error) => {
                console.log("Ocurrió un error con el get", error);
            });

    })
    
    //Lógica para deshabilitar los botones cuando se carga la página
    habilitaBoton2Inputs(inputName, inputLastname, btnAgregar);
    habilitaBoton1Input(inputPutId, btnModificar);
    habilitaBoton1Input(inputDelete, btnBorrar);

    //Lógica para deshabilitar los botones cuando se ingresa datos en sus inputs
    inputName.addEventListener('input', () => {
        habilitaBoton2Inputs(inputName, inputLastname, btnAgregar);
    })
    inputLastname.addEventListener('input', () => {
        habilitaBoton2Inputs(inputName, inputLastname, btnAgregar);
    })
    inputDelete.addEventListener('input', () => {
        habilitaBoton1Input(inputDelete, btnBorrar);
    })
});
//Función para deshabilitar o habilitar un boton asociado a dos inputs.
function habilitaBoton2Inputs(input1, input2, boton) {
    if (input1.value && input2.value) {
        boton.disabled = false;
    } else {
        boton.disabled = true;
    }
}
//Función para deshabilitar o habilitar un boton asociado a un input.
function habilitaBoton1Input(input1, boton) {
    if (input1.value) {
        boton.disabled = false;
    } else {
        boton.disabled = true;
    }
}
function alertas(color, mensaje, miliSegundos) {

    const alertaVerde = document.getElementById("alertaVerde");
    const alertaAmarilla = document.getElementById('alertaAmarilla');
    const alertaRoja = document.getElementById('alertaRoja');

    if (color === 'verde') {
        alertaVerde.textContent = mensaje
        alertaVerde.style.display = "block";
        setTimeout(() => {
            alertaVerde.style.display = "none";
        }, miliSegundos);
    } else if (color === 'amarilla') {
        alertaAmarilla.textContent = mensaje
        alertaAmarilla.style.display = "block";
        setTimeout(() => {
            alertaAmarilla.style.display = "none";
        }, miliSegundos);
    } else if (color === 'roja') {
        alertaRoja.textContent = mensaje
        alertaRoja.style.display = "block";
        setTimeout(() => {
            alertaRoja.style.display = "none";
        }, miliSegundos);
    } else {
        console.log("El color de la alerta no es correcto.")
    }
}
//Función que muestra los datos en un contenedor junto con un
function mostrarDatos(element, containerUl) {
    let li = document.createElement('li');
    li.textContent = `Id: ${element.id} Name: ${element.name} Lastname: ${element.lastname}`;
    containerUl.appendChild(li);
}