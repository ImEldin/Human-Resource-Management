# Human Resource Management System

A comprehensive web-based application designed to streamline and manage job applications within an organization.

## 🚀 Features

- **Job Listings Management**: Create, update, and delete job postings with detailed descriptions and requirements.
- **Applicant Tracking**: Monitor and manage applications, including applicant information, resumes, and cover letters.
- **User Authentication**: Secure login system for administrators and HR personnel.
- **Role-Based Access Control**: Differentiate permissions between administrators and standard users.
- **Application Status Updates**: Track the progress of applications through various stages (e.g., received, under review, interviewed, accepted, rejected).
- **Email Notifications**: Automated emails to applicants regarding their application status.
- **Responsive Design**: Accessible on various devices, ensuring usability across desktops, tablets, and smartphones.

## 🛠️ Technologies Used

- **Backend**:
  - **Node.js**: JavaScript runtime environment.
  - **Express.js**: Web application framework for Node.js.
  - **PostgreSQL**: SQL-based relational database for structured data storage.
- **Frontend**:
  - **EJS (Embedded JavaScript)**: Templating engine for generating HTML markup with plain JavaScript.
  - **HTML5 & CSS3**: Structure and styling of the web pages.
  - **JavaScript**: Client-side scripting.
  - **Bootstrap**: CSS framework for responsive design and pre-built components.
- **Authentication & Authorization**:
  - **Passport.js**: Middleware for authentication.
  - **BCrypt.js**: Library for hashing passwords.
  - **JSON Web Tokens (JWT)**: Token-based authentication.
- **Email Service**:
  - **Nodemailer**: Module for Node.js applications to send emails.
- **Middleware**:
  - **Express-Session**: Session management.

## 📂 Project Structure

```
Human-Resource-Management/
├── bin/                    # Binary files (e.g., server startup scripts)
├── config/                 # Configuration files (e.g., database, authentication)
├── controllers/            # Route handlers and business logic
├── middleware/             # Custom middleware functions
├── models/                 # Sequelize models
├── public/                 # Static assets (e.g., images, stylesheets, JavaScript files)
├── routes/                 # Application routes
├── utils/                  # Utility functions and helpers
├── views/                  # EJS templates for rendering HTML
├── .gitignore              # Git ignored files
├── README.md               # Project documentation
├── app.js                  # Main application file
├── package-lock.json       # Exact versions of npm dependencies
└── package.json            # Project metadata and npm dependencies
```

## 📜 API Routes

### **Authentication Routes**
- **POST** `/register` → Register a new user (admin or HR personnel)
- **POST** `/login` → Authenticate user and generate JWT token
- **GET** `/logout` → Logout user and destroy session

### **Job Listings Routes**
- **GET** `/jobs` → Retrieve all job postings
- **POST** `/jobs` → Create a new job posting (Admin only)
- **PUT** `/jobs/:id` → Update a job posting (Admin only)
- **DELETE** `/jobs/:id` → Delete a job posting (Admin only)

### **Applicant Routes**
- **GET** `/applications` → Retrieve all applications (Admin only)
- **POST** `/applications` → Submit a new job application
- **PUT** `/applications/:id` → Update application status (Admin only)
- **GET** `/applications/:id` → View a specific application

### **User Routes**
- **GET** `/users` → Retrieve all users (Admin only)
- **GET** `/users/:id` → View a specific user profile

## 🔒 Authentication & Middleware

- **JWT-Based Authentication**: Users are authenticated via JWT tokens, stored in cookies for session persistence.
- **Password Hashing**: BCrypt.js is used to hash passwords before storing them in the database.
- **Role-Based Access Control**: Middleware ensures that only admins can create, update, and delete job listings.
- 
## 📜 Installation and Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ImEldin/Human-Resource-Management.git
   cd Human-Resource-Management
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
   
3. **Start the Application**:
   ```bash
   npm start
   ```
   The application will run at `http://localhost:3000`.

## 📋 Usage

1. **Access the Application**:
   - Navigate to `http://localhost:3000` in your web browser.

2. **Administrator Actions**:
   - **Login**: Use administrator credentials to log in.
   - **Manage Job Listings**: Create, edit, or delete job postings.
   - **View Applications**: Review applications submitted by candidates.
   - **Update Application Status**: Change the status of applications and send notifications to applicants.

3. **Applicant Actions**:
   - **View Job Listings**: Browse available job opportunities.
   - **Apply for a Job**: Submit applications with personal information, resumes, and cover letters.
   - **Receive Notifications**: Get email updates regarding application status.

## 🔒 Security Considerations

- **Password Storage**: Passwords are hashed using BCrypt to ensure security.
- **Input Validation**: User inputs are validated to prevent SQL injection and XSS attacks.
- **Session Management**: Sessions are managed securely with appropriate expiration and regeneration strategies.
