const express = require("express");
const taskController = require("../controllers/taskController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

const router = express.Router();

//api/tasks
router.post(
  "/",
  auth,
  [
    check("name", "Name is obligatory").not().isEmpty(),
    check("project", "project is obligatory").not().isEmpty(),
  ],
  taskController.createTask
);
//obtener las tareas por  proyectos
router.get("/", auth, taskController.getTasks);

//actualizar proyecto via ID
router.put(
  "/:id",
  auth,
  /* [check("name", "Name is obligatory").not().isEmpty()], */
  taskController.editTask
);

router.delete("/:id", auth, taskController.deleteTask);

module.exports = router;
