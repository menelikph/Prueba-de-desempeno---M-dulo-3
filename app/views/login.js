// app/views/login.js
import { loginUser } from '../services/auth.js'; // import the login function from auth service
import { router } from '../router.js'; // import the router for navigation

export const renderLogin = (element) => { // Function to render the login view
    element.innerHTML = `
        <div class="login-container">
            <h1>Login</h1>
            <form id="login-form">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required class="w-full p-2 border rounded">
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required class="w-full p-2 border rounded">
                </div>
                <button type="submit" class="btn btn-primary w-full mt-4">Login In</button>
                <p class="mt-4 text-sm">¿No tienes cuenta? <a href="#/register" class="text-blue-500 hover:underline">Regístrate aquí</a></p>
            </form>
            <div id="login-message" class="message mt-4"></div>
        </div>
    `;

    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => { // Add event listener for form submission
            e.preventDefault();
            console.log('Intento de login...'); // Debugging message 
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (!username || !password) {
                loginMessage.className = 'message error';
                loginMessage.textContent = 'Por favor, ingresa usuario y contraseña.';
                return;
            }
            try { 
                const user = await loginUser(username, password); // Call the login function from auth service
                if (user) {
                    loginMessage.className = 'message success';
                    loginMessage.textContent = 'Inicio de sesión exitoso.';
                    console.log('Login exitoso, redirigiendo a dashboard:', user); // Debugging
                    setTimeout(() => {
                        router.navigate('/dashboard');
                    }, 500);
                } else {
                    loginMessage.className = 'message error';
                    loginMessage.textContent = 'Usuario o contraseña incorrectos.';
                    console.log('Login fallido: credenciales incorrectas.'); // Debugging
                }
            } catch (error) {
                console.error('Error durante el inicio de sesión:', error); // Debugging
                loginMessage.className = 'message error';
                loginMessage.textContent = `Error al intentar iniciar sesión: ${error.message || 'No se pudo conectar al servidor.'}`;
            }
        });
    }
};
