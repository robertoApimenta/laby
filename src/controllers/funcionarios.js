const Funcionario = require('../models/Funcionario');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { promisify } = require('util');

module.exports = {
    index(req, res) {
        res.json({
            mensagem: 'Controler dos funcionários',
        });
    },

    async create(req, res) {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(400).json({
                mensagem: 'Necessário estar logado',
            });
        }
        try {
            const decode = await promisify(jwt.verify)(token, 'eb8ea89321237f7b4520');
            const { perfil } = decode;
            if (perfil === 1) {
                const errors = validationResult(req);
                const { cpf, nome, email, senha, perfil } = req.body;
                if (!errors.isEmpty() || !cpf || !nome || !email || !senha || !perfil) {
                    return res.status(400).json({
                        mensagem: 'Dados inválidos, tente novamente.',
                        senha
                    });
                }
                const busca = await Funcionario.findOne({ where: { cpf } });
                if (!busca) {
                    const dados = { cpf, nome, email, senha, perfil };
                    const funcionario = await Funcionario.create(dados);
                    return res.status(200).json({
                        mensagem: 'Funcionário cadastrado com sucesso',
                        funcionario,
                    });
                }
                return res.status(400).json({
                    mensagem: 'CPF já cadastrado',
                });
            }
            return res.status(401).json({
                mensagem: 'Somente administradores podem cadastrar funcionários.',
            });
        } catch {
            return res.status(401).json({
                mensagem: 'Token inválido',
            });
        }
    },

    async read(req, res) {
        const funcionarios = await Funcionario.findAll({ order: [['id', 'DESC']] });
        if (!funcionarios) {
            return res.status(400).json({
                mensagem: "Nenhum funcionário cadastrado",
            });
        }
        return res.status(200).json({
            funcionarios
        });
    },

    async readID(req, res) {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                mensagem: 'Dados inválidos, tente novamente.',
            });
        }
        const funcionario = await Funcionario.findByPk(id);
        if (!funcionario) {
            return res.status(400).json({
                mensagem: "Funcionário inexistente",
            });
        }
        return res.status(200).json({
            funcionario,
        });
    },

    async update(req, res) {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(400).json({
                mensagem: 'Necessário estar logado',
            });
        }
        try {
            const decode = await promisify(jwt.verify)(token, 'eb8ea89321237f7b4520');
            const { perfil } = decode;
            if (perfil === 1) {
                const errors = validationResult(req);
                const { cpf, nome, email, senha, perfil } = req.body;
                if (!errors.isEmpty() || !cpf || !nome || !email || !senha || !perfil) {
                    return res.status(400).json({
                        mensagem: 'Dados inválidos, tente novamente.',
                    });
                }
                const id = req.params.id;
                var busca = await Funcionario.findOne({ where: { id } });
                if (!busca) {
                    return res.status(400).json({
                        mensagem: 'Funcionário inexistente.',
                    });
                }
                busca = await Funcionario.findOne({ where: { cpf } });
                if (!busca) {
                    const upFuncionario = await Funcionario.update(req.body, {
                        where: { id }
                    })
                    return res.status(200).json({
                        mensagem: 'Funcionário editado com sucesso',
                    });
                }
                return res.status(400).json({
                    mensagem: 'CPF já cadastrado.',
                });
            }
            return res.status(401).json({
                mensagem: 'Somente administradores podem editar funcionários.',
            });
        } catch {
            return res.status(401).json({
                mensagem: 'Token inválido',
            });
        }
    },

    async delete(req, res) {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(400).json({
                mensagem: 'Necessário estar logado',
            });
        }
        try {
            const decode = await promisify(jwt.verify)(token, 'eb8ea89321237f7b4520');
            const { perfil } = decode;
            if (perfil === 1) {
                const id = req.params.id;
                await Funcionario.destroy({
                    where: { id }
                })
                return res.json({
                    mensagem: "Funcionario deletado com sucesso!"
                })
            }
            return res.status(401).json({
                mensagem: 'Somente administradores podem deletar funcionários.',
            });
        } catch {
            return res.status(401).json({
                mensagem: 'Token inválido',
            });
        }
    },

}