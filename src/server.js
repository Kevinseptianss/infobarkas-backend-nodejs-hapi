require("dotenv").config();
const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const Inert = require("@hapi/inert");

//users
const users = require("./api/users");
const UsersServices = require("./services/UsersServices");
const UserValidator = require("./validator/users");

//authentications
const authentications = require("./api/authentications");
const AuthenticationsServices = require("./services/AuthenticationsServices");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");

const ads = require("./api/ads");
const AdsService = require("./services/AdsService");
const AdsValidator = require("./validator/ads");

const init = async () => {
  const usersServices = new UsersServices();
  const authenticationsServices = new AuthenticationsServices();
  const adsService = new AdsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy("infobarkas_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: {
        service: usersServices,
        validator: UserValidator,
      },
    },
    {
      plugin: ads,
      options: {
        service: adsService,
        validator: AdsValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsServices,
        usersServices,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();
