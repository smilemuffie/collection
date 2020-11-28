const Joi = require('joi')
const ERR = require('../error')


module.exports = {
  register (req, res, next) {
      
    const {email, password} = req.body
    console.log(req.body)
    // if (!email || !password) {
    //     return res.status(400).json({
    //         error: '邮箱密码不能为空'
    //     })
    // }

    const schema = Joi.object({
      email: Joi.string().email(),
      password: Joi.string().regex(
        new RegExp('^[a-zA-Z0-9]{8,32}$')
      )
    })

    const {error} = schema.validate(req.body)

    if (error) {
      switch (error.details[0].context.key) {
        case 'email':
          res.status(200).json({
            err_no: ERR.FAILURE,
            error: '邮箱格式错误'
          })
          break
        case 'password':
          res.status(200).json({
            err_no: ERR.FAILURE,
            error: '密码至少为8位'
          })
          break
        default:
          res.status(200).json({
            err_no: ERR.FAILURE,
            error: '注册失败'
          })
      }

      return
    }
    next()
  }
}
