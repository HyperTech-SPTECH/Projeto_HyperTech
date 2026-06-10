var emailModel = require("../models/emailModel");


function enviar(req, res) {
  var email = req.body.emailServer;

 emailModel.enviar(email)
    .then(function (resposta) {
        res.status(200).send(resposta)
    })
    .catch(function (erro) {
      console.log(erro);
      res.status(500).send(erro);
    });
}

module.exports = {
    enviar
}