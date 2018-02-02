const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const controllers = require('./controllers')
const exceptions = require('./exceptions')
const mongodb = require('./databases/mongodb')
const app = new Koa()
const config = require('./config')

app.keys = [config.server.secret_key]
app.use(bodyParser())
app.use(logger())
exceptions.init_app(app)
mongodb.getConnection(config.mongodb).then(conn => {
    app.context.common_api_db = conn.db('common_api')
}).catch(err => {
    app.emit('error', err)
})

controllers.init_app(app)

module.exports = app
if (!module.parent) {
    app.listen(config.server.port)
}