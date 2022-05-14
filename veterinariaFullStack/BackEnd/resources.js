module.exports = {
    pets: [
        {type: "Gato", name: "Tofu", pSex: "Macho", owner: "Maria"},
        {type: "Gato", name: "Mocca", pSex: "Hembra", owner: "Merishor"}
    ],
    vets: [
        {name: "Maria", lastName: "Carrillo", ID: '12123123', country: "Venezuela"},
        {name: "Gabriel", lastName: "Dugarte", ID: '12123123', country: "Venezuela"}
    ],
    owners: [
        {name: "Darcy", lastName: "Rodriguez", ID: '12123123'},
        {name: "Gladys", lastName: "Medina", ID: '12123123'}
    ],
    consults: [
        {pet: 0, vet: 0, mail: 'abc@mypet.com', comments: 'consulta', createDate: new Date(), editDate: null, HC: "test", diagnostic: "parasitos"},
        {pet: 1, vet: 1, mail: 'abc@mypet.com', comments: 'consulta', createDate: new Date(), editDate: null, HC: "test", diagnostic: "parasitos"}
    ],
}