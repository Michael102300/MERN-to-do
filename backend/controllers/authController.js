const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.authUser = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not exist" });
    }
    const passCorrect = await bcryptjs.compare(password, user.password);
    if (!passCorrect) {
      return res.status(400).json({ msg: "Incorrect password" });
    }
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
  } catch (error) {
    console.log(error);
  }
};

exports.authenticatedUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (error) {
    console.log(error), res.status(500).send("error");
  }
};
