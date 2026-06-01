var notificationModel = require("../models/notificationModel.js");

function criacao(req, res) {
    var email = req.body.emailServer;

    console.log('aaaaaaaaaaaaaaaa')
    console.log(email)
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

// function remover(req, res) {
//     // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
//     var id = req.body.idServer;

//     // Faça as validações dos valores
//     if (id == undefined) {
//         res.status(400).send("Seu id está undefined!");
//     } else {

//         // Passe os valores como parâmetro e vá para o arquivo profileModel.js
//         profileModel.remover(id)
//             .then(
//                 function (resultado) {
//                     res.json(resultado);
//                 }
//             ).catch(
//                 function (erro) {
//                     console.log(erro);
//                     console.log(
//                         "\nHouve um erro ao realizar a remoção! Erro: ",
//                         erro.sqlMessage
//                     );
//                     res.status(500).json(erro.sqlMessage);
//                 }
//             );
//     }
// }

module.exports = {
    criacao
}