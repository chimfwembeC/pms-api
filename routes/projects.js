// routes/projects.js

const express = require("express");
const router = express.Router();
const db = require("../models");
const Project = db.Project;
const User = db.User;
const Task = db.Task;

const { authenticateToken } = require("../middleware/auth");
// Route to get all projects
// const app = express();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/completed/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const { completed } = req.body;

  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.completed = completed;
    await project.save();

    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get a project by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    // console.log('req.params.id', req.params.id);
    const project = await Project.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'email', 'role', 'is_active'],
        },
        {
          model: Task,
          // as: "assigned",
          attributes: ['id', 'title', 'description', 'completed'],
        }
      ]
    });

    // console.log('project', project);

    res.json({ project });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// Route to create a new project
router.post("/", authenticateToken, async (req, res) => {
  // const { title, description, createdBy, createdAt, updatedAt } = req.body;
  try {
    const newProject = await Project.create(req.body);
    // {
    //   title: title,
    //   description: description,
    //   createdBy: createdBy,
    //   createdAt: createdAt,
    //   updatedAt: updatedAt,
    // }
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to update a project
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const updatedProject = await Project.update(req.params.id, req.body);
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to delete a project
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    await Project.delete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
