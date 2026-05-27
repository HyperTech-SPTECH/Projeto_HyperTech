var dashboardModel = require("../models/dashboardModel");


function infoFiltrar(req, res) {

    dashboardModel.infoFiltrar(email, senha)
        .then(function (resposta) {
        if (resposta.length > 0) {
            res.status(200).send(resposta);
        } else {
            res.status(404).send("Dados não encontrados!");
        }
        })
        .catch(function (erro) {
        console.log(erro);
        res.status(500).send(erro);
        });
}


// function cadastrar(req, res) {
//     // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
//     var nome = req.body.nomeServer;
//     var email = req.body.emailServer;
//     var cnpj = req.body.cnpjServer;
//     var senha = req.body.senhaServer;

  

//     // Faça as validações dos valores
//     if (nome == undefined) {
//         res.status(400).send("Seu nome está undefined!");
//     } else if (email == undefined) {
//         res.status(400).send("Seu email está undefined!");
//     } else if (cnpj == undefined) {
//         res.status(400).send("Seu cnpj está undefined!");
//     }else if (senha == undefined) {
//         res.status(400).send("Sua senha está undefined!");
//     } else {

//         // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
//         usuarioModel.cadastrar(nome, email, cnpj, senha)
//             .then(
//                 function (resultado) {
//                     res.json(resultado);
//                 }
//             ).catch(
//                 function (erro) {
//                     console.log(erro);
//                     console.log(
//                         "\nHouve um erro ao realizar o cadastro! Erro: ",
//                         erro.sqlMessage
//                     );
//                     res.status(500).json(erro.sqlMessage);
//                 }
//             );
//     }
// }

module.exports = {
    infoFiltrar,
    // cadastrar
}