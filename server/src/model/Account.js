module.exports = (sequelize, Sequelize) => {

    const Account = sequelize.define('Account', {
        email: {
            type: Sequelize.STRING,
            unique: true
        },
        captcha: Sequelize.STRING
    })

    return Account
}