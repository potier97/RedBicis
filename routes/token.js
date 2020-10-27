var express = require("express");
var router = express.Router();
const tokenController = require("../controllers/token");

router.get("/confirmation/:token", tokenController.confirmationGet);

module.exports = router;
