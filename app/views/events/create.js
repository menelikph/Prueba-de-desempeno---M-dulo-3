// app/views/events/create.js
import { post } from '../../services/api.js'; 
import { router } from '../../router.js';


export const renderCreateEvent = (element) => { // Function to render the create event view
    element.innerHTML = `
        <div class="create-event-container w-full">
            <h2 class="text-2xl font-bold mb-6">Crear Nuevo Evento</h2>
            <form id="create-event-form">
                <div class="form-group">
                    <label for="event-name">Nombre del Evento:</label>
                    <input type="text" id="event-name" name="name" required class="w-full p-2 border rounded">
                </div>
                <div class="form-group">
                    <label for="event-date">Fecha:</label>
                    <input type="date" id="event-date" name="date" required class="w-full p-2 border rounded">
                </div>
                <div class="form-group">
                    <label for="event-description">Descripción:</label>
                    <textarea id="event-description" name="description" rows="4" required class="w-full p-2 border rounded"></textarea>
                </div>
                <div class="form-group">
                    <label for="event-capacity">Capacidad de Asistentes:</label>
                    <input type="number" id="event-capacity" name="capacity" min="1" required class="w-full p-2 border rounded">
                </div>
                <div class="flex justify-end gap-4 mt-6">
                    <button type="button" id="cancel-create-btn" class="btn btn-secondary">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Crear Evento</button>
                </div>
            </form>
            <div id="create-event-message" class="message mt-4"></div>
        </div>
    `;

    const createEventForm = document.getElementById('create-event-form');
    const createEventMessage = document.getElementById('create-event-message');
    const cancelBtn = document.getElementById('cancel-create-btn');

    if (createEventForm) { 
        createEventForm.addEventListener('submit', async (e) => { // Add event listener for form submission
            e.preventDefault();
            const name = document.getElementById('event-name').value;
            const date = document.getElementById('event-date').value;
            const description = document.getElementById('event-description').value;
            const capacity = parseInt(document.getElementById('event-capacity').value, 10);

            if (!name || !date || !description || isNaN(capacity) || capacity <= 0) {
                createEventMessage.className = 'message error';
                createEventMessage.textContent = 'Por favor, completa todos los campos correctamente.';
                return;
            }

            try {
                const newEvent = { name, date, description, capacity, registeredUsers: [] };
                await post('events', newEvent);
                createEventMessage.className = 'message success';
                createEventMessage.textContent = 'Evento creado exitosamente.';
                createEventForm.reset();
                setTimeout(() => {
                    router.navigate('/dashboard'); // Volver al dashboard
                }, 800); // Redirect to dashboard after successful creation
            } catch (error) {
                console.error('Error creando evento:', error);
                createEventMessage.className = 'message error';
                createEventMessage.textContent = `Error al crear el evento: ${error.message || 'No se pudo conectar al servidor.'}`;
            }
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => { // Add event listener for cancel button
            router.navigate('/dashboard');
        });
    }
};