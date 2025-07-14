//CRUD API Service
// This service provides functions to interact with a RESTful API using fetch.
// It includes methods for GET, POST, PUT, and DELETE requests.

const API_BASE_URL = 'http://localhost:3000'; // Change this to your actual API base URL


export const get = async (endpoint) => { // Function to make GET requests to the API
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`); // Fetch data from the API
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); 
            // If the response is not OK, throw an error with the status code
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
};

export const post = async (endpoint, data) => { // Function to make POST requests to the API
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST', // Specify the method as POST
            // Set the headers to indicate JSON content
            headers: {
                'Content-Type': 'application/json', // Specify that the request body is JSON
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) { // Check if the response is not OK
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error posting to ${endpoint}:`, error);
        throw error;
    }
};


export const put = async (endpoint, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`); // If the response is not OK, throw an error with the status code and message
        }
        return await response.json();
    } catch (error) {
        console.error(`Error putting to ${endpoint}:`, error);
        throw error;
    }
};


export const del = async (endpoint) => { // Function to make DELETE requests to the API
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); // If the response is not OK, throw an error with the status code
        }
        return;
    } catch (error) {
        console.error(`Error deleting from ${endpoint}:`, error); // Log the error to the console
        throw error;
    }
};