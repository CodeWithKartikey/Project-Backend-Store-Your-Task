// Import necessary modules

// Import Mongoose for MongoDB interactions
import mongoose from "mongoose";

// Function to connect MongoDB database
const connectMongoDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        if(connectionInstance) {
            console.log(`Connect successfully with MongoDB database : ${connectionInstance.connection.host}`);
        } 
    } catch (error) {
        console.log('There is an error to connect MongoDB database : ', error);
        process.exit(1);
    }
};

// Export default this function to connect to MongoDB
export default connectMongoDB;