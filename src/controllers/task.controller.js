// Importing required modules

// Importing the Task model for this controller
import Task from '../models/task.model.js';
// Utility functions for handling errors, responses, and asynchronous operations
import ApiError from '../utils/apiError.util.js';
import ApiResponse from '../utils/apiResponse.util.js';
import asyncHandler from '../utils/asyncHandler.util.js';

/*
    Controller function to get all the tasks.
    Handles the HTTP GET request to get all the tasks.

    @param {Object} req - The HTTP request object.
    @param {Object} res - The HTTP response object.
    @returns {Object} HTTP response with JSON data.
*/
const getTasks = asyncHandler(async (req, res) => {

    const { id } = req.user;
    
    const allTasks = await Task.find({ user: id});

    if(allTasks.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, allTasks, 'No task found for this user.'));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, allTasks, 'All tasks found successfully for this user.'));
});

/*
    Controller function to add a task.
    Handles the HTTP POST request to add a task.

    @param {Object} req - The HTTP request object.
    @param {Object} res - The HTTP response object.
    @returns {Object} HTTP response with JSON data.
*/
const addTask = asyncHandler(async (req, res) => {

    const { id } = req.user;
    const { title, description, status } = req.body;

    if(!title || !description) {
        throw new ApiError(400, 'All field must be filled.');
    }

    const addTask = await Task.create({
        title,
        description,
        status,
        user: id
    });
    if(!addTask) {
        throw new ApiError(500, 'Failed to create the task, Please try again.');
    }

    return res
        .status(201)
        .json(new ApiResponse(201, addTask, 'Task added successfully.'));
});

/*
    Controller function to edit a task.
    Handles the HTTP PUT request to update a task based on taskId.

    @param {Object} req - The HTTP request object.
    @param {Object} res - The HTTP response object.
    @returns {Object} HTTP response with JSON data.
*/
const updateTask = asyncHandler(async (req, res) => {

    const { taskId } = req.params;
    const { title, description, status } = req.body;

    const task = await Task.findById(taskId);
    if(!task) {
        throw new ApiError(404, 'Task not found with the specified ID.');
    }

    const updateTask = await Task.findByIdAndUpdate(
            taskId,
            {
                $set: {
                    title,
                    description,
                    status
                } 
            },
            { new: true }
        );
    if(!updateTask) {
        throw new ApiError(404, 'Something went wrong, Please try again.');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updateTask, 'Task updated successfully.'));
});

/*
    Controller function to delete a task.
    Handles the HTTP DELETE request to delete a task based on taskId.

    @param {Object} req - Express request object.
    @param {Object} res - Express response object.
    @returns {Object} JSON response indicating success or failure.
*/
const deleteTask = asyncHandler(async (req, res) => {

    const { taskId } = req.params;

    const deleteTask = await Task.findByIdAndDelete(taskId);
    if(!deleteTask) {
        throw new ApiError(404, 'Task not found with the specified ID.');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { deleteTaskId: taskId }, "Task deleted successfully."));
});

// Exporting functions related to task management
export { getTasks, addTask, updateTask, deleteTask };

