# Asteroid Explorer

Asteroid Explorer is a Node.js web application that lets you explore real-time data about near-Earth asteroids using NASA's API. It provides a simple, visually appealing interface to learn more about asteroid sizes, speeds, and closest approach dates.

---

## 🚀 Features

- Fetches live asteroid data from NASA's Near Earth Object Web Service (NEO WS)
- Filter asteroids by date range
- Displays size, velocity, and approach date information
- Interactive EJS-based front-end
- Lightweight and fast Node.js + Express backend

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RabeelAhmed/asteroid-explorer.git
   cd asteroid-explorer

2. **Install dependencies**

bash
Copy
Edit
npm install
3. **Set up environment variables**

Copy the .env.example file to .env

Add your configuration values:

env
Copy
Edit
PORT=3000
NASA_API_KEY=your_nasa_api_key_here
You can get a free NASA API key from: https://api.nasa.gov

4. **Run the app**

bash
Copy
Edit
npm start
Or for development with auto-reload:

bash
Copy
Edit
npx nodemon server.js
5. **Open in your browser**

arduino
Copy
Edit
http://localhost:3000
