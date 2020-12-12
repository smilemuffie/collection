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
            return res.status(200).json({
                err_no: ERR.BAD_REQUEST,
                error: '登录失败，请重新登录'
            })
        }
    },
    async register(req, res) {

        // 判断有没有重复注册
        const {
            email,
            password
        } = req.body

        if (!email || !password) {
            return res.status(200).json({
                err_no: ERR.BAD_REQUEST,
                error: '注册信息缺失'
            })
        }

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

            const newUser = {
                email,
                password,
                isAdmin: false
            }

            const user = await db.userModel.create(newUser)
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
            // const data = userList.map(user => user.email)

            // 获取user的预订信息
            const collections = await db.collectionModel.findAll({});
            const collectionList = collections.map(collection => collection.dataValues);
            
            userList.map(user => {
                const arr = collectionList.filter(collection => user.email === collection.email);
                user.booked = !!arr.length;
                
            })

            const data = userList.map(user => ({
               email: user.email,
               booked: user.booked
            }))

            return res.status(200).send({
                err_no: ERR.SUCCESS,
                error: '获取用户列表成功',
                data
            })
        } catch (err) {
            return res.status(200).send({
                err_no: ERR.FAILURE,
                error: '获取email列表失败'
            })
        }

    },

    async setAdmin(req, res) {
        const {email, setcode} = req.body;

        if (setcode !== 'meeting') {
            return res.status(200).send({
                err_no: ERR.FAILURE,
                error: 'setcode错误！无法设置'
            })
        }

        if (!email) {
            return res.status(200).send({
                err_no: ERR.FAILURE,
                error: '请提供需要设置的email'
            })
        }
        try {

            const findUser = await db.userModel.findOne({
                where: {
                    email: email
                }
            })

            console.log(findUser);
            if (findUser) {
                await db.userModel.update({isAdmin: true}, {
                    where: {
                        email
                    }
                })

                return res.status(200).send({
                    err_no: ERR.SUCCESS,
                    error: 'admin设置成功'
                })
            }

        } catch (err) {
            return res.status(200).send({
                err_no: ERR.FAILURE,
                error: 'admin设置失败，请重新尝试'
            })
        }
    },

    async getUserByEmail(req, res) {
        const {email} = req.query;

        if (!email) {
            return res.status(200).send({
                err_no: ERR.FAILURE,
                error: '请提供email'
            })
        }

        try {

            const findUser = await db.userModel.findOne({
                where: {
                    email: email
                }
            })

            console.log(findUser);
            if (!findUser)  {
                 return res.status(200).send({
                     err_no: ERR.FAILURE,
                     error: '该用户不存在'
                 })
            }

            return res.status(200).send({
                err_no: ERR.SUCCESS,
                error: '获取到该用户信息',
                data: findUser
            })


        } catch (err) {
            return res.status(200).send({
                err_no: ERR.FAILURE,
                error: '获取角色信息失败'
            })
        }

    }
}