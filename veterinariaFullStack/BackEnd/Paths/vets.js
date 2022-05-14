module.exports = function vetsHandler(vets) {
    return {
        get: (data, callback) => {
            if (data.index) {
                if (vets[data.index]) {
                    return callback(200, vets[data.index]);                    
                }
                return callback(404, {message: `index ${data.index} vet not found`})
            }
            callback(200, vets);
        },
        put: (data, callback) => {
            if (data.index) {
                if (vets[data.index]) {
                    vets[data.index] = data.payload;
                    return callback(200, vets[data.index]);                    
                }
                return callback(404, {message: `index ${data.index} vet not found`})
            }
            callback(400, {message: "index not specified"});
        },
        delete: (data, callback) => {
            if (data.index) {
                if (vets[data.index]) {
                    vets = vets.filter(
                        (_vets, vetIndex) => vetIndex != data.index);
                    return callback(204, {message: `index ${data.index} vet has been deleted`});               
                }
                return callback(404, {message: `index ${data.index} vet not found`})
            }
            callback(400, {message: "index not specified"});
        },
        post: (data, callback) => {
            vets.push(data.payload);
            callback(201, vets);
          },
    };
}