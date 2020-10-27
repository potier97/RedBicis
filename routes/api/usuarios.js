var express = require("express");
var router = express.Router();
var usuariosController = require("../../controllers/api/usuarioControllerAPI");

router.get("/", usuariosController.usuarios_list);
router.post("/create", usuariosController.usuarios_create);
router.post("/reservar", usuariosController.usuario_reservar);

module.exports = router;
