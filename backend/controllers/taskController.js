const Task = require("../models/Task");
const Project = require("../models/Project");
const { validationResult } = require("express-validator");

exports.createTask = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    const { project } = req.body;
    const existProject = await Project.findById(project);
    if (!existProject) {
      return res.status(400).json({ msg: "Project not found" });
    }
    //Revisar si el project pertenece al usuario autenticado
    if (existProject.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const task = new Task(req.body);
    await task.save();
    res.json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { project } = req.query;
    const existProject = await Project.findById(project);
    if (!existProject) {
      return res.status(400).json({ msg: "Project not found" });
    }
    //Revisar si el project pertenece al usuario autenticado
    if (existProject.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    //obtener las tareas
    const tasks = await Task.find({ project }).sort({ createAt: -1 });
    res.json({ tasks });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
};

exports.editTask = async (req, res) => {
  try {
    const { project, name, state } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(400).json({ msg: " Not exist task" });
    }
    const existProject = await Project.findById(project);
    //Revisar si el project pertenece al usuario autenticado
    if (existProject.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    const newTask = {};
    newTask.name = name;
    newTask.state = state;

    //guardar task
    task = await Task.findOneAndUpdate({ _id: req.params.id }, newTask, {
      new: true,
    });
    res.json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { project } = req.query;
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(400).json({ msg: " Not exist task" });
    }
    const existProject = await Project.findById(project);
    //Revisar si el project pertenece al usuario autenticado
    if (existProject.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    //delete
    await Task.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "task eliminated" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
};
