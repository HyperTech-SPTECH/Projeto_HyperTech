var express = require("express");
var router = express.Router();

var notificationController = require("../controllers/notificationController");

//Recebendo os dados do html e direcionando para a função criacao de notificationController.js
router.post("/criacao", function (req, res) {
    notificationController.criacao(req, res);
})

router.post("/remover", function (req, res) {
    notificationController.remover(req, res);
});

router.post("/criar", function (req, res) {
    notificationController.criar(req, res);
});

router.post("/alterarCurrentEmail", function (req, res) {
    notificationController.alterarCurrentEmail(req, res);
});

router.post("/alterarN", function (req, res) {
    notificationController.alterarN(req, res);
});

module.exports = router;