const { version, register } = require("../users");
const AuthenticationsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'authentications',
    version: '1.0.0',
    register: async (server, {
        authenticationsServices,
        usersServices,
        tokenManager,
        validator,
    }) => {
        const authenticationsHandler = new AuthenticationsHandler(
            authenticationsServices,
            usersServices,
            tokenManager,
            validator,
        );
    
        server.route(routes(authenticationsHandler));
    },
};