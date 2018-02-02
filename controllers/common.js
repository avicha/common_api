const BaseController = require('./base')
const WechatAPI = require('co-wechat-api')

module.exports = class CommonController extends BaseController {
    now(ctx) {
        let result = Date.now()
        ctx.body = super.success_with_result(result)
    }
    async get_js_config(ctx) {
        let debug = ctx.request.query.debug || false
        let jsApiList = ctx.request.query.jsApiList ? ctx.request.query.jsApiList.split(',') : ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
        let url = ctx.request.query.url || ctx.request.headers.referer
        let app_id = ctx.request.query.app_id
        let weixin_config_collection = ctx.common_api_db.collection('weixin_config')
        let weixin_config = await weixin_config_collection.findOne({ app_id: app_id })
        if (weixin_config) {
            let app_secret = weixin_config.app_secret
            let weixin_api = new WechatAPI(app_id, app_secret, () => {
                return {
                    accessToken: weixin_config.access_token,
                    expireTime: weixin_config.expire_time
                }
            }, async(token) => {
                weixin_config_collection.updateOne({ app_id: app_id }, { $set: { access_token: token.accessToken, expire_time: token.expireTime } })
            })
            weixin_api.registerTicketHandle(type => {
                return { ticket: weixin_config[type + '_ticket'], expireTime: weixin_config[type + '_expireTime'] }
            }, async(type, ticket) => {
                let update_obj = {

                }
                update_obj[`${type}_ticket`] = ticket.ticket
                update_obj[`${type}_expireTime`] = ticket.expireTime
                weixin_config_collection.updateOne({ app_id: app_id }, { $set: update_obj })
            })
            let js_config_params = { debug, jsApiList, url }
            let js_config = await weixin_api.getJsConfig(js_config_params)
            ctx.body = super.success_with_result(js_config)
        } else {
            ctx.body = super.error_with_message(404, `没有找到${app_id}的微信信息`)
        }
    }
}