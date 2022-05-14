module.exports = function ownersHandler(owners) {
    return {
        get: (data, callback) => {
            if (data.index) {
                if (owners[data.index]) {
                    return callback(200, owners[data.index]);                    
                }
                return callback(404, {message: `index ${data.index} owner not found`})
            }
            callback(200, owners);
        },
        put: (data, callback) => {
            if (data.index) {
                if (owners[data.index]) {
                    owners[data.index] = data.payload;
                    return callback(200, owners[data.index]);                    
                }
                return callback(404, {message: `index ${data.index} owner not found`})
            }
            callback(400, {message: "index not specified"});
        },
        delete: (data, callback) => {
            if (data.index) {
                if (owners[data.index]) {
                    owners = owners.filter(
                        (_owners, ownersIndex) => ownersIndex != data.index);
                    return callback(204, {message: `index ${data.index} owner has been deleted`});               
                }
                return callback(404, {message: `index ${data.index} owner not found`})
            }
            callback(400, {message: "index not specified"});
        },
        post: (data, callback) => {
            owners.push(data.payload);
            callback(201, owners);
          },
    };
}