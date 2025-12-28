import db from '../db.js';

export const loginAttendant = async (req, res) => {
    const { attendantId } = req.body;

    if (!attendantId) {
        return res.status(400).json({ message: 'Attendant ID is required' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM Attendant WHERE id = ?', [attendantId]);

        if (rows.length > 0) {
            const attendant = rows[0];
            res.json({
                success: true,
                attendant: {
                    id: attendant.id,
                    f_name: attendant.f_name,
                    l_name: attendant.l_name
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid Attendant ID' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
