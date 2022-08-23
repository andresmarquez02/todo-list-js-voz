// Variables generales
let form_create = document.getElementById('form-create-user');
let form_update = document.getElementById('form-update-user');
let id = 0;

// Expresion regular para validar textos
let validator = /^[a-zA-ZÁ-ÿ\s]{1,20}$/;

// Variables generales y llevadoras de control de almacenamiento
let counter = localStorage.getItem("counter") || 0;
let data = JSON.parse(localStorage.getItem("data")) || [];

// Funcion para crear usuarios
form_create.addEventListener('submit', e => {
    e.preventDefault();
    //agregado de el formulario a formdata para ser transformado a objeto
    // asi puedes manejar mejor el control de datos en un formulario
    form = new FormData(e.target);
    datosObjeto = Object.fromEntries([...form.entries()]);

    // Validaciones de los datos que vienen del formulario
    if(datosObjeto.nombre.trim() && datosObjeto.cargo.trim()){
        if(validator.test(datosObjeto.nombre) && validator.test(datosObjeto.cargo)){
            counter = parseInt(counter) + 1;

            // Agregamos id al obejto de datos para poderlos agregarlos al array inicial
            datosObjeto = {
                "id": counter,
                ...datosObjeto,
            };

            // Agregado de los datos al array para ser almacenado en el local storage
            data.push(datosObjeto);

            localStorage.setItem("data", JSON.stringify(data));
            localStorage.setItem("counter", counter);

            //Llamado de la funcion para iniciar los datos nuevamente
            initial_data();
            // Cerrado de la modal
            document.querySelector("#close-crear-usuario-modal").click();

            swal({
                icon: "success",
                text: "Usuario Creado Exitosamente",
                button: false,
            });
            window.location.reload();
        }
        else{
            swal({
                icon: "error",
                text: "Algunos de los datos son incorrectos",
                button: {
                    text: "Cerrar",
                }
            });
        }
        return ;
    }
    swal({
        icon: "error",
        text: "Algunos de los datos son incorrectos",
        button: {
            text: "Cerrar",
        }
    });


});

const edit_buttons = () => {
    let editButton = document.querySelectorAll("#edit-button");

    editButton.forEach((el) => {
        el.addEventListener("click", () => {
            id = el.getAttribute("data-id");
            for(const item of data){
                if(item.id == id){
                    form_update.elements.nombre_edit.value = item.nombre;
                    form_update.elements.cargo_edit.value = item.cargo;
                }
            }
            divModal = el.getAttribute("data-modal-toggle");
        });
    });
}

// Funcion para actualizar los usuarios
form_update.addEventListener('submit', e => {
    e.preventDefault();
    //agregado de el formulario a formdata para ser transformado a objeto
    // asi puedes manejar mejor el control de datos en un formulario
    form = new FormData(e.target);
    datosObjeto = Object.fromEntries([...form.entries()]);

    // Validaciones de los datos que vienen del formulario
    if(validator.test(datosObjeto.nombre) && validator.test(datosObjeto.cargo)){
        data.map((item, i)=>{
            if(item.id == id){
                // Agregado de los datos al array para ser almacenado en el local storage
                datosObjeto = {
                    "id": item.id,
                    ...datosObjeto,
                }
                data[i] = datosObjeto;
                localStorage.setItem("data", JSON.stringify(data));
            }
        });

        //Llamado de la funcion para iniciar los datos nuevamente
        initial_data();
        // Cerrado de la modal
        // document.querySelector("#close-editar-usuario-modal").click();
        swal({
            icon: "success",
            text: "Usuario Actualizado Exitosamente",
            button: false,
        });
        window.location.reload();
    }
    else{
        swal({
            icon: "error",
            text: "Algunos de los datos son incorrectos",
            button: {
                text: "Cerrar",
            }
        });
    }

});

//funcion para seleccionar el id a eliminar usuario
const delete_buttons = () => {
    //Seleccion del boton para eliminar
    let deleteButton = document.querySelectorAll("#delete-button");
    //Recorremos todos los botones para asignarles el evento
    deleteButton.forEach((el) => {
        el.addEventListener("click", () => {
            id = el.getAttribute("data-id");
            divModal = el.getAttribute("data-modal-toggle");
        });
    });
}

//evento para eliminar usuario
document.querySelector("#confirmation-delete").addEventListener("click",() => {
    //Aplicamos filter para que deje todo los que no queremos eliminar
    data = data.filter((item) => id != item.id);
    localStorage.setItem("data",JSON.stringify(data));
    //Llamado de la funcion para iniciar los datos nuevamente
    initial_data();
    // document.querySelector("#close-editar-usuario-modal").click();
    swal({
        icon: "success",
        text: "Usuario Eliminado Exitosamente",
        button: false,
    });
    window.location.reload();
});

// Funcion para inicializar todos los datos qu se han guardado.
const initial_data = () => {
    let box_data = document.getElementById('data');
    let numero_azar_anterior = 0;

    box_data.innerHTML = "";
    for(const item of data){
        // En estas linesas de un numero al azar es para que no se repitan tan seguidas las imagenes
        numero_azar = parseInt(Math.random() * (6 - 1) + 1);

        while (numero_azar_anterior == numero_azar) {
            numero_azar = parseInt(Math.random() * (6 - 1) + 1);
        }

        // Asignamos el html a una variable para pasarla a la otra variable esto es solo para
        //  que el codigo se vea un poco mejor
        numero_azar_anterior = numero_azar;
        html = `
            <li class="py-3 sm:py-4">
                <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                        <img class="w-8 h-8 rounded-full" src="img/profile-picture-${numero_azar}.jpg" alt="Neil image">
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                            ${item.nombre}
                        </p>
                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                            ${item.cargo}
                        </p>
                    </div>
                    <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        <button class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900" type="button" data-modal-toggle="editar-usuario-modal" data-id="${item.id}" id="edit-button">
                            Editar
                        </button>
                        <button type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4  focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" data-modal-toggle="eliminar-usuario-modal" data-id="${item.id}" id="delete-button">Eliminar</button>
                    </div>
                </div>
            </li>
        `;
        box_data.innerHTML += html;
    }
    edit_buttons();
    delete_buttons();
}
initial_data();

//Api de javascript para el reconocimiento de voz
const recongnition = new webkitSpeechRecognition();
//Le agregamos un lenguaje a detectar
recongnition.lang = "es-ES";
//El continuous para que escuche
recongnition.continuous = true;
//Id del input a agregarle lo que detecto la api
let idInput;

// Evento para ver el resultado  de lo detectado
recongnition.onresult = event => {
	for(const result of event.results){
        // Agrega valor a el input
		idInput.value = result[0].transcript;
        document.getElementById("loading").classList.add("hidden");
        document.getElementById("loading").classList.remove("flex");
	}
}

// Selector con el forEach para los botones que inician la api
document.querySelectorAll("#inicial-voce").forEach(el => {
    // Evento click para que empiece a escuchar
    el.addEventListener("click", () => {
        // Primero le damos el stop para que pause si habia una instacia anterior
        recongnition.stop();
        // Iniciod e la api
        recongnition.start();
        // Le pasamos el atributo a la variable para que despues pueda agregar valores al input
        idInput = document.getElementById(el.getAttribute("data-before-input"));
        //le damos flex al spinner para que pulse otra cosa el uusario mientras la api trabaja
        document.getElementById("loading").classList.add("flex");
        document.getElementById("loading").classList.remove("hidden");
    });
});

// Funcion para la inicializacion de contado de localstorage
// este contador funciona como un id para los datos que se estan almacenando
const initial_local_storage = () => {
    // Valida si contador es cero y lo inicializa
    if(counter == 0){
        localStorage.setItem("counter",0);
    }
}

initial_local_storage();
