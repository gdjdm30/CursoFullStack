const consultsList = document.getElementById("consults-List");
const conPetName = document.getElementById("con-petName");
const conVetName = document.getElementById("con-vetName");
const conEmail = document.getElementById("con-email");
const conComments = document.getElementById("con-comments");
const conHC = document.getElementById("con-HC");
const conDiag = document.getElementById("con-diag");

const consultsForm = document.getElementById("consultsForm");
const saveBtn = document.getElementById("save-btn");
const closeBtn = document.getElementById("close-btn");
const indexAux = document.getElementById("index-aux");
const newButton = document.getElementById("new-button");
const url = "http://localhost:5000";
let consults = [];
let pets = [];
let vets = [];

async function getData() {
    const entity = "consultas";
    try {
        const response = await fetch(`${url}/${entity}`);
        const serverConsAux = await response.json();

        if(Array.isArray(serverConsAux)){
            consults = serverConsAux;
        }
        if (consults.length > 0) {
            const htmlConsults = consults.map((consult, index) => `<tr>
            <th scope="row">${index}</th>
            <td>${consult.pet.name}</td>
            <td>${consult.vet.name} ${consult.vet.lastName}</td>
            <td>${consult.mail}</td>
            <td>${consult.comments}</td>
            <td>${consult.HC}</td>
            <td>${consult.diagnostic}</td>
            <td>${consult.createDate}</td>
            <td>${consult.editDate}</td>
            <td>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" title="Editar" class="btn btn-warning edit" data-index=${index}><i class="fas fa-edit"></i></button>
                </div>
            </td>
            </tr>`).join("");
            consultsList.innerHTML = htmlConsults;
            Array.from(document.getElementsByClassName("edit")).forEach((editButton, index) => editButton.onclick = editData(index));
            return;
            }
            consultsList.innerHTML = `<tr>
            <td colspan="6" class="empty-list">No se encontraron registros</td>
            </tr>`;

    } catch (error) {
        console.log({error});
        $('.alert-danger').show();       
    }
}

// function deleteData(index) {
//     const urlAux = `${url}/${entity}/${index}`;
    
//     return async function deleteClick(){
//         try {
//             const response = await fetch(urlAux, {
//                 method: 'DELETE',
//                 });
//                 if (response.ok) {
//                     getData();
//                 }
//         } catch (error) {
//             console.log({error});
//             $('.alert-danger').show();
//         }
//     }  
// }

function editData(index) {
    return function editClick(){
        saveBtn.innerText = 'Editar'
        $('#exampleModal').modal('toggle')
        const consAux = consults[index];
        indexAux.value = index;
        conPetName.value = consAux.pet.id;
        conVetName.value = consAux.vet.id;
        conEmail.value  = consAux.mail ? consAux.mail : '';
        conComments.value  = consAux.comments ? consAux.comments : '';
        conHC.value  = consAux.HC ? consAux.HC : '';
        conDiag.value  = consAux.diagnostic ? consAux.diagnostic : '';
    }
}

async function sendData(event){
    const entity = "consultas";
    event.preventDefault();

    try {
        const data = {
            pet: conPetName.value,
            vet: conVetName.value,
            mail: conEmail.value,
            comments: conComments.value,
            HC: conHC.value,
            diagnostic: conDiag.value,
        };

        if(dataValidation(data) === true){

            let method = "POST";
            let urlAux = `${url}/${entity}`;
            const action = saveBtn.innerText;
            if(action === "Editar"){
                method = "PUT";
                consults[indexAux.value] = data;
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
            return;
        }
        $('.alert-warning').show();
    } catch (error) {
        console.log({error});
        $('.alert-danger').show();
    }
}

function resetModalForm() {
    conPetName.value = '';
    conVetName.value = '';
    conEmail.value = '';
    conComments.value = '';
    conHC.value = '';
    conDiag.value = '';
    indexAux.value = '';
    saveBtn.innerText = 'Crear'
}

async function getPetsData() {
    const entity = "mascotas";
    try {
        const response = await fetch(`${url}/${entity}`);
        const serverPetsAux = await response.json();

        if(Array.isArray(serverPetsAux)){
            pets = serverPetsAux;
        }
        if (pets.length > 0) {
            pets.forEach((_conPetName, index) => {
                const currentOption = document.createElement("option");
                currentOption.innerHTML = _conPetName.name;
                currentOption.value = index;
                conPetName.appendChild(currentOption);
            });
        }
    } catch (error) {
        console.log({error});
        $('.alert-danger').show();       
    }
}

async function getVetsData() {
    const entity = "veterinarias";
    try {
        const response = await fetch(`${url}/${entity}`);
        const serverVetsAux = await response.json();

        if(Array.isArray(serverVetsAux)){
            vets = serverVetsAux;
        }
        if (vets.length > 0) {
            vets.forEach((_conVetName, index) => {
                const currentOption = document.createElement("option");
                currentOption.innerHTML = `${_conVetName.name} ${_conVetName.lastName}`;
                currentOption.value = index;
                conVetName.appendChild(currentOption);
            });
            }
    } catch (error) {
        console.log({error});
        $('.alert-danger').show();       
    }
}

function dataValidation(data) {
    if (typeof data !== 'object') 
        return false;
    
    for(let key in data){
        if(data[key].length === 0) 
            return false;
    }
    return true;
}

getData();
getPetsData();
getVetsData();
consultsForm.onsubmit = sendData;
saveBtn.onclick = sendData;