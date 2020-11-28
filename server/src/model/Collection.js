module.exports = (sequelize, Sequelize) => {

    const Collection = sequelize.define('Collection', {
        email: {
            type: Sequelize.STRING,
            unique: true
        },
        booking_date: {
            type: Sequelize.STRING
        },
        hotelType: Sequelize.INTEGER,
        hotelDay: Sequelize.INTEGER,
        phone: Sequelize.STRING,
        username: Sequelize.STRING,
        num_of_people: Sequelize.INTEGER,
        num_of_room: Sequelize.INTEGER,
        comment: Sequelize.STRING
    })

    return Collection
}