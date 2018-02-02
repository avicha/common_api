const Router = require('koa-router')
const commonController = new(require('./common'))()

module.exports = {
    init_app(app) {
        const commonRouter = new Router({
            prefix: '/api/common'
        })
        commonRouter.get('/now', commonController.now)
        commonRouter.get('/get_js_config', commonController.get_js_config)
        app.use(commonRouter.routes())
    }
}