var express = require("express");
var router = express.Router();

var notificationController = require("../controllers/notificationController");

//Recebendo os dados do html e direcionando para a função criacao de notificationController.js
router.post("/criacao", function (req, res) {
    notificationController.criacao(req, res);
})

// router.post("/remover", function (req, res) {
//     profileController.remover(req, res);
// });

module.exports = router;