var express = require("express");
var router = express.Router();

var emailController = require("../controllers/emailController");

//Recebendo os dados do html e direcionando para a função enviar de emailController.js
router.post("/enviar", function (req, res) {
    emailController.enviar(req, res);
})

module.exports = router;