// app/views/not-found.js
// Function to render the Not Found view
export const renderNotFound = (element) => { // Function to render the Not Found view
    element.innerHTML = `
        <div class="not-found-container text-center py-10">
            <h1 class="text-4xl font-bold text-gray-800 mb-4">Error 404: Página no encontrada</h1>
            <p class="text-gray-600 mb-6">Lo sentimos, la página que buscas no existe o no tienes permiso para acceder a ella.</p>
            <p><a href="#/login" class="text-blue-500 hover:underline">Volver al inicio de sesión</a></p>
        </div>
    `;
};