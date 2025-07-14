// app/router.js
import { isAuthenticated, getCurrentUser } from './services/auth.js';
import { renderLogin } from './views/login.js';
import { renderRegister } from './views/register.js';
import { renderDashboard } from './views/dashboard.js';
import { renderCreateEvent } from './views/events/create.js';
import { renderEditEvent } from './views/events/edit.js';
import { renderNotFound } from './views/not-found.js';

//define the routes for the application
// Each route can have a 'guard' (protection function) and 'roles' (allowed roles).
// The 'guard' function checks if the user is allowed to access the route based
// on their authentication status and roles.
// If the user is not allowed, they are redirected to a specified route or a 404 page.

const routes = {
    '/login': {
        render: renderLogin,
        guard: (user) => !user, // if user is not authenticated, allow access
        redirectTo: '/dashboard'
    },
    '/register': {
        render: renderRegister,
        guard: (user) => !user, // same
        redirectTo: '/dashboard'
    },
    '/dashboard': {
        render: renderDashboard,
        guard: (user) => !!user, // Requiere autenticación
        redirectTo: '/404' // if not authenticated, redirect to 404
    },
    '/dashboard/my-registrations': { // Ruta para ver mis registros
        render: renderDashboard, // renderDashboard will handle the logic to show registered events
        guard: (user) => !!user,
        redirectTo: '/404'
    },
    '/dashboard/events/create': {
        render: renderCreateEvent,
        guard: (user) => user && user.role === 'administrador', // only administrators can create events
        redirectTo: '/404'
    },
    '/dashboard/events/edit': {
        render: renderEditEvent,
        guard: (user) => user && user.role === 'administrador', // only administrators can edit events
        redirectTo: '/404'
    },
    '/404': {
        render: renderNotFound,
        guard: () => true // allow access 
    }
};

const getHashParams = (fullHash) => { // Function to parse the hash and extract parameters
    const params = {};
    const parts = fullHash.split('?'); // Split the hash into path and query string //split is for separating the path from the query string
    if (parts.length > 1) {
        const queryString = parts[1];
        queryString.split('&').forEach(param => { // Split each parameter and decode it
            const [key, value] = param.split('=');
            params[key] = decodeURIComponent(value);
        });
    }
    return params;
};

const handleLocation = async (appRoot) => { // Function to handle the current location and render the appropriate view
    const fullHash = window.location.hash;
    let path = fullHash.split('?')[0].substring(1); // Remove the leading '#' and get the path
    const params = getHashParams(fullHash); // Get the parameters from the hash
    console.log('Navegando a:', path, 'con parámetros:', params); // Debugging


    if (!path || path === '/') { // Default path
        path = '/login';
    }

    const route = routes[path];
    const currentUser = getCurrentUser(); // Get the current user from auth service
    console.log('Usuario actual:', currentUser); // Debugging

    if (route) {
        // Check if the user can access the route using the guard function
        const canAccess = route.guard(currentUser);
        console.log(`Ruta: ${path}, Acceso permitido por guard: ${canAccess}`); // Debugging

        if (canAccess) {
            // Render the view for the route
            if (path === '/dashboard/events/edit' && params.id) {
                await route.render(appRoot, params.id);
            } else {
                await route.render(appRoot);
            }
        } else {
            // If access is denied, redirect to the specified route or 404
            console.log(`Acceso denegado a ${path}, redirigiendo a ${route.redirectTo || '/404'}`); // Debugging
            router.navigate(route.redirectTo || '/404');
        }
    } else {
        // If the route is not defined, show the 404 page
        console.log(`Ruta no definida: ${path}, mostrando 404.`); // Debugging
        renderNotFound(appRoot);
    }
};

export const router = { // Router object to manage navigation and rendering views
    init: () => {
        const appRoot = document.getElementById('app');
        // Set up the initial route based on the current hash
        window.addEventListener('hashchange', () => handleLocation(appRoot));
        // Handle the initial load
        handleLocation(appRoot);
    },

    navigate: (path) => { // Function to navigate to a specific path
        window.location.hash = path;
    }
};