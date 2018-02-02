module.exports = {
    app_url: 'http://127.0.0.1/',
    server: {
        host: '127.0.0.1',
        port: 80,
        secret_key: 'secret_key'
    },
    mongodb: {
        auth: {
            user: 'user',
            pwd: 'pwd'
        },
        connection_url: '127.0.0.1:27017',
        options: {
            appname: 'appname',
            poolSize: 4,
            autoReconnect: true
        }
    }
}