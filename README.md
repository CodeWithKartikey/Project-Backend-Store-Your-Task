# Project-Backend-Store-Your-Task

## Description

This repository contains the backend for a task management application called Store Your Task. It provides RESTful APIs for user management and task management, allowing users to register, login, create tasks, update tasks, delete tasks, and many more.

## Features

- User Management
- Task Management

## Technologies Used

- **bcryptjs**: For hashing passwords securely.
- **cookie-parser**: For parsing cookies attached to the client requests.
- **cors**: For handling Cross-Origin Resource Sharing.
- **dotenv**: For loading environment variables from a `.env` file.
- **email-validator**: For validating email addresses.
- **express**: The web application framework for Node.js used for building APIs.
- **jsonwebtoken**: For generating and verifying JSON Web Tokens for user authentication.
- **mongoose**: For modeling application data and interacting with MongoDB.
- **morgan**: For HTTP request logging during development.
- **multer**: For handling multipart/form-data, primarily used for uploading files.
- **nodemailer**: For sending emails for various things.
- **zod**: For validating the data.

## Installation

1. Clone the repository:

   ```bash
   https://github.com/CodeWithKartikey/Project-Backend-Store-Your-Task.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Project-Backend-Store-Your-Task
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   - Create a `.env` file in the project root directory.
   - Define the following variables in the `.env` file:
     - `PORT`: Port number for the server (default: `8080`).
     - `MONGODB_URI`: MongoDB connection URI.
     - Other necessary variables for CORS configuration, SMTP settings etc.

5. Start the server:

   ```bash
   npm start
   ```

## Usage

- Use a REST API client like Postman to interact with the server.
- Refer to source code comments for details on available endpoints and their usage.

## Contributing

We welcome contributions to improve this project! 😁

Here's how you can contribute:

1. **Fork the repository**: Click on the 'Fork' button on the top right corner of the repository's page. This will create a copy of the repository in your GitHub account.

2. **Create a new branch**: Create a new branch in your forked repository to work on your feature or bug fix. You can do this using the following command:

   ```bash
   git checkout -b feature/my-feature
   ```

   Replace `my-feature` with a descriptive name for your feature or bug fix.

3. **Make your changes**: Implement the changes or fixes in your branch.

4. **Commit your changes**: Once you've made your changes, commit them with a descriptive commit message:

   ```bash
   git commit -am 'Add some feature'
   ```

5. **Push your changes**: Push your changes to your forked repository:

   ```bash
   git push origin feature/my-feature
   ```

6. **Submit a pull request**: Go to the main repository and click on the 'Pull Request' button. Provide a detailed description of your changes and submit the pull request. Your changes will be reviewed, and once approved, they will be merged into the main repository.

## License

This project is licensed under the MIT License.

## Credits

- Author: [Kartikey Narayan](https://github.com/CodeWithKartikey)
- Email: kartikeynarayan9598@gmail.com
- Project Repository: [Project-Backend-Store-Your-Task](https://github.com/CodeWithKartikey/Project-Backend-Store-Your-Task.git)

---

Designed, Developed & Maintained by CodeWithKartikey - Happy coding. 🚀

---