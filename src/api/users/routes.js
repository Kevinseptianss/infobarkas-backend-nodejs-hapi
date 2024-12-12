const path = require("path");
const routes = (handler) => [
  {
    method: "POST",
    path: "/register",
    handler: handler.postRegisterUserHandler,
  },
  {
    method: "GET",
    path: "/users/me",
    handler: handler.getUserInfoHandler,
    options: {
      auth: "infobarkas_jwt",
    },
  },
  {
    method: "PUT",
    path: "/users/me",
    handler: handler.putUserInfoHandler,
    options: {
      auth: "infobarkas_jwt",
    },
  },
  {
    method: "POST",
    path: "/users/me",
    handler: handler.postProfilePictureHandler,
    options: {
      auth: "infobarkas_jwt",
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
        maxBytes: 1048576 * 5,
      },
    },
  },
  {
    method: "GET",
    path: "/profile/{param*}",
    handler: {
      directory: {
        path: path.resolve(__dirname, "uploads"),
      },
    },
  },
];

module.exports = routes;
