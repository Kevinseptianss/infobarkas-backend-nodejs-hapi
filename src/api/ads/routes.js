const path = require("path");

const routes = (handler) => [
  {
    method: "POST",
    path: "/ads",
    handler: handler.postAdsHandler,
    options: {
      auth: "infobarkas_jwt",
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
        maxBytes: 1048576 * 100,
      },
    },
  },
  {
    method: "PUT",
    path: "/ads",
    handler: handler.putAdsHandler,
    options: {
      auth: "infobarkas_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/ads/{id}",
    handler: handler.deleteAdsHandler,
    options: {
      auth: "infobarkas_jwt",
    },
  },
  {
    method: "GET",
    path: "/images/{param*}",
    handler: {
      directory: {
        path: path.resolve(__dirname, "uploads"),
      },
    },
  },
  {
    method: "GET",
    path: "/ads/{id}",
    handler: handler.getAdsByIdHandler,
  },
  {
    method: "GET",
    path: "/ads",
    handler: handler.getAdsHandler,
  },
  {
    method: "GET",
    path: "/ads/search",
    handler: handler.getAdsSearchHandler,
  },
  {
    method: "GET",
    path: "/myads",
    handler: handler.getMyAdsHandler,
    options: {
      auth: "infobarkas_jwt",
    },
  },
];

module.exports = routes;
