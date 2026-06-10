var express = require("express");
var router = express.Router();
 
var rotasController = require("../controllers/rotaController");
 
// GET/rotas/geocode?q=Av+Paulista+1000
router.get("/geocode", rotasController.geocode);
 
// POST/rotas/calcular
router.post("/calcular", rotasController.calcular);

// GET /rotas/favoritos?idUsuario=1
router.get("/favoritos", rotasController.buscarFavoritos);

// POST /rotas/favoritos
router.post("/favoritos", rotasController.salvarFavorito);

// PUT /rotas/favoritos/:id
router.put("/favoritos/:id", rotasController.editarFavorito);

// DELETE /rotas/favoritos/:id?idUsuario=1
router.delete("/favoritos/:id", rotasController.deletarFavorito);
 
module.exports = router;