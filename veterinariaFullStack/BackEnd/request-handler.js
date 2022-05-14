const router = require("./router")
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

//callback del servidor
module.exports = (req, res) => {
    //1. obtener url desde objeto request
    const urlAux = req.url;
    const parcedURL = url.parse(urlAux, true);
    //2. obtener la ruta
    const path = parcedURL.pathname;
    //3. Quitar simbolo slash de la ruta
    const cleanPath = path.replace(/^\/+|\/+$/g,'');
    // //3.1 Obtener metodo http
    const getMethod = req.method.toLowerCase();
    // //3.1.1 permisos de CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Request-Methods", "OPTIONS,GET,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS,GET,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "*");
    // //3.1.2 respuesta inmediata a metodo options
    if (getMethod === 'options') {
        res.writeHead(200);
        res.end();
        return;
    }
    // //3.2 Obtener variables del query URL
    const {query = {}} = parcedURL;
    // //3.3 Obtener headers
    const {headers ={}} = req;
    // //3.4 Obtener payloads en caso de tenerlos
    const decoder = new StringDecoder("utf-8");
    let buffer = '';    
    // //3.4.1 Acumulando data cuando el request reciba un payload
    req.on("data", (data) => {
        buffer += decoder.write(data);
    });
    // //3.4.2 Dejar de acumular data y finalizar decoder
    req.on("end", () => {
        buffer += decoder.end();

        if (headers["content-type"] === "application/json") {
            buffer = JSON.parse(buffer);
        }

    //3.4.3 revisar si tiene subrutas
    if (cleanPath.indexOf("/") > -1)  {
        var [mainPath, index] = cleanPath.split('/');
    }

    //     //3.5 Ordenar la data
        const data = {
            index,
            path: mainPath || cleanPath,
            query,
            getMethod,
            headers,
            payload: buffer,
        };
        //3.6 elegir manejador
        let handler;
        if (data.path && router[data.path] && router[data.path][getMethod]) {
            handler = router[data.path][getMethod];
        }else{
            handler = router.noResponse;
        }
    //     //4 ejecutar el handler
        if (typeof handler === 'function') {
            handler(data, (statusCode = 200, message) => {
                const response = JSON.stringify(message);
                res.setHeader("Content-Type", "application/json")
                res.writeHead(statusCode);
                //linea donde se responde
                res.end(response);
            })
        }
    });
};