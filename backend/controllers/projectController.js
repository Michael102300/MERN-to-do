const Project = require("../models/Project");
const { validationResult } = require("express-validator");

exports.createProject = async (req, res) => {
  //Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    //crear un nuevo proyecto
    const project = new Project(req.body);
    //guardar el creador via jwt
    project.user = req.user.id;
    //guardar proyecto
    project.save();
    res.json(project);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({ projects });
  } catch (error) {
    console.log(error);
    res.status(500).send("error");
  }
};

exports.editProject = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  //extraer la info del proyecto
  const { name } = req.body;
  const newProject = {};
  if (name) {
    newProject.name = name;
  }
  try {
    //revisar el ID
    let project = await Project.findById(req.params.id);
    //Si el proyecto existe
    if (!project) {
      return res.status(404).json({ msg: "Project not correct" });
    }
    //verificar el user del proyecto
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    //actualizar
    project = await Project.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: newProject },
      { new: true }
    );
    res.json({ project });
  } catch (error) {
    console.log(error);
    res.status(500).send("error");
  }
};

exports.deletePrject = async (req, res) => {
  try {
    //revisar el ID
    let project = await Project.findById(req.params.id);
    //Si el proyecto existe
    if (!project) {
      return res.status(404).json({ msg: "Project not correct" });
    }
    //verificar el user del proyecto
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    //eliminar project
    await Project.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Project Eliminated" });
  } catch (error) {
    console.log(error);
    res.status(500).send("error");
  }
};
