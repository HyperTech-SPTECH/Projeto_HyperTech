var express = require("express");
var router = express.Router();
 
var rotasController = require("../controllers/rotaController");
 
// GET/rotas/geocode?q=Av+Paulista+1000
router.get("/geocode", rotasController.geocode);
 
// POST/rotas/calcular
router.post("/calcular", rotasController.calcular);
 
module.exports = router;