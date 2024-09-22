# Real-Time Collaborative Document Sync

## Features
* **User Authentication**: Secure user login and registration using JWT.
* **Document Management**: Full CRUD operations for managing documents.
* **Real-Time Collaboration**: Real-time document editing with WebSockets, allowing multiple users to edit a document simultaneously.
* **Version Control**: Track document changes and restore previous versions.

## Technologies
* **Node.js**: Backend server.
* **TypeScript**: Used for type safety and modern JavaScript features.
* **Express**: Web framework for building the API.
* **Socket.IO**: Handles real-time communication for collaborative editing.
* **Sequelize**: ORM for interacting with the MySQL database.
* **MySQL**: The relational database for storing users, documents, and version history.
* **JWT (JSON Web Token)**: Used for securing API routes through authentication.

## Installation

### Prerequisites
Ensure you have the following installed on your system:
* [Node.js](https://nodejs.org/)
* [MySQL](https://www.mysql.com/)

### Steps

1. **Clone the repository**:

    ```bash
    git clone https://github.com/JheyTim/Real-Time-Collaborative-Document-Sync.git
    cd Real-Time-Collaborative-Document-Sync
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Create a `.env` file** in the root directory with the following values:

    ```env
    PORT=3000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=collaborative_docs
    JWT_SECRET=your_jwt_secret
    ```

4. **Set up the MySQL database**
    * Create a MySQL database called **collaborative_docs**.
    * Sequelize will automatically sync models and create the necessary tables.

5. **Run the application**
    ```bash
    npm start
    ```

## API Endpoints

### Authentication
* POST /auth/register: Register a new user.
* POST /auth/login: Login and receive a JWT.

### Documents
* POST /api/documents: Create a new document.
* GET /api/documents: Retrieve all documents for the authenticated user.
* GET /api/documents/:id: Retrieve a specific document by ID.
* PUT /api/documents/:id: Update a document by ID.
* DELETE /api/documents/:id: Delete a document by ID.

### Real-Time Collaboration
* **WebSocket** (ws://localhost:3000): Connect via WebSocket for real-time document editing. The following events are supported:
    * join-document: Join a document for collaborative editing.
    * edit-document: Send document changes to the server for broadcasting.
    * document-updated: Receive updates when another user edits the document.

### Version Control
* **Automatically handled**: Each time a document is updated, a new version is saved. Previous versions can be restored or viewed.

## License
This project is licensed under the [MIT License](LICENSE).