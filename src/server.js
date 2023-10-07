const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = new Hapi.Server({
        port: 9000,
        host: 'localhost',
    });

    server.route(routes);

    await server.start();
    console.log(`Server is working on ${server.info.uri}`);
};

init();
