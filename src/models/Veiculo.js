const Sequelize = require('sequelize');
const db = require('./db');

const Veiculo = db.define('veiculos', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    marca: {
        type: Sequelize.STRING,
        allowNull: false
    },
    modelo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ano: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    km: {
        type: Sequelize.STRING,
        allowNull: true
    },
    cor: {
        type: Sequelize.STRING,
        allowNull: true
    },
    chassi: {
        type: Sequelize.STRING,
        allowNull: false
    },
    valor: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
});

Veiculo.sync();

module.exports = Veiculo; 