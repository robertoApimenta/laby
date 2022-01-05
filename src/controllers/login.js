const Funcionario = require('../models/Funcionario');
const jwt = require('jsonwebtoken');

module.exports = {
    index(request, response) {
        response.json({
            mensagem: 'Controler do usuário',
        });
    },

    async login(req, res) {
        const { cpf, senha } = req.body;
        if (!cpf || !senha) {
            return res.status(401).json({
                mensagem: 'Todos os campos precisam ser preenchidos.',
            });
        }
        const funcionario = await Funcionario.findOne({
            where: {
                cpf,
                senha,
            },
        });
        if (!funcionario) {
            return res.status(401).json({
                mensagem: 'CPF ou senha inválidos',
            });
        }
        const perfil = funcionario.perfil;
        const id = funcionario.id;
        const token = jwt.sign({ id, cpf, perfil }, 'eb8ea89321237f7b4520', {
            expiresIn: '1d',
        });
        return res.status(200).json({ token });
    },

}