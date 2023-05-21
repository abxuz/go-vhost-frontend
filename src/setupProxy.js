const proxy = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        proxy.createProxyMiddleware('/api/', {
            target: 'http://nsh.vhost.doubi.fun:8000',
            changeOrigin: true
        })
    )
}