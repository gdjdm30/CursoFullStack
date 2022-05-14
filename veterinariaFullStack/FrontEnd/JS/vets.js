const vetsList = document.getElementById("vets-List");
const vetName = document.getElementById("vet-Name");
const vetLast = document.getElementById("vet-Last");
const vetID = document.getElementById("vet-ID");
const vetCountry = document.getElementById("vet-Country");
const vetForm = document.getElementById("vetsForm");
const saveBtn = document.getElementById("save-btn");
const closeBtn = document.getElementById("close-btn");
const indexAux = document.getElementById("index-aux");
const newButton = document.getElementById("new-button");
const url = "http://localhost:5000/veterinarias";
let vets = [];

async function getData() {
    try {
        const response = await fetch(url);
        const serverVetsAux = await response.json();

        if(Array.isArray(serverVetsAux)){
            vets = serverVetsAux;
        }

        if (vets.length > 0) {
            const htmlVets = vets.map((vet, index) => `<tr>
            <th scope="row">${index}</th>
            <td>${vet.name}</td>
            <td>${vet.lastName}</td>
            <td>${vet.country}</td>
            <td>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" title="Editar" class="btn btn-warning edit" data-index=${index}><i class="fas fa-edit"></i></button>
                    <button type="button" title="Eliminar" class="btn btn-danger delete" data-index=${index}><i class="far fa-trash-alt"></i></button>
                </div>
            </td>
            </tr>`).join("");
            vetsList.innerHTML = htmlVets;
            Array.from(document.getElementsByClassName("edit")).forEach((editButton, index) => editButton.onclick = editData(index));
            Array.from(document.getElementsByClassName("delete")).forEach((deleteButton, index) => deleteButton.onclick = deleteData(index));
            return;
        }
        vetsList.innerHTML = `<tr>
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
        const vetAux = vets[index];
        vetName.value  = vetAux.name ? vetAux.name : '';
        vetLast.value  = vetAux.lastName ? vetAux.lastName : '';
        vetID.value  = vetAux.ID ? vetAux.ID : '';
        vetCountry.value  = vetAux.country ? vetAux.country : '';
        indexAux.value = index;
    }
}

async function sendData(event){
    event.preventDefault();

    try {
        const data = {
            name: vetName.value,
            lastName: vetLast.value,
            ID: vetID.value,
            country: vetCountry.value,
        };
        let method = "POST";
        let urlAux = url;
        const action = saveBtn.innerText;
        if(action === "Editar"){
            method = "PUT";
            vets[indexAux.value] = data;
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
    vetName.value = '';
    vetLast.value = '';
    vetID.value = '';
    vetCountry.value = 'Pais';
    indexAux.value = '';
    saveBtn.innerText = 'Crear'
}

getData();
vetForm.onsubmit = sendData;
saveBtn.onclick = sendData;