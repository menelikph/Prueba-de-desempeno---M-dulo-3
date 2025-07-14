// app/services/auth.js
// This service handles user authentication, including login, registration, and session management.
import { get, post } from './api.js'; // Importing the API functions for making requests


export const registerUser = async (username, password, role) => { // Function to register a new user
    const newUser = { username, password, role };
    return await post('users', newUser);
};

export const loginUser = async (username, password) => { // Function to log in a user
    const users = await get('users');
    const user = users.find(u => u.username === username && u.password === password); // Find the user by username and password
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }
    return null;
};

export const logoutUser = () => { // Function to log out the current user
    console.log('Cerrando sesión...'); // Debugging message
    localStorage.removeItem('currentUser');
};

export const getCurrentUser = () => { // Function to get the currently logged-in user
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
};

export const hasRole = (role) => { // Function to check if the current user has a specific role
    const user = getCurrentUser();
    return user && user.role === role;
};

export const isAuthenticated = () => { // Function to check if a user is authenticated
    return getCurrentUser() !== null;
};