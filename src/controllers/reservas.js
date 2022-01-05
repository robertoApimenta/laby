const Funcionario = require('../models/Funcionario');
const Veiculo = require('../models/Veiculo');
const Venda = require('../models/Venda');
const Reserva = require('../models/Reserva');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { promisify } = require('util');

module.exports = {
    index(req, res) {
        res.json({
            mensagem: 'Controler das reservas',
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
            const { id } = decode;
            const errors = validationResult(req);
            const { data, veiculo, valor } = req.body;
            if (!errors.isEmpty() || !data || !veiculo || !valor) {
                return res.status(400).json({
                    mensagem: 'Dados inválidos, tente novamente.',
                });
            }
            const busca = await Veiculo.findByPk(veiculo);
            if (!busca) {
                return res.status(400).json({
                    mensagem: "Veículo inexistente.",
                });
            }
            if(busca.status === 3){
                return res.status(400).json({
                    mensagem: "Veículo indisponível para reserva.",
                });
            }
            const vendedor = id;
            var dados = { data, veiculo, valor, vendedor };
            const reserva = await Reserva.create(dados);
            const status = 2;
            dados = {status}
            await Veiculo.update(dados, {
                where: { id: veiculo }
            });
            return res.status(200).json({
                mensagem: 'Veículo registrado com sucesso.',
                reserva,
            });
        } catch {
            return res.status(401).json({
                mensagem: 'Token inválido.',
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