const db = require('../model')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const ERR = require('../error')
const {
    sequelize
} = require('../model')

function jwtSignUser(user) {
    const ONE_WEEK = 60 * 60 * 24 * 7
    return jwt.sign(user, config.authentication.jwtSecret, {
        expiresIn: ONE_WEEK
    })
}

module.exports = {
    async login(req, res) {
        console.log(req.body.email);
        console.log(req.body.password);
        if (!Object.keys(req).length) {
            return res.status(200).json({
                err_no: ERR.NULL_DATA,
                error: '邮箱，密码不能为空'
            })
        }

        try {
            const {
                email,
                password
            } = req.body
            console.log('====>')
            const user = await db.userModel.findOne({
                where: {
                    email: email
                }
            })

            console.log('===>获取user', user)


            if (!user) {
                return res.status(200).json({
                    err_no: ERR.NULL_DATA,
                    error: '该邮箱不存在'
                })
            }

            const isPasswordInvalid = await user.comparePassword(password)
            console.log(isPasswordInvalid)
            if (isPasswordInvalid) {
                return res.status(200).json({
                    err_no: ERR.INVALID_CREDENTIAL,
                    error: '密码错误'
                })
            }

            const data = user.toJSON()
            return res.status(200).json({
                err_no: ERR.SUCCESS,
                data,
                token: jwtSignUser(data)
            })
        } catch (err) {
            return res.status(500).json({
                err_no: ERR.BAD_REQUEST,
                error: '登录失败，请重新登录'
            })
        }
    },
    async register(req, res) {

        // 判断有没有重复注册
        const {
            email
        } = req.body

        try {

            const findUser = await db.userModel.findOne({
                where: {
                    email: email
                }
            })

            console.log(findUser);
            if (findUser) {
                return res.status(200).send({
                    err_no: ERR.DUPLICATE_DATA,
                    error: '用户已存在'
                })
            }

            const user = await db.userModel.create(req.body)
            const data = user.toJSON()
            return res.status(200).send({
                err_no: ERR.SUCCESS,
                data,
                token: jwtSignUser(data)
            })
        } catch (err) {
            console.log(err)
            return res.status(400).send({
                err_no: ERR.FAILURE,
                error: '注册失败，请重新注册'
            })
        }
    },
    async getUsers(req, res) {
        try {
            const users = await db.userModel.findAll({})
            const userList = users.map(user => user.dataValues)
            const data = userList.map(user => user.email)

            return res.status(200).send({
                err_no: ERR.SUCCESS,
                data
            })
        } catch (err) {
            return res.status(400).send({
                err_no: ERR.FAILURE,
                error: '获取email列表失败'
            })
        }

    }
}