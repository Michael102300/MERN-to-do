const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const userController = require("../controllers/usuarioController");

router.post(
  "/",
  [
    check("name", "name is obligatory").not().isEmpty(),
    check("email", "email incorrect").isEmail(),
    check("password", "password minimo de 6 caracteres").isLength({ min: 6 }),
  ],
  userController.signUp
);

module.exports = router;
