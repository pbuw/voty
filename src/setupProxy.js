const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://ws-old.parlament.ch',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '', // Entfernt "/api" von der URL
            },
        })
    );
};
