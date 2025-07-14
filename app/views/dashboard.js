// app/views/dashboard.js
// Import necessary services and router
import { getCurrentUser, logoutUser } from '../services/auth.js';
import { get, put, del } from '../services/api.js'; 
import { router } from '../router.js';


export const renderDashboard = async (element) => { // Function to render the dashboard view
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.warn('No hay usuario actual en el dashboard, redirigiendo a login.'); // Debugging
        router.navigate('/login');
        return;
    }
    console.log('Usuario actual en dashboard:', currentUser); // Debugging

    element.innerHTML = `
        <div class="dashboard-container">
            <header class="dashboard-header">
                <h2 class="text-2xl font-bold">Bienvenido, ${currentUser.username}!</h2>
                <button id="logout-btn" class="btn btn-secondary">Cerrar Sesión</button>
            </header>
            <nav class="dashboard-nav">
                <ul>
                    ${currentUser.role === 'administrador' ? // Show admin options
                        `<li><a href="#/dashboard/events/create" id="create-event-link" class="btn">Crear Evento</a></li>` : ''
                    }
                    <li><a href="#/dashboard/my-registrations" id="my-registrations-link" class="btn">Mis Registros</a></li>
                </ul>
            </nav>
            <div id="event-list" class="mt-6">
                <h3 class="text-xl font-semibold mb-4">Eventos Disponibles</h3>
                <!-- Aquí se cargarán dinámicamente los eventos -->
                <p>Cargando eventos...</p>
            </div>
            <div id="my-registrations-section" class="mt-6 hidden">
                <h3 class="text-xl font-semibold mb-4">Mis Eventos Registrados</h3>
                <p>Cargando tus registros...</p>
            </div>
        </div>
    `;

    const logoutBtn = document.getElementById('logout-btn'); // Get the logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => { // Add event listener for logout
            console.log('Cerrando sesión...'); // Debugging
            logoutUser();
            router.navigate('/login');
        });
    }

    const eventListContainer = document.getElementById('event-list');
    const myRegistrationsSection = document.getElementById('my-registrations-section');

    // Lógica para mostrar Mis Registros si la ruta es #/dashboard/my-registrations
    if (window.location.hash.startsWith('#/dashboard/my-registrations')) { // Check if the current route is for my registrations
        console.log('Cargando Mis Registros...'); // Debugging
        eventListContainer.classList.add('hidden');
        myRegistrationsSection.classList.remove('hidden');
        await loadMyRegistrations(myRegistrationsSection, currentUser.id); // Load the user's registrations
    } else {
        console.log('Cargando Eventos Disponibles...'); // Debugging
        eventListContainer.classList.remove('hidden');
        myRegistrationsSection.classList.add('hidden');
        await loadEvents(eventListContainer, currentUser);
    }

    // Event listener para el enlace "Mis Registros"
    const myRegistrationsLink = document.getElementById('my-registrations-link'); // Get the "My Registrations" link
    if (myRegistrationsLink) {
        myRegistrationsLink.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('Navegando a Mis Registros...'); // Debugging
            router.navigate('/dashboard/my-registrations');
        });
    }
};

const loadEvents = async (container, currentUser) => { // Function to load and display events 
    try {
        const events = await get('events');
        container.innerHTML = ''; // Limpiar el contenedor
        console.log('Eventos cargados:', events); // Debugging

        if (events.length === 0) {
            container.innerHTML = '<p class="text-gray-600">No hay eventos disponibles en este momento.</p>';
            return;
        }

        events.forEach(event => { // Iterate through each event and create a card for it
            const isRegistered = event.registeredUsers && event.registeredUsers.includes(currentUser.id); // Check if the user is registered for the event
            const isFull = event.registeredUsers && event.registeredUsers.length >= event.capacity; // Check if the event is full

            const eventCard = document.createElement('div');
            eventCard.className = 'event-card'; // Create a card for the event
            eventCard.innerHTML = `
                <h4 class="text-lg font-semibold">${event.name}</h4>
                <p><strong>Fecha:</strong> ${event.date}</p>
                <p><strong>Descripción:</strong> ${event.description}</p>
                <p><strong>Capacidad:</strong> ${event.registeredUsers ? event.registeredUsers.length : 0} / ${event.capacity}</p>
                <div class="actions">
                    ${currentUser.role === 'administrador' ? `
                        <button class="btn btn-warning edit-event-btn" data-id="${event.id}">Editar</button>
                        <button class="btn btn-danger delete-event-btn" data-id="${event.id}">Eliminar</button>
                    ` : ''}
                    ${currentUser.role === 'visitante' && !isRegistered && !isFull ? `
                        <button class="btn btn-info register-event-btn" data-id="${event.id}">Registrarse</button>
                    ` : ''}
                    ${currentUser.role === 'visitante' && isRegistered ? `
                        <button class="btn btn-secondary" disabled>Registrado</button>
                    ` : ''}
                    ${currentUser.role === 'visitante' && isFull && !isRegistered ? `
                        <button class="btn btn-secondary" disabled>Lleno</button>
                    ` : ''}
                </div>
            `;
            container.appendChild(eventCard); // Append the event card to the container
        });

        // Añadir event listeners para los botones de acción
        container.querySelectorAll('.edit-event-btn').forEach(button => { // Add event listener for edit buttons
            button.addEventListener('click', (e) => {
                router.navigate(`/dashboard/events/edit?id=${e.target.dataset.id}`);
            });
        });

        container.querySelectorAll('.delete-event-btn').forEach(button => { // Add event listener for delete buttons
            button.addEventListener('click', async (e) => {
                if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
                    try {
                        await del(`events/${e.target.dataset.id}`);
                        alert('Evento eliminado exitosamente.');
                        loadEvents(container, currentUser); // Recargar eventos
                    } catch (error) {
                        alert('Error al eliminar el evento.');
                        console.error('Error deleting event:', error);
                    }
                }
            });
        });

        container.querySelectorAll('.register-event-btn').forEach(button => { // Add event listener for register buttons
            button.addEventListener('click', async (e) => {
                try {
                    const eventId = e.target.dataset.id;
                    const eventToUpdate = await get(`events/${eventId}`);
                    if (!eventToUpdate.registeredUsers) {
                        eventToUpdate.registeredUsers = [];
                    }
                    if (eventToUpdate.registeredUsers.length >= eventToUpdate.capacity) {
                        alert('El evento está lleno. No se puede registrar.');
                        return;
                    }
                    if (eventToUpdate.registeredUsers.includes(currentUser.id)) {
                        alert('Ya estás registrado en este evento.');
                        return;
                    }

                    eventToUpdate.registeredUsers.push(currentUser.id);
                    await put(`events/${eventId}`, eventToUpdate);
                    alert('¡Te has registrado en el evento exitosamente!');
                    loadEvents(container, currentUser); // Recargar eventos
                } catch (error) {
                    alert('Error al registrarse en el evento.');
                    console.error('Error registering for event:', error);
                }
            });
        });

    } catch (error) {
        container.innerHTML = '<p class="text-red-500">Error al cargar los eventos.</p>';
        console.error('Error loading events:', error);
    }
};

const loadMyRegistrations = async (container, userId) => { // Function to load and display the user's registered events
    try {
        const events = await get('events');
        const myRegisteredEvents = events.filter(event =>
            event.registeredUsers && event.registeredUsers.includes(userId)
        );

        container.innerHTML = ''; // Clear the container

        if (myRegisteredEvents.length === 0) {
            container.innerHTML = '<p class="text-gray-600">No te has registrado en ningún evento aún.</p>';
            return;
        }

        myRegisteredEvents.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <h4 class="text-lg font-semibold">${event.name}</h4>
                <p><strong>Fecha:</strong> ${event.date}</p>
                <p><strong>Descripción:</strong> ${event.description}</p>
                <p><strong>Capacidad:</strong> ${event.registeredUsers ? event.registeredUsers.length : 0} / ${event.capacity}</p>
                <div class="actions">
                    <button class="btn btn-danger unregister-event-btn" data-id="${event.id}">Cancelar Registro</button>
                </div>
            `;
            container.appendChild(eventCard);
        });

        container.querySelectorAll('.unregister-event-btn').forEach(button => { // Add event listener for unregister buttons
            button.addEventListener('click', async (e) => {
                if (confirm('¿Estás seguro de que quieres cancelar tu registro a este evento?')) {
                    try {
                        const eventId = e.target.dataset.id;
                        const eventToUpdate = await get(`events/${eventId}`);
                        eventToUpdate.registeredUsers = eventToUpdate.registeredUsers.filter(id => id !== userId);
                        await put(`events/${eventId}`, eventToUpdate);
                        alert('Registro cancelado exitosamente.');
                        loadMyRegistrations(container, userId); // Recargar mis registros
                    } catch (error) {
                        alert('Error al cancelar el registro.');
                        console.error('Error unregistering from event:', error);
                    }
                }
            });
        });

    } catch (error) {
        container.innerHTML = '<p class="text-red-500">Error al cargar tus registros.</p>';
        console.error('Error loading my registrations:', error);
    }
};