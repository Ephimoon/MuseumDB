# MuseumDB

**COSC 3380 Database Systems Project - Museum Management System**

A project for Dr. Uma Ramamurthy's Database Systems course (COSC 3380) at the University of Houston. This project involves designing and implementing a database system for managing various aspects of a museum, including art collections, exhibitions, ticket sales, gift shop inventory, memberships, and more.

## Live Demo
The application is currently deployed and can be accessed at:
[https://black-desert-0587dbd10.5.azurestaticapps.net/](https://black-desert-0587dbd10.5.azurestaticapps.net/)

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [Project Structure](#project-structure)

## Features
- Curator management
- Event Scheduling
- Ticket sales system
- Gift shop commerce 
- Membership management
- Reports generation


## Installation
1. Clone the repository
   ```bash
   git clone [https://github.com/Ephimoon/MuseumDB]
   cd MuseumDB
2. Install dependencies
    ``` 
    npm install
    ```


## Running the Application
1. Start the development server

    Open 2 separate terminals, one for the backend and one for the frontend
    - Backend:
    
        run the following commands
         
         ```
        npm run dev
    - Frontend:

        run the following commands
        ``` 
        cd frontend
        npm start
2. For production build

    The application will be running locally at: http://localhost:3000 or http://localhost:3002
   
    You can also visit our deployed version at: https://black-desert-0587dbd10.5.azurestaticapps.net/

## Database Setup
1. Create your database in MySQL
2. Download the .SQL (dump file)
3. Restore the database schema using the .SQL (dump file)


## Project Structure
```
MuseumDB/
├── frontend/                # Frontend application
│   ├── node_modules/       # Node dependencies
│   ├── public/            # Static files
│   └── src/               # Source files
│       ├── assets/        # Images and other assets
│       ├── components/    # React components
│       ├── css/          # Styling files
│       ├── pages/        # Page components
│       ├── App.css       # Main application styles
│       ├── App.jsx       # Main application component
│       ├── config.js     # Configuration files
│       ├── emailQueue.js # Email service
│       ├── index.js      # Application entry point
│       └── server.js     # Backend server
├── .env                   # Environment variables
├── .gitignore            # Git ignore file
├── package.json          # Project dependencies
└── README.md             # Project documentation
```


## Additional Notes
- The application uses React for the frontend
- Node.js for the backend
- MySQL for the database
- Make sure MySQL server is running before starting the application
