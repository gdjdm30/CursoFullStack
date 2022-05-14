const duenoList = document.getElementById("duenos-List");
const duenoName = document.getElementById("dueno-Name");
const duenosLast = document.getElementById("dueno-Last");
const duenoID = document.getElementById("dueno-ID");
const duenosForm = document.getElementById("duenosForm");
const saveBtn = document.getElementById("save-btn");
const closeBtn = document.getElementById("close-btn");
const indexAux = document.getElementById("index-aux");
const newButton = document.getElementById("new-button");
const url = "http://localhost:5000/duenos";
let owners = [];

async function getData() {
    try {
        const response = await fetch(url);
        const serverOwnersAux = await response.json();
        
        if(Array.isArray(serverOwnersAux)){
            owners = serverOwnersAux;
        }

        if (owners.length > 0) {
            const htmlDuenos = owners.map((owner, index) => `<tr>
            <th scope="row">${index}</th>
            <td>${owner.name}</td>
            <td>${owner.lastName}</td>
            <td>${owner.ID}</td>
            <td>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button type="button" title="Editar" class="btn btn-warning edit" data-index=${index}><i class="fas fa-edit"></i></button>
                    <button type="button" title="Eliminar" class="btn btn-danger delete" data-index=${index}><i class="far fa-trash-alt"></i></button>
                </div>
            </td>
            </tr>`).join("");
            duenoList.innerHTML = htmlDuenos;
            Array.from(document.getElementsByClassName("edit")).forEach((editButton, index) => editButton.onclick = editData(index));
            Array.from(document.getElementsByClassName("delete")).forEach((deleteButton, index) => deleteButton.onclick = deleteData(index));
            return;
        }
        duenoList.innerHTML = `<tr>
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
        const duenoAux = owners[index];
        duenoName.value  = duenoAux.name ? duenoAux.name : '';
        duenosLast.value  = duenoAux.lastName ? duenoAux.lastName : '';
        duenoID.value  = duenoAux.ID ? duenoAux.ID : '';
        indexAux.value = index;
    }
}

async function sendData(event){
    event.preventDefault();

    try {
        const data = {
            name: duenoName.value,
            lastName: duenosLast.value,
            ID: duenoID.value,
        };
        let method = "POST";
        let urlAux = url;
        const action = saveBtn.innerText;
        if(action === "Editar"){
            method = "PUT";
            owners[indexAux.value] = data;
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
    duenoName.value = '';
    duenosLast.value = '';
    duenoID.value = '';
    indexAux.value = '';
    saveBtn.innerText = 'Crear'
}

getData();
duenosForm.onsubmit = sendData;
saveBtn.onclick = sendData;