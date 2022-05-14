const resources = require('./resources')
const pets = require('./Paths/pets')
const vets = require('./Paths/vets')
const owners = require('./Paths/owners')
const consults = require('./Paths/consults')

module.exports = {
    ruta: (data, callback) => {
        callback(200,{message: 'esta es ruta'})
    },
    mascotas: pets(resources.pets),
    veterinarias: vets(resources.vets),
    duenos: owners(resources.owners),
    consultas: consults(resources),
    noResponse: (data, callback) => {
        callback(404, {message: 'no encontrado'})
    }
}