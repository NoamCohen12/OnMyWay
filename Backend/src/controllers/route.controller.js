import db from '../db.js';
import { buildRoute } from '../services/route.service.js';

export async function getRoute(req, res) {
    try {
        const [rows] = await db.query(`
      SELECT p.f_name, p.l_name, a.x_coordinate, a.y_coordinate
      FROM Person p
      JOIN Address a ON p.address_id = a.id
      JOIN Confirmation c on p.id = c.person_id
      WHERE c.status_ride = true
    `);

        const points = rows.map(r => ({
            name: `${r.f_name} ${r.l_name}`,
            x: r.x_coordinate,
            y: r.y_coordinate
        }));

        const startPoint = { x: 32.08, y: 34.78 };

        const route = buildRoute(startPoint, points);

        res.json(route);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to calculate route' });
    }
}
