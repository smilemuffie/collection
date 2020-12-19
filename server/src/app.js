const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const config = require('./config/config')
const db = require('./model')
const router = require('./routes')
const path = require('path')


const app = express()
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}))


app.use('/api', router)


// 连接数据库
db.sequelize.sync({
        force: false
    })
    .then(() => {
        console.log('数据库连接成功', config.port)
        app.listen(config.port)
    })


