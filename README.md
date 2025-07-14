# Event Management - Riwi

## Description
Event Management - Riwi is a Single Page Application (SPA) designed to help users manage events efficiently. The application allows users to create, edit, and delete events, with a clean and responsive user interface. It uses modern web technologies such as Vite for development and JSON Server for simulating a backend.

## Features
- **Event Management**: Create, edit, and delete events with ease.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Customizable UI**: Styled using CSS variables for easy theme adjustments.
- **JSON Server Integration**: Simulates a backend for storing event data.
- **Fast Development**: Powered by Vite for quick builds and hot module replacement.

## Technologies Used
- **HTML**: Provides the structure of the application.
- **CSS**: Handles styling and responsive design.
- **JavaScript**: Implements application logic and interactivity.
- **Vite**: Development server for fast builds and live reload.
- **JSON Server**: Mock backend for testing and storing event data.

## Installation

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** (Node Package Manager)

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run start
   ```

4. Start the JSON server:
   ```bash
   npm run server
   ```

5. Open the application in your browser:
   ```
   http://localhost:3000
   ```

## Usage
- **Event Creation**: Use the form to add new events.
- **Event Editing**: Modify existing events directly from the dashboard.
- **Event Deletion**: Remove events with a single click.
- **Navigation**: Explore the application using the header and navigation links.

## Folder Structure
```
├── index.html          # Entry point of the application
├── index.js            # Main JavaScript file
├── app/
│   ├── styles/
│   │   └── style.css   # Main CSS file
│   ├── db.json         # Mock database for JSON Server
│   └── components/     # JavaScript components (if applicable)
├── package.json        # Project configuration
├── README.md           # Project documentation
```

## Scripts
- `npm run start`: Starts the Vite development server.
- `npm run server`: Starts the JSON Server on port 3000.

## Responsive Design
The application is fully responsive:
- **Desktop**: The layout is optimized for larger screens with a fixed sidebar.
- **Mobile**: The layout adjusts to smaller screens, ensuring usability.

