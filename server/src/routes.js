var express = require('express')
var router = express.Router()

const AuthenticationControllerPolicy = require('./policies/Auth.policy')
const AuthenticationController = require('./controllers/Auth.controller')
const AuthController = require('./controllers/Auth.controller')
const MailController = require('./controllers/Mail.controller')
const CollectController = require('./controllers/Collection.controller')

router.route(`/auth/register`)
    // 注册
    .post(AuthenticationControllerPolicy.register, AuthenticationController.register)

router.route(`/auth/login`)
    // 登录
    .post(AuthController.login)

router.route(`/auth/admin`)
    // 设置admin
    .post(AuthController.setAdmin)
    // 获取角色信息
    .get(AuthController.getUserByEmail)

router.route(`/allUsers`)
    // 获取用户列表
    .get(AuthController.getUsers)

router.route(`/resetPwd`)
    // 重置密码
    .post(MailController.resetPwd)

router.route(`/checkEmail`)
    // 判断邮箱是否存在
    .post(MailController.checkEmailExist)

router.route('/getCaptcha')
    // 邮箱获取验证码
    .post(MailController.getCaptcha)

router.route('/bookingInfo')
    // 提交预订酒店信息
    .post(CollectController.postBookingInfo)
    // 获取当前用户的酒店预订信息
    .get(CollectController.getBookingInfoById)

router.route('/bookingInfoList')
    // 获取所有用户的酒店预订信息
    .get(CollectController.getBookingInfoList)

module.exports = router
