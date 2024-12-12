const AdsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'ads',
    version: '1.0.0',
    register: async (server, { service, validator }) => {
        const adsHandler = new AdsHandler(service, validator);
        server.route(routes(adsHandler));
    },
};