const requestHandler = require("./request-handler");
const resources = require('./resources');
const http = require("http");
const server = http.createServer(requestHandler);

global.resources = resources;

server.listen(5000, () => {
    console.log('Server Listening...')
});