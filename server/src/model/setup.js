function applyExtraSetup(sequelize) {

    console.log(sequelize.models)
    const {
        instrument,
        orchestra
    } = sequelize.models;

    orchestra.hasMany(instrument);
    instrument.belongsTo(orchestra);
}

module.exports = {
    applyExtraSetup
};