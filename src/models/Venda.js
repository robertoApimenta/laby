const Sequelize = require('sequelize');
const db = require('./db');

const Venda = db.define('vendas', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    data: {
        type: Sequelize.STRING,
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

Venda.sync();

module.exports = Venda; 