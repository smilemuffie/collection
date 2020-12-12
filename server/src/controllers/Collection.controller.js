const db = require('../model')
const config = require('../config/config')
const ERR = require('../error')

module.exports = {
    // 提交酒店预订信息
    async postBookingInfo(req, res) {
        const {
            email,
            booking_date,
            hotelType,
            phone,
            username,
            num_of_people,
            hotelDay,
            num_of_room,
            comment,
            id
        } = req.body

        try {
            // 查找该邮箱是否存在
            const user = await db.userModel.findOne({
                where: {
                    email
                }
            })

            // 邮箱不存在，抛出错误
            if (!user) {
                return res.status(200).json({
                    err_no: ERR.NULL_DATA,
                    error: '该邮箱未注册过'
                })
            }

            // 邮箱存在，判断是创建还是编辑，带id为编辑，不带为创建
            const obj = {
                email,
                booking_date,
                hotelType,
                hotelDay,
                phone,
                username,
                num_of_people,
                num_of_room,
                comment,
            }

            let collection
            let error
            // 先找该email是否已经预订过了
            const isExist = await db.collectionModel.findOne({
                where: {
                    email
                }
            })

            if (isExist) {
                console.log('edit 编辑')
                collection = await db.collectionModel.update(obj,{
                    where: {
                        email
                    }
                })
                error = '编辑预订信息成功'
                
            } else {
                console.log('create')
                collection = await db.collectionModel.create(obj)
                error = '创建预订信息成功'
            }

            return res.status(200).json({
                err_no: ERR.SUCCESS,
                error: error,
                data: collection.dataValues
            })
            
            

        } catch (err) {
            return res.status(200).json({
                err_no: ERR.FAILUTE,
                error: '创建预订信息失败，请重新创建',
                message: err
            })
        }
    },
    // 获取全部酒店预订信息列表
    async getBookingInfoList(req, res) {
        try {
            const collections = await db.collectionModel.findAll()
            const collectionList = collections.map(collection => collection.dataValues)

            return res.status(200).json({
                err_no: ERR.SUCCESS,
                error: '获取全部酒店信息列表',
                data: collectionList
            })

        } catch (err) {
            return res.status(200).json({
                err_no: ERR.FAILUTE,
                error: '获取全部酒店信息列表失败，请重新尝试'
            })
        }
    },
    // 根据用户id获取该用户的预订信息
    async getBookingInfoById(req, res) {
        const {email} = req.query;
        try {
            const collection = await db.collectionModel.findOne({
                where: {
                    email
                }
            })

            if (!collection) {
                return res.status(200).json({
                    err_no: ERR.NULL_DATA,
                    error: '未查询到该用户的预订信息'
                })
            }

            const data = collection.dataValues

            return res.status(200).json({
                err_no: ERR.SUCCESS,
                error: '成功获取该用户预订信息',
                data
            })


        } catch(err) {
            return res.status(200).json({
                err_no: ERR.FAILUTE,
                error: '获取当前用户酒店预订信息失败，请重新尝试'
            })
        }
    }
}