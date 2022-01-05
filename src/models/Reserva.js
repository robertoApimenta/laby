const Sequelize = require('sequelize');
const db = require('./db');

const Reserva = db.define('reservas', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    data: {
        type: Sequelize.DATE,
        allowNull: false
    },
    veiculo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    valor: {
        type: Sequelize.STRING,
        allowNull: false
    },
    vendedor: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
});

Reserva.sync();

module.exports = Reserva; 