const petsList = document.getElementById("pets-List");
const petName = document.getElementById("pet-Name");
const petOwner = document.getElementById("pet-Owner");
const petType = document.getElementById("pet-Type");
const petSexF = document.getElementById("customRadio1");
const petSexM = document.getElementById("customRadio2");
const petForm = document.getElementById("petsForm");
const saveBtn = document.getElementById("save-btn");
const closeBtn = document.getElementById("close-btn");
const indexAux = document.getElementById("index-aux");
const newButton = document.getElementById("new-button");
const url = "http://localhost:5000/mascotas";
let pets = [];

async function getData() {
    try {
        const response = await fetch(url);
        const serverPetsAux = await response.json();
        
        if(Array.isArray(serverPetsAux)){
            pets = serverPetsAux;
        }
        if (pets.length > 0) {
            const htmlPets = pets.map((pet, index) => `<tr>
            <th scope="row">${index}</th>
            <td>${pet.type}</td>
            <td>${pet.name}</td>
            <td>${pet.pSex}</td>
            <td>${pet.owner}</td>
            <td>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" title="Editar" class="btn btn-warning edit" data-index=${index}><i class="fas fa-edit"></i></button>
                    <button type="button" title="Eliminar" class="btn btn-danger delete" data-index=${index}><i class="far fa-trash-alt"></i></button>
                </div>
            </td>
            </tr>`).join("");
            petsList.innerHTML = htmlPets;
            Array.from(document.getElementsByClassName("edit")).forEach((editButton, index) => editButton.onclick = editData(index));
            Array.from(document.getElementsByClassName("delete")).forEach((deleteButton, index) => deleteButton.onclick = deleteData(index));
            return;
        }
        petsList.innerHTML = `<tr>
            <td colspan="6" class="empty-list">No se encontraron registros</td>
            </tr>`;

    } catch (error) {
        console.log({error});
        $('.alert').show();
    }
}

function deleteData(index) {
    const urlAux = `${url}/${index}`;
    
    return async function deleteClick(){
        try {
            const response = await fetch(urlAux, {
                method: 'DELETE',
                });
                if (response.ok) {
                    getData();
                }
        } catch (error) {
            console.log({error});
            $('.alert').show();
        }
    }  
}

function editData(index) {
    return function editClick(){
        saveBtn.innerText = 'Editar'
        $('#exampleModal').modal('toggle')
        const petAux = pets[index];
        petType.value  = petAux.type ? petAux.type : '';
        petName.value  = petAux.name ? petAux.name : '';
        petOwner.value = petAux.owner ? petAux.owner : '';
        if (petAux.pSex === "Hembra") {
            petSexF.checked = true;
            petSexM.checked = false;
        }else{
            petSexM.checked = true;
            petSexF.checked = false;
        }
        indexAux.value = index;
    }
}

async function sendData(event){
    event.preventDefault();

    try {
        const data = {
            type: petType.value,
            name: petName.value,
            pSex: petSexF.checked ? petSexF.value : petSexM.value,
            owner: petOwner.value,
        };
        let method = "POST";
        let urlAux = url;
        const action = saveBtn.innerText;
        if(action === "Editar"){
            method = "PUT";
            pets[indexAux.value] = data;
            urlAux += `/${indexAux.value}`;
        }

        const response = await fetch(urlAux, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            getData();
            resetModalForm();
        }
    } catch (error) {
        console.log({error});
        $('.alert').show();
    }
}

function resetModalForm() {
    petName.value = '';
    petType.value = 'Selecciona tu Mascota...';
    petOwner.value = '';
    petSexF.checked = true;
    petSexM.checked = false;
    saveBtn.innerText = 'Crear'
    indexAux.value = '';
}

getData();

petForm.onsubmit = sendData;
saveBtn.onclick = sendData;