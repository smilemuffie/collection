const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const User = require('./User')
const config = require('../config/config')

const sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    config.db.options
    
)

const db = {}

// To import and read all files
// fs
//     .readdirSync(__dirname)
//     .filter((file) =>
//         file !== 'index.js'
//     )
//     .forEach((file) => {
//         // console.log(file)
//         // User.associate
//         // console.log(sequelize)
//         // console.log('---', Sequelize)
//         const model = require(path.join(__dirname, file))(sequelize, DataTypes)
//         console.log(JSON.stringify(model))
//         console.log(model)
//         db[model.name] = model
//     })

db.Sequelize = Sequelize
db.sequelize = sequelize

db.userModel = require('./User')(sequelize, Sequelize)
db.accountModel = require('./Account')(sequelize, Sequelize)
db.collectionModel = require('./Collection')(sequelize, Sequelize)

module.exports = db
