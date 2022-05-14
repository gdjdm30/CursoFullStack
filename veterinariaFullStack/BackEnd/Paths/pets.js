module.exports = function petsHandler(pets) {
    return {
        get: (data, callback) => {
            if (data.index) {
                if (pets[data.index]) {
                    return callback(200, pets[data.index]);                    
                }
                return callback(404, {message: `index ${data.index} pet not found`})
            }
            callback(200, pets);
        },
        put: (data, callback) => {
            if (data.index) {
                if (pets[data.index]) {
                    pets[data.index] = data.payload;
                    return callback(200, pets[data.index]);                    
                }
                return callback(404, {message: `index ${data.index} pet not found`})
            }
            callback(400, {message: "index not specified"});
        },
        delete: (data, callback) => {
            if (data.index) {
                if (pets[data.index]) {
                    pets = pets.filter(
                        (_pets, petIndex) => petIndex != data.index);
                    return callback(204, {message: `index ${data.index} pet has been deleted`});               
                }
                return callback(404, {message: `index ${data.index} pet not found`})
            }
            callback(400, {message: "index not specified"});
        },
        post: (data, callback) => {
            pets.push(data.payload);
            callback(201, pets);
          },
    };
}