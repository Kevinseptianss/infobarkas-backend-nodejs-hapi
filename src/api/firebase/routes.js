const routes = (handler) => [
    {
        method: 'POST',
        path: '/auth/google',
        handler: handler.postAuthHandler,
    },
];

module.exports = routes;