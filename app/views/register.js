import { registerUser } from '../services/auth.js'; 
import { get } from '../services/api.js'; 
import { router } from '../router.js'; 


export const renderRegister = (element) => { // Function to render the registration view
    element.innerHTML = `
        <div class="register-container">
            <h1>Register</h1>
            <form id="register-form">
                <div class="form-group">
                    <label for="reg-username">Username:</label>
                    <input type="text" id="reg-username" name="username" required class="w-full p-2 border rounded">
                </div>
                <div class="form-group">
                    <label for="reg-password">password:</label>
                    <input type="password" id="reg-password" name="password" required class="w-full p-2 border rounded">
                </div>
                <div class="form-group">
                    <label for="reg-role">Rol:</label>
                    <select id="reg-role" name="role" required class="w-full p-2 border rounded">
                        <option value="visitante">Visitante</option>
                        <option value="administrador">Administrador</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary w-full mt-4">Register</button>
                <p class="mt-4 text-sm">¿Ya tienes cuenta? <a href="#/login" class="text-blue-500 hover:underline">Inicia sesión aquí</a></p>
            </form>
            <div id="register-message" class="message mt-4"></div>
        </div>
    `;

    const registerForm = document.getElementById('register-form');
    const registerMessage = document.getElementById('register-message');

    if (registerForm) { // Add event listener for form submission
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Intento de registro...'); // Debugging
            const username = document.getElementById('reg-username').value;
            const password = document.getElementById('reg-password').value;
            const role = document.getElementById('reg-role').value;

            if (!username || !password) {
                registerMessage.className = 'message error';
                registerMessage.textContent = 'Por favor, completa todos los campos.';
                return;
            }

            try {
                // Check if the username already exists
                // Assuming get is a function that fetches data from the API
                const existingUsers = await get(`users?username=${username}`);
                if (existingUsers.length > 0) {
                    registerMessage.className = 'message error';
                    registerMessage.textContent = 'El nombre de usuario ya existe. Por favor, elige otro.';
                    console.log('Registro fallido: nombre de usuario ya existe.'); // Debugging
                    return;
                }

                await registerUser(username, password, role); // Call the register function from auth service
                registerMessage.className = 'message success';
                registerMessage.textContent = '¡Registro exitoso! Ahora puedes iniciar sesión.';
                registerForm.reset();
                console.log('Registro exitoso, redirigiendo a login.'); // Debugging
                setTimeout(() => {
                    router.navigate('/login'); // Redirect to login after successful registration
                }, 500);

            } catch (error) {
                console.error('Error durante el registro:', error); // Debugging
                registerMessage.className = 'message error';
                registerMessage.textContent = `Error en el registro: ${error.message || 'No se pudo conectar al servidor.'}`; // Display error message
            }
        });
    }
};
