var filtrosModel = require("../models/filtrosModel");

function listarFiltros(req, res) {
    var idUsuario = req.params.idUsuario;

    if(idUsuario == undefined) {
        res.status(400).send("ID undefined");
    } else {
        filtrosModel.listarFiltros (idUsuario)
            .then(function (resultado) {
                if(resultado.length > 0){
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum resultado encotrado");
                }
            }).catch(function (erro) {
                console.log(erro)
                res.status(500).json(erro.sqlMessage);
            })
    }
}

function cadastrarFiltro(req, res) {
    var idUsuario = req.body.idUsuario;
    var nomeFiltro = req.body.nomeFiltro;
    var cidade = req.body.cidade;
    var bairro = req.body.bairro;
    var mes = req.body.mes;

    if (idUsuario == undefined) {
        res.status(400).send("O ID do usuário está undefined!");
    } else if (nomeFiltro == undefined) {
        res.status(400).send("O nome do filtro está undefined!");
    } else if (cidade == undefined) {
        res.status(400).send("A cidade está undefined!");
    } else if (bairro == undefined) {
        res.status(400).send("O bairro está undefined!");
    } else if (mes == undefined) {
        res.status(400).send("O mês está undefined!");
    } else {
        filtrosModel.cadastrarFiltro(idUsuario, nomeFiltro, cidade, bairro, mes)
            .then(function (resultado) {
                res.status(201).json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function atualizarFiltro(req, res) {
    var idFiltro = req.params.idFiltro;
    var idUsuario = req.body.idUsuario;
    var nomeFiltro = req.body.nomeFiltro;
    var cidade = req.body.cidade;
    var bairro = req.body.bairro;
    var mes = req.body.mes;

    if (idFiltro == undefined) {
        res.status(400).send("O ID do filtro está undefined!");
    } else if (idUsuario == undefined) {
        res.status(400).send("O ID do usuário está undefined!");
    } else if (nomeFiltro == undefined) {
        res.status(400).send("O nome do filtro atualizado está undefined!");
    } else {
        filtrosModel.atualizarFiltro(idFiltro, idUsuario, nomeFiltro, cidade, bairro, mes)
            .then(function (resultado) {
                res.status(200).json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function excluirFiltro(req, res) {
    var idFiltro = req.params.idFiltro;
    var idUsuario = req.params.idUsuario;

    if (idFiltro == undefined) {
        res.status(400).send("O ID do filtro está de undefined!");
    } else if (idUsuario == undefined) {
        res.status(400).send("O ID do usuário está undefined!");
    } else {
        filtrosModel.excluirFiltro(idUsuario, idFiltro)
            .then(function (resultado) {
                res.status(200).json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function buscarOpcoesFiltro(req, res) {
    filtrosModel.buscarOpcoesFiltro()
        .then(function (resultado) {
            if (resultado.length > 0) {
                var mapaLogistica = {};

                resultado.forEach(function (linha) {
                    var cidade = linha.cidade.trim();
                    var bairro = linha.bairro.trim();

                    if (!mapaLogistica[cidade]) {
                        mapaLogistica[cidade] = [];
                    }
                    if (!mapaLogistica[cidade].includes(bairro)) {
                        mapaLogistica[cidade].push(bairro);
                    }
                });

                res.status(200).json(mapaLogistica);
            } else {
                res.status(204).send("Nenhuma opção de cidade/bairro encontrada no Postgres.");
            }
        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.message);
        });
}

module.exports = {
    listarFiltros,
    cadastrarFiltro,
    atualizarFiltro,
    excluirFiltro,
    buscarOpcoesFiltro
};