module.exports = function consultsHandler({
    consults, 
    vets, 
    pets
}) {
    return {
        get: (data, callback) => {
            if (data.index) {
                if (consults[data.index]) {
                    return callback(200, consults[data.index]);                    
                }
                return callback(404, {message: `index ${data.index} consult not found`})
            }
            const relatedConsult = consults.map(_consults => ({
                ..._consults, 
                pet: {...pets[_consults.pet], id: _consults.pet}, 
                vet: {...vets[_consults.vet], id: _consults.vet},
            }));
            callback(200, relatedConsult);
        },
        put: (data, callback) => {
            if (data.index) {
                if (consults[data.index]) {
                    const { createDate } = consults[data.index];
                    consults[data.index] = {
                        ...data.payload,
                        createDate,
                        editDate: new Date(),
                    };
                    return callback(200, consults[data.index]);                    
                }
                return callback(404, {message: `index ${data.index} consult not found`})
            }
            callback(400, {message: "index not specified"});
        },
        delete: (data, callback) => {
            if (data.index) {
                if (consults[data.index]) {
                    consults = consults.filter(
                        (_consults, consultsIndex) => consultsIndex != data.index);
                    return callback(204, {message: `index ${data.index} consult has been deleted`});               
                }
                return callback(404, {message: `index ${data.index} consult not found`})
            }
            callback(400, {message: "index not specified"});
        },
        post: (data, callback) => {
            let consult = data.payload;
            consult.createDate = new Date();
            consult.editDate = null;
            consults = [...consults, consult];
            callback(201, consult);
          },
    };
}