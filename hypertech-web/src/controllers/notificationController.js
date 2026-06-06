var notificationModel = require("../models/notificationModel.js");

function criacao(req, res) {
    var email = req.body.emailServer;

    // Faça as validações dos valores
    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo notificationModel.js
        notificationModel.criacao(email)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar a criacao da notificação! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function remover(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var userId = req.body.userIdServer;
    var emailId = req.body.emailIdServer;


    // Faça as validações dos valores
    if (userId == undefined) {
        res.status(400).send("Seu userId está undefined!");
    } else if (emailId == undefined) {
        res.status(400).send("Seu emailId está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo notificationModel.js
        notificationModel.remover(userId, emailId)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar a remoção de um Email para notificação! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function criar(req, res) {
    var id = req.body.idServer;
    var email = req.body.emailServer;

    // Faça as validações dos valores
    if (id == undefined) {
        res.status(400).send("Seu id está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo notificationModel.js
        notificationModel.criar(id, email)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar a criação de um novo Email para notificação! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
    criacao,
    remover,
    criar
}