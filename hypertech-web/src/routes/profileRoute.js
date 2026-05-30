var express = require("express");
var router = express.Router();

var profileController = require("../controllers/profileController");

//Recebendo os dados do html e direcionando para a função alterar de profileController.js
router.post("/alterar", function (req, res) {
    profileController.alterar(req, res);
})

// router.post("/autenticar", function (req, res) {
//     profileController.autenticar(req, res);
// });

module.exports = router;