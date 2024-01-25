# To-Do List Application

### Usage Instructions:

**Step 1: Clone the Repository**

```bash
git clone https://github.com/adityapadekar/To-Do-List-app-server.git
```

**Step 2: Install Dependencies**

```bash
npm install
```

**Step 3: Set Up .env File**
Create a `.env` file with the following content:

```env
MONGO_DB_URI=//mongodb connection string
PORT=8080 // port of your choice
JWT_SECRET=// your jwt secret key to create signed tokens
```

**Step 4: Run the Server**

```bash
npm run dev
```

**Testing Purposes**

```bash
npm test --detectOpenHandles
```

### API Documentation:

Refer to the [Postman API documentation](https://documenter.getpostman.com/view/24676788/2s9YypF3mR) for detailed information on using the server.

### Code Explanation:

This server serves as the backend for a To-Do List application, offering API endpoints for creating, deleting, updating, and fetching tasks. Additionally, it provides user authentication through signup, login, and fetching user details.

**Basic Flow:**

1. User creates an account using `/api/v1/auth/signup {POST}` endpoint.
2. User logs in using `/api/v1/auth/login {POST}` endpoint and retrieves account details using `/api/v1/auth/fetch-user-details {GET}`.
3. Authenticated user performs various task-related operations:
    - Create tasks using `/api/v1/task/create-task {POST}`.
    - Fetch all tasks or tasks based on category using `/api/v1/task/fetch-all-tasks?category=value {GET}`.
    - Fetch a single task using `/api/v1/task/fetch-task/:taskId {GET}`.
    - Delete a task using `/api/v1/task/delete-task/:taskId {DELETE}`.
    - Update a task using `/api/v1/task/update-task/:taskId {PATCH}`.
    - Mark a task as completed or revert back to pending using `/api/v1/task/toggle-complete-task/:taskId {PATCH}`.

**Security Measures:**

-   JWT authentication for secure requests.
-   Passwords are hashed before storing in the database.

### Code Structure:

The codebase is well-organized with the following structure:

-   `__test__`: Test files.
-   `controllers`: Service folders and controller files.
-   `db`: Database configuration and utility files.
-   `errors`: Custom error classes.
-   `middlewares`: Middleware files.
-   `models`: Mongoose schemas.
-   `routes`: Routing files for each folder in controllers.
-   `app.js` and `server.js`: Main application and server files.

**Database Choice:**
MongoDB was chosen for its NoSQL flexibility, allowing storage of tasks with varying fields. This decision contributes to the simplicity and scalability of the application.
