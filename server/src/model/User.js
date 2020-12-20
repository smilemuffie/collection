const sequelize  = require('sequelize')
const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

function hashPassword(user, options) {
    const SALT_FACTOR = 8

    if (!user.changed('password')) {
        return
    }

    return bcrypt
        .genSaltAsync(SALT_FACTOR)
        .then(salt => bcrypt.hashAsync(user.password, salt, null))
        .then(hash => {
            user.setDataValue('password', hash)
        })
}

module.exports = (sequelize, Sequelize) => {

    const User = sequelize.define('User', {
        email: {
            type: Sequelize.STRING,
            unique: true
        },
        password: Sequelize.STRING,
        // isAdmin: {
        //     type: Sequelize.BOOLEAN,
        //     defaultValue: false
        // }
    }
    // , {
    //     hooks: {
    //         beforeCreate: hashPassword,
    //         beforeUpdate: hashPassword,
    //         beforeSave: hashPassword
    //     }
    // }
    )

    // User.prototype.comparePassword = function (password) {
    //     return bcrypt.compareAsync(password, this.password)
    // }

    User.prototype.comparePassword = function (password) {
        console.log(typeof password, typeof this.password)
        console.log(password === this.password)
        return password !== this.password
    }

    return User
}
