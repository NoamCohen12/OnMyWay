import express from 'express';
import cors from 'cors';
import db from './db.js';
import { getRoute } from './controllers/route.controller.js';

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
        const [rows] = await db.query('SELECT * FROM Person');
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

app.get('/addUser', async (req, res) => {
    try {
        const [rows] = await db.query('INSERT INTO Person (f_name, l_name,address_id) VALUES (?, ?,?)', [req.query.f_name, req.query.l_name, req.query.address_id]);
        res.json(rows);
    } catch (error) {
        console.error('DB ERROR:', error);
        res.status(500).json({
            message: error.message,
            code: error.code
        });
    }
})
