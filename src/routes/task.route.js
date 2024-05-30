// Import necessary modules

// Router object for defining routes
import { Router } from "express";

// Import controller functions
import {
    getTasks,
    addTask,
    updateTask,
    deleteTask
} from '../controllers/task.controller.js';

// Middleware for authentication
import isLoggedIn from '../middlewares/auth.middleware.js';

// Create a new router instance
const router = Router();

// Route for get all tasks
router.get('/get-all-tasks', isLoggedIn, getTasks);
// Route for add a task
router.post('/add-task', isLoggedIn, addTask);
// Route for update a task status
router.put('/update-task/:taskId', isLoggedIn, updateTask);
// Route for delete a task
router.delete('/delete-task/:taskId', isLoggedIn, deleteTask);

// Export default this router object
export default router;