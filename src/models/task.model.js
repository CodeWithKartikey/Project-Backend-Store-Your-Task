// Import necessary modules

// Schema and model objects from Mongoose for MongoDB interactions
import { Schema, model } from "mongoose";

/*
    Task Schema definition
*/
const taskSchema = new Schema(
    {
        title : {
            type: String,
            required: [true, 'Title is required.'],
            maxLength: [100, 'Title should be less than 100 characters long.']
        },
        description: {
            type: String,
            required: [true, 'Description is required.'],
            maxLength: [1000, 'Description should be less than 1000 characters long.']
        },
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending'
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    }, {timestamps: true}
);

/*
    Task Model definition
*/
const task = model('Task', taskSchema);

// Exporting the taskProfile object as the default export.
export default task;