// app/views/events/edit.js
// Function to render the edit event view
import { get, put } from '../../services/api.js'; 
import { router } from '../../router.js'; 

export const renderEditEvent = async (element, eventId) => { // Function to render the edit event view
    if (!eventId) {
        element.innerHTML = '<p class="text-red-500">ID de evento no proporcionado.</p>';
        return; // Ensure eventId is provided
    }

    let eventToEdit = null; // Variable to hold the event data
    try {
        eventToEdit = await get(`events/${eventId}`);
    } catch (error) {
        element.innerHTML = '<p class="text-red-500">Error al cargar el evento para editar.</p>';
        console.error('Error loading event for edit:', error);
        return;
    }

    if (!eventToEdit) {
        element.innerHTML = '<p class="text-red-500">Evento no encontrado.</p>';
        return;
    }

    element.innerHTML = `
        <div class="edit-event-container w-full">
            <h2 class="text-2xl font-bold mb-6">Editar Evento</h2>
            <form id="edit-event-form">
                <input type="hidden" id="event-id" value="${eventToEdit.id}">
                <div class="form-group">
                    <label for="edit-event-name">Nombre del Evento:</label>
                    <input type="text" id="edit-event-name" name="name" required value="${eventToEdit.name}" class="w-full p-2 border rounded">
                </div>
                <div class="form-group">
                    <label for="edit-event-date">Fecha:</label>
                    <input type="date" id="edit-event-date" name="date" required value="${eventToEdit.date}" class="w-full p-2 border rounded">
                </div>
                <div class="form-group">
                    <label for="edit-event-description">Descripción:</label>
                    <textarea id="edit-event-description" name="description" rows="4" required class="w-full p-2 border rounded">${eventToEdit.description}</textarea>
                </div>
                <div class="form-group">
                    <label for="edit-event-capacity">Capacidad de Asistentes:</label>
                    <input type="number" id="edit-event-capacity" name="capacity" min="1" required value="${eventToEdit.capacity}" class="w-full p-2 border rounded">
                </div>
                <div class="flex justify-end gap-4 mt-6">
                    <button type="button" id="cancel-edit-btn" class="btn btn-secondary">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                </div>
            </form>
            <div id="edit-event-message" class="message mt-4"></div>
        </div>
    `;

    const editEventForm = document.getElementById('edit-event-form');
    const editEventMessage = document.getElementById('edit-event-message');
    const cancelBtn = document.getElementById('cancel-edit-btn');

    if (editEventForm) {
        editEventForm.addEventListener('submit', async (e) => { // Add event listener for form submission
            e.preventDefault();

            const id = document.getElementById('event-id').value;
            const name = document.getElementById('edit-event-name').value;
            const date = document.getElementById('edit-event-date').value;
            const description = document.getElementById('edit-event-description').value;
            const capacity = parseInt(document.getElementById('edit-event-capacity').value, 10);

            if (!name || !date || !description || isNaN(capacity) || capacity <= 0) { // Validate form inputs
                editEventMessage.className = 'message error';
                editEventMessage.textContent = 'Por favor, completa todos los campos correctamente.';
                return;
            }

            try {
                // Update the event data
                const currentEventData = await get(`events/${id}`);
                const updatedEvent = { ...currentEventData, name, date, description, capacity };
                await put(`events/${id}`, updatedEvent);
                editEventMessage.className = 'message success';
                editEventMessage.textContent = 'Evento actualizado exitosamente.';
                setTimeout(() => {
                    router.navigate('/dashboard'); // Redirect to dashboard after successful update
                }, 800);
            } catch (error) {
                console.error('Error actualizando evento:', error);
                editEventMessage.className = 'message error';
                editEventMessage.textContent = `Error al actualizar el evento: ${error.message || 'No se pudo conectar al servidor.'}`;
            }
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            router.navigate('/dashboard');
        });
    }
};