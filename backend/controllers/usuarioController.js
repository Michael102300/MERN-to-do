const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  //revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  const { email, password } = req.body;
  try {
    //Revisar que el usuario sea unico
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    //crea el nuevo usuario
    user = new User(req.body);

    //hashear el password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);
    //guardar el nuevo usuario
    await user.save();
    //crear y firmar el jwt
    const payload = {
      user: {
        id: user.id,
      },
    };
    //firmar el jwt
    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: 3600000,
      },
      (error, token) => {
        if (error) throw error;
        res.json({ token });
      }
    );

    //mensaje de confirmacion
  } catch (error) {
    console.log(error);
    res.status(400).send("Hubo un error");
  }
};
