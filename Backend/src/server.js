import express from 'express';
import cors from 'cors';
import db from './db.js';
import { getRoute } from './controllers/route.controller.js';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/users', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                p.id, 
                p.f_name, 
                p.l_name, 
                p.address_id,
                c.status_ride,
                a.x_coordinate,
                a.y_coordinate,
                a.full_address
            FROM Person p
            LEFT JOIN Confirmation c ON p.id = c.person_id
            LEFT JOIN Address a ON p.address_id = a.id
        `);
        res.json(rows);
    } catch (error) {
        console.error('DB ERROR:', error);
        res.status(500).json({
            message: error.message,
            code: error.code
        });
    }

});

app.get('/route', getRoute);

async function geocodeAddress(address) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&addressdetails=1`;
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'OnMyWay-App/1.0' }
        });

        if (response.data && response.data.length > 0) {
            const result = response.data[0];

            // Validation: Check if country_code is 'il' (Israel)
            if (result.address && result.address.country_code !== 'il') {
                return { error: 'Address must be in Israel' };
            }

            return {
                x: parseFloat(result.lat),
                y: parseFloat(result.lon),
                full_address: result.display_name
            };
        }
        return { error: 'Address not found' };
    } catch (error) {
        console.error('Geocoding error:', error);
        return { error: 'Failed to geocode address' };
    }
}

app.post('/addUser', async (req, res) => {
    const { f_name, l_name, address } = req.body;

    if (!f_name || !l_name || !address) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    try {
        // 1. Geocode
        const location = await geocodeAddress(address);
        if (location.error) {
            return res.status(400).json({ message: location.error });
        }

        // 2. Insert Address
        const [addrResult] = await db.query(
            'INSERT INTO Address (x_coordinate, y_coordinate, full_address) VALUES (?, ?, ?)',
            [location.x, location.y, location.full_address || address]
        );
        const addressId = addrResult.insertId;

        // 3. Insert Person
        const [personResult] = await db.query(
            'INSERT INTO Person (f_name, l_name, address_id) VALUES (?, ?, ?)',
            [f_name, l_name, addressId]
        );

        // 4. Create Confirmation (Default to true for now, or false)
        await db.query(
            'INSERT INTO Confirmation (person_id, status_ride) VALUES (?, ?)',
            [personResult.insertId, false] // Defaulting to False for new users as per logic
        );

        res.json({ success: true, id: personResult.insertId, ...location });

    } catch (error) {
        console.error('DB ERROR:', error);
        res.status(500).json({ message: error.message });
    }
});

app.delete('/deleteUser/:id', async (req, res) => {
    const personId = req.params.id;
    try {
        // Delete dependencies first (Confirmation)
        await db.query('DELETE FROM Confirmation WHERE person_id = ?', [personId]);

        // Delete Person
        await db.query('DELETE FROM Person WHERE id = ?', [personId]);

        // Optional: Delete Address if no one else uses it (Complex, skipping for now to keep it simple)

        res.json({ success: true });
    } catch (error) {
        console.error('DELETE ERROR:', error);
        res.status(500).json({ message: error.message });
    }
});
