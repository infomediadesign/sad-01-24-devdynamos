# FitSync

FitSync is a comprehensive fitness application with a backend API built using Flask and a frontend built with React. The application facilitates various features including user registration, login, calorie tracking, workout management, progress tracking, dashboard analytics, and user profile management.

## Features

- **User Registration and Authentication**: Register new users, log in existing users, and manage user sessions with JWT.
- **Calorie Tracking**: Track daily calorie intake and manage diet plans.
- **Workout Management**: Create, read, update, and delete workout routines.
- **Progress Tracking**: Track user progress over time with various metrics.
- **Dashboard**: Provide analytical insights on user data.
- **Admin Management**: Admin functionalities for managing the application.
- **User Profile**: Manage user profile details.

## Backend

The backend is built using Flask, PyMongo, bcrypt, JWT, and other supporting libraries.

### Prerequisites

- Python 3.7+
- MongoDB

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/fitsync.git
   cd fitsync/backend
   ```

2. **Create a virtual environment and activate it**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate   # On Windows use `venv\Scripts\activate`
   ```

3. **Install the required packages**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure MongoDB**:
   Ensure you have MongoDB running and update the `Config` class in the `config.py` file with your MongoDB connection details.

5. **Set the environment variables**:
   Create a `.env` file in the root directory and add the following:
   ```bash
   JWT_SECRET_KEY=your_jwt_secret_key
   MONGO_URI=your_mongo_uri
   ```

### Running the Backend Application

1. **Start the Flask application**:
   ```bash
   flask run
   ```

2. The backend application will be available at `http://localhost:5000`.

### API Documentation

API documentation is provided using Swagger. Once the application is running, you can access the interactive API documentation at:

```
http://localhost:5000/apidocs/
```

## Frontend

The frontend is built using React and includes various libraries for handling routing, state management, UI components, and more.

### Prerequisites

- Node.js
- npm (Node Package Manager) or yarn

### Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd fitsync/frontend
   ```

2. **Install the required packages**:
   ```bash
   npm install
   ```

### Running the Frontend Application

1. **Start the React application**:
   ```bash
   npm start
   ```

2. The frontend application will be available at `http://localhost:3000`.

### Dependencies

Here is a list of some key dependencies used in the frontend:

- `@fortawesome/fontawesome-svg-core`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/react-fontawesome`: FontAwesome icons for React.
- `@tailwindcss/aspect-ratio`: Tailwind CSS plugin for aspect ratio utilities.
- `axios`: Promise-based HTTP client for the browser and Node.js.
- `chart.js` and `react-chartjs-2`: Charting library and its React wrapper.
- `react-router-dom`: DOM bindings for React Router.
- `react-datepicker`: A simple and reusable Datepicker component for React.
- `react-icons`: Include popular icons in your React projects easily.
- `tailwindcss`: A utility-first CSS framework.

### Scripts

Here are some useful scripts for development:

- `start`: Starts the development server.
- `build`: Bundles the app into static files for production.
- `test`: Starts the test runner.
- `eject`: Removes the single build dependency from your project.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
