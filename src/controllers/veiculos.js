const Funcionario = require('../models/Funcionario');
const Veiculo = require('../models/Veiculo');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { promisify } = require('util');

module.exports = {
    index(req, res) {
        res.json({
            mensagem: 'Controler dos veículos',
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
                // status 1 = disponível
                // status 2 = reservado 
                // status 3 = vendido
                const { marca, modelo, ano, km, cor, chassi, valor, status } = req.body;
                if (!marca || !modelo || !ano || !km || !cor || !chassi || !valor || !status) {
                    return res.status(400).json({
                        mensagem: 'Dados inválidos, tente novamente.',
                    });
                }
                const busca = await Veiculo.findOne({ where: { chassi } });
                if (!busca) {
                    const dados = { marca, modelo, ano, km, cor, chassi, valor, status };
                    const veiculo = await Veiculo.create(dados);
                    return res.status(200).json({
                        mensagem: 'Veículo cadastrado com sucesso',
                        veiculo,
                    });
                }
                return res.status(400).json({
                    mensagem: 'Chassi já cadastrado',
                });
            }
            return res.status(401).json({
                mensagem: 'Somente administradores podem cadastrar veículos.',
            });
        } catch {
            return res.status(401).json({
                mensagem: 'Token inválido',
            });
        }
    },

    async read(req, res) {
        const veiculos = await Veiculo.findAll({ order: [['id', 'DESC']] });
        if (!veiculos) {
            return res.status(400).json({
                mensagem: "Nenhum veículo cadastrado.",
            });
        }
        return res.status(200).json({
            veiculos
        });
    },

    async readStatus(req, res) {
        const { status } = req.body;
        // status 1 = disponível
        // status 2 = reservado 
        // status 3 = vendido
        const veiculos = await Veiculo.findAll({
            where: {
                status
            }
        });
        if (!veiculos) {
            return res.status(400).json({
                mensagem: "Nenhum veículo cadastrado.",
            });
        }
        return res.status(200).json({
            veiculos
        });
    },

    async readID(req, res) {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                mensagem: 'Dados inválidos, tente novamente.',
            });
        }
        const veiculo = await Veiculo.findByPk(id);
        if (!veiculo) {
            return res.status(400).json({
                mensagem: "Veículo inexistente.",
            });
        }
        return res.status(200).json({
            veiculo,
        });
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
                await Veiculo.destroy({
                    where: { id }
                })
                return res.json({
                    mensagem: "Veículo deletado com sucesso!"
                })
            }
            return res.status(401).json({
                mensagem: 'Somente administradores podem deletar veículos.',
            });
        } catch {
            return res.status(401).json({
                mensagem: 'Token inválido',
            });
        }
    },

}