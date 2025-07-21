const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// NASA API
const NASA_FEED_API = 'https://api.nasa.gov/neo/rest/v1/feed';
const NASA_BROWSE_API = 'https://api.nasa.gov/neo/rest/v1/neo/browse';
const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

// Utility to format asteroid data
function formatAsteroid(asteroid) {
    // Find the next (future) approach only
    const today = new Date();
    const nextApproach = asteroid.close_approach_data?.find(approach =>
        new Date(approach.close_approach_date) >= today
    );

    // Skip asteroids without future approach
    if (!nextApproach) return null;

    const estDiameter = asteroid.estimated_diameter.kilometers;
    const sizeMin = estDiameter.estimated_diameter_min.toFixed(2);
    const sizeMax = estDiameter.estimated_diameter_max.toFixed(2);
    const size = `${sizeMin} - ${sizeMax}`;
    const sizeCategory = parseFloat(sizeMax) > 1 ? 'a city block' : 'a bus';

    const speed = nextApproach.relative_velocity?.kilometers_per_hour
        ? Number(nextApproach.relative_velocity.kilometers_per_hour).toFixed(0)
        : 'Unknown';

    const distance = nextApproach.miss_distance?.kilometers
        ? Number(nextApproach.miss_distance.kilometers).toLocaleString()
        : 'Unknown';

    return {
        name: asteroid.name,
        id: asteroid.id,
        size,
        sizeCategory,
        distance,
        speed,
        speedComment: parseFloat(speed) > 50000
            ? 'Zooming through space 🚀'
            : 'Steady and slow 🛸',
        date: nextApproach.close_approach_date
    };
}



// Home Route
app.get('/', async (req, res) => {
    try {
        const today = new Date();
        const response = await axios.get(NASA_BROWSE_API, {
            params: {
                api_key: API_KEY,
                page: 0,
                size: 20
            }
        });

        const allAsteroids = response.data.near_earth_objects;

        const futureAsteroids = allAsteroids.filter(asteroid =>
            asteroid.close_approach_data?.some(approach =>
                new Date(approach.close_approach_date) >= today
            )
        );

        const formattedAsteroids = futureAsteroids
    .map(formatAsteroid)
    .filter(a => a); // removes any nulls


        res.render('index', {
            title: 'Asteroid Explorer',
            heading: '🌌 Asteroid Explorer',
            subheading: 'Discover near-Earth asteroids and their incredible stats',
            asteroids: formattedAsteroids
        });
    } catch (err) {
        console.error('Error:', err.message);
        res.render('index', {
            title: 'Asteroid Explorer',
            heading: '🌌 Asteroid Explorer',
            subheading: 'Error fetching asteroid data',
            asteroids: []
        });
    }
});

// ✅ API Route for search by date
app.get('/api/asteroids', async (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Missing date parameter' });

    try {
        const response = await axios.get(NASA_FEED_API, {
            params: {
                api_key: API_KEY,
                start_date: date,
                end_date: date
            }
        });

        res.json(response.data);
    } catch (err) {
        console.error('API Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch asteroid data for date' });
    }
});

// ✅ API Route for upcoming asteroids from today
app.get('/api/browse-asteroids', async (req, res) => {
    const { date } = req.query;
    const today = new Date(date || new Date());

    try {
        const response = await axios.get(NASA_BROWSE_API, {
            params: {
                api_key: API_KEY,
                page: 0,
                size: 20
            }
        });

        const allAsteroids = response.data.near_earth_objects;

        const futureAsteroids = allAsteroids.filter(asteroid =>
            asteroid.close_approach_data?.some(approach =>
                new Date(approach.close_approach_date) >= today
            )
        );

        res.json({ near_earth_objects: futureAsteroids });
    } catch (err) {
        console.error('Browse API Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch upcoming asteroids' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

