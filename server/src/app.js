const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const config = require('./config/config')
const db = require('./model')
const router = require('./routes')


const app = express()
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())
app.use(cors())

app.use('/api', router)


// 连接数据库
db.sequelize.sync({
        force: false
    })
    .then(() => {
        console.log('数据库连接成功', config.port)
        app.listen(config.port)
    })


