// index.js
// import required modules and components
const API_BASE_URL = 'http://localhost:3000';
import { router } from './app/router.js';

// When the DOM is fully loaded, initialize the router
document.addEventListener('DOMContentLoaded', () => {
    router.init();
});
