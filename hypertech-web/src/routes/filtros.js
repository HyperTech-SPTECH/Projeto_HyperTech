var express = require("express");
var router = express.Router();

var filtrosController = require("../controllers/filtrosController");

router.get("/listarOpcoes", function (req, res) {
    filtrosController.buscarOpcoesFiltro(req, res);
})

router.get("/usuario/:idUsuario", function (req, res) {
    filtrosController.listarFiltros(req, res);
})

router.post("/cadastrar", function(req, res) {
    filtrosController.cadastrarFiltro(req, res);
})

router.put("/atualizar/:idFiltro", function(req, res) {
    filtrosController.atualizarFiltro(req, res);
})

router.delete("/excluirFiltro/:idUsuario/:idFiltro", function (req, res) {
    filtrosController.excluirFiltro(req, res);
})

module.exports = router;