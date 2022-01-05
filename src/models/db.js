const Sequelize = require('sequelize');

const conexao = new Sequelize('laby', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

conexao.authenticate().then(() => {
    console.log('Conexão com o banco estabelecida');
}).catch((erro) => {
    console.log('Erro ao se conectar ao banco', erro);
});

module.exports = conexao;