// routes/tasks.js

const express = require('express');
const router = express.Router();
const db = require('../models');
const Task = db.Task;
const {authenticateToken} = require('../middleware/auth');
// Route to get all tasks
router.get('/',authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update task completion status
router.put('/completed/:taskId',authenticateToken, async (req, res) => {
  const { taskId } = req.params;
  const { completed } = req.body;
  
  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    task.completed = completed;
    await task.save();
    
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Route to get a task by ID
router.get('/:id',authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.json(task);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// Route to create a new task
router.post('/',authenticateToken, async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to update a task
router.put('/:id',authenticateToken, async (req, res) => {
  try {
    const updatedTask = await Task.update(req.params.id, req.body);
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to delete a task
router.delete('/:id',authenticateToken, async (req, res) => {
  try {
    await Task.delete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
