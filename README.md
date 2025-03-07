# Simple WebApp with Node.js, PostgreSQL, and Sequelize

This is a simple web application built using Node.js (Express), PostgreSQL (Sequelize ORM) to manage user balances. The application uses Docker for PostgreSQL and supports a user balance system, where users can update their balance, ensuring the balance does not go negative.

## Features:
- **Balance management**: Users can update their balance (increase or decrease) with the constraint that the balance cannot be negative.
- **Real-time updates**: The balance is updated in real-time without using queues or delayed tasks.
- **Database migration**: The application uses `Umzug` to handle migrations automatically, including creating the users table and adding the initial user.
- **Dockerized PostgreSQL**: The application uses Docker Compose to manage the PostgreSQL database and ensure easy setup.

## Installation Instructions

### Prerequisites:
- **Node.js** (v14.x or higher)
- **Docker** (for running PostgreSQL in a container)
- **Docker Compose** (to manage multi-container Docker applications)

### Steps to Run the Application:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/repository-name.git
    cd repository-name
    ```

2. **Set up Docker**:
    - Make sure Docker and Docker Compose are installed on your machine.
    - Build and start the Docker containers (PostgreSQL):
    ```bash
    docker-compose up -d
    ```
    This will start the PostgreSQL container and set up the database.

3. **Install the dependencies**:
    - Run the following command to install the Node.js dependencies:
    ```bash
    npm install
    ```

4. **Run the migrations**:
    - After starting the PostgreSQL container, run the migrations to create the `users` table and populate the initial user:
    ```bash
    npm run migrate
    ```

5. **Start the application**:
    - Start the Express server:
    ```bash
    npm start
    ```

6. **Access the application**:
    - The application will be running at `http://localhost:3000`.

## API Endpoints:

### **Authentication Routes** (`/auth`):

- **POST `/auth/register`**: Register a new user.
  - **Request body**:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```
  - **Response**:
    - Success:
      ```json
      {
        "message": "User registered successfully.",
        "user": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
      ```
    - Error (if email already exists):
      ```json
      {
        "message": "User with this email already exists."
      }
      ```

- **POST `/auth/login`**: Log in an existing user.
  - **Request body**:
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```
  - **Response**:
    - Success:
      ```json
      {
        "message": "Login successful",
        "token": "jwt_token_here"
      }
      ```
    - Error (invalid credentials):
      ```json
      {
        "message": "Invalid email or password"
      }
      ```

### **User Routes** (`/users`):

- **GET `/users`**: Fetch all users (Admin only).
  - **Response**:
    ```json
    {
      "users": [
        {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com",
          "balance": 10000
        }
      ]
    }
    ```

- **GET `/users/:userId`**: Fetch a user by `userId`.
  - **Request params**:
    - `userId`: The ID of the user you want to fetch.
  - **Response**:
    ```json
    {
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "balance": 10000
      }
    }
    ```
  
- **PUT `/users/update-balance`**: Update the user's balance (Admin only).
  - **Request body**:
    ```json
    {
      "userId": "1",
      "amount": 200
    }
    ```
  - **Response**:
    - Success:
      ```json
      {
        "message": "Balance updated successfully.",
        "balance": 10200
      }
      ```
    - Error (insufficient funds):
      ```json
      {
        "message": "Insufficient funds"
      }
      ```

- **DELETE `/users/:userId`**: Delete a user by `userId` (Admin only).
  - **Request params**:
    - `userId`: The ID of the user you want to delete.
  - **Response**:
    ```json
    {
      "message": "User deleted successfully"
    }
    ```

## Docker Compose Setup:

- The Docker Compose file (`docker-compose.yml`) will create and configure a PostgreSQL database container.
- You may need to modify the database connection details in the code if you wish to use different settings.

## Troubleshooting:

- **Docker not starting**: Ensure Docker and Docker Compose are installed and running.
- **Database connection errors**: Double-check the PostgreSQL connection settings in your Node.js application.

## Contributing:

Feel free to fork this repository, open issues, or submit pull requests. Contributions are always welcome!

