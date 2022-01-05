const express = require('express');
const routes = express.Router();
const { body } = require('express-validator');

//controllers
const funcionarios = require('../controllers/funcionarios');
const login = require('../controllers/login');
const veiculos = require('../controllers/veiculos');
const vendas = require('../controllers/vendas');
const reservas = require('../controllers/reservas');

//rotas públicas FUNCIONARIO 
routes.get('/funcionarios', funcionarios.index);
routes.get('/listar_funcionarios', funcionarios.read);
routes.get('/listar_funcionario/:id', funcionarios.readID);

//rotas privadas FUNCIONARIO 
routes.post('/novo_funcionario', [body('email').isEmail()], body('senha').isLength({ min: 6 }), funcionarios.create);
routes.put('/editar_funcionario/:id', [body('email').isEmail()],body('senha').isLength({ min: 6 }), funcionarios.update);
routes.delete('/deletar_funcionario/:id', funcionarios.delete);

//rota para login
routes.get('/login', login.index);
routes.post('/login', login.login);

//rotas públicas VEÍCULOS 
routes.get('/veiculos', veiculos.index);
routes.get('/listar_veiculos', veiculos.read);
routes.get('/listar_veiculo/:id', veiculos.readID);
// listar Veículos pelo status (vendido ou disponivel)
routes.post('/listar_veiculos_status', veiculos.readStatus);

//rotas privadas VEÍCULOS 
routes.post('/novo_veiculo', veiculos.create);
routes.delete('/deletar_veiculo/:id', veiculos.delete);

//rotas privadas VENDAS
routes.post('/nova_venda', vendas.create);

//rotas privadas RESERVAS
routes.post('/nova_reserva', reservas.create);


module.exports = routes;