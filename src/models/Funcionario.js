const Sequelize = require('sequelize');
const db = require('./db');

const Funcionario = db.define('funcionarios', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: false
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    avatar: {
        type: Sequelize.STRING,
        allowNull: true
    },
    biografia: {
        type: Sequelize.STRING,
        allowNull: true
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    perfil: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
});

Funcionario.sync();

module.exports = Funcionario; 