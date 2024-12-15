const FirebaseHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'firebase',
    version: '1.0.0',
    register: async (server, { service, validator, tokenManager, userService }) => {
        const firebaseHandler = new FirebaseHandler(service, validator, tokenManager, userService);
        server.route(routes(firebaseHandler));
    },
};