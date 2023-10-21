const router = require("express").Router();

const userController = require("../controllers/auth");
const { registerValidation, loginValidation } = require("../validations/auth");

router.post("/register", registerValidation, userController.register);

router.post("/login", loginValidation, userController.login);

module.exports = router;