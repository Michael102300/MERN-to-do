const express = require("express");
const projectController = require("../controllers/projectController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

const router = express.Router();

//crear proyectos
//api/proyectos
router.post(
  "/",
  auth,
  [check("name", "Name is obligatory").not().isEmpty()],
  projectController.createProject
);
//obtener los proyectos
router.get("/", auth, projectController.getProjects);
//actualizar proyecto via ID
router.put(
  "/:id",
  auth,
  [check("name", "Name is obligatory").not().isEmpty()],
  projectController.editProject
);

router.delete("/:id", auth, projectController.deletePrject);

module.exports = router;
