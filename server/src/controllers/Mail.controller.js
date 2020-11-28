const nodemailer = require("nodemailer");
const config = require('../config/config')
const { generateCode, randomWord } = require('../utils');
const db = require('../model')
const ERR = require('../error')


// async..await is not allowed in global scope, must use a wrapper
async function MAIL(code, toEmail) {
    const userInfo = {
        host: 'smtp.outlook.com',
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, //
        tls: {
            ciphers: 'SSLv3'
        },
        auth: {
            user: config.email.account,
            pass: config.email.password
        }
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({...userInfo});
    // let htmlData
    // switch(type) {
    //     case config.email.templateTypes.register:
    //         return htmlData = `欢迎${email}用户来到xxxx会议`
    //     case config.email.templateTypes.reset:
    //         return htmlData = `<p>修改密码操作，验证码：<b style="color: red">${code}</b></p>`
    // }


    const options = {
        from: config.email.account, // sender address
        to: toEmail, // list of receivers
        subject: `修改密码`, // Subject line
        text: "Hello world?", // plain text body
        html: `<p>修改密码操作，验证码：<b style="color: red">${code}</b></p>`, // html body
    }

    console.log('html', options.html)
    // send mail with defined transport object
    let info = await transporter.sendMail(options);

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


// 修改密码
// 1. 获取验证码
// 2. 将此验证码跟user绑定，存入数据库

// 3. 验证前端提交的验证码是不是跟当前user和验证码匹配
// 4. 如果匹配，则修改成功

module.exports = {
    async resetPwd(req, res) {
        try {
            const { email, captcha, password } = req.body

            if (!email || !captcha || !password) {
                return res.status(200).json({
                    err_no: ERR.NULL_DATA,
                    error: '请填写email，验证码，密码后提交'
                })
            }
            //1. 查找这个邮箱是不是存在
            const user = await db.userModel.findOne({
                where: {
                    email
                }
            })

            // 邮箱不存在，抛出错误
            if (!user) {
                return res.status(200).json({
                    err_no: ERR.NULL_DATA,
                    error: '该邮箱不存在'
                })
            }

            // 验证码，邮箱对应
            const account = await db.accountModel.findOne({
                where: {
                    email,
                    captcha
                }
            })

            // 验证失败， 抛出错误
            if (!account) {
                return res.status(200).json({
                    err_no: ERR.NULL_DATA,
                    error: '验证有误，请重新尝试'
                })
            }

            // 验证成功，更新密码

            const updatePassword = await db.userModel.update({password: password}, {
                where: {
                    email
                }
            })

            console.log('更新密码',updatePassword)
            const info = await db.userModel.findOne({
                where: {
                    email
                }
            })

            console.log(info)

            return res.status(200).json({
                err_no: ERR.SUCCESS,
                error: '密码更新成功'
            })
            

        } catch (err) {
            return res.status(200).json({
                err_no: ERR.FAILURE,
                error: '验证有误，请重新尝试'
            })
        }
    },
    async getCaptcha(req, res) {
        console.log(req.body.email)
        try {
            const { email } = req.body
            //1. 查找这个邮箱是不是存在
            const user = await db.userModel.findOne({
                where: {
                    email
                }
            })


            // 邮箱不存在，抛出错误
            if (!user) {
                return res.status(200).json({
                    err_no: ERR.NULL_DATA,
                    error: '该邮箱不存在'
                })
            }

            // 邮箱存在，生成验证码，和user email 绑定存入数据库，并且发送出去
            const captcha = generateCode(6);

            // 判断该email是否在accountModel中存在，如果存在就更新，不存在就创建
            const findEmailInAccountModel = await db.accountModel.findOne({
                where: {
                    email
                }
            })

            console.log(findEmailInAccountModel)

            if (findEmailInAccountModel) {
                await db.accountModel.update({
                            captcha
                        }, {
                    where: {
                        email
                    }
                })
            } else {
                await db.accountModel.create({email, captcha})
            }
            
            await MAIL(captcha, email).catch(console.err)

            return res.status(200).json({
                err_no: ERR.SUCCESS,
                captcha: captcha,
                error: '成功获取验证码，请前往邮箱'
            })
            
        } catch (err) {
            return res.status(200).json({
                err_no: ERR.FAILURE,
                error: '获取验证码失败，请重试'
            })
        }
    },
    async checkEmailExist(req, res) {
        try {

            const { email } = req.body

            const user = await db.userModel.findOne({
                where: {
                    email
                }
            })

            if (!user) {
                return res.status(200).json({
                    err_no: ERR.NULL_DATA,
                    is_email_exist: false,
                    error: '该邮箱不存在'
                })
            }

            return res.status(200).json({
                err_no: ERR.SUCCESS,
                is_email_exist: true,
                error: '该邮箱已经存在'
            })

        } catch (err) {
             return res.status(200).json({
                 err_no: ERR.FAILURE,
                 error: '邮箱查询出错！'
             })
        }
    }
}
