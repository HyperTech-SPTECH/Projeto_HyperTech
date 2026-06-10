var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/infoFiltrar", function (req, res) {
    dashboardController.infoFiltrar(req, res);
})

router.post("/cargasMaisRoubadas", function (req, res) {
    dashboardController.cargasMaisRoubadas(req, res);
})

router.post("/periculosidadeDiaHorario", function (req, res) {
    dashboardController.periculosidadeDiaHorario(req, res);
})

// router.post("/autenticar", function (req, res) {
//     dashboardController.autenticar(req, res);
// });

module.exports = router;