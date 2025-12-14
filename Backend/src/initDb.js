import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
    try {
        // Create a connection without selecting a database first (to create it if needed, though schema.sql assumes DB exists or we use the env var)
        // Actually, our schema.sql just creates tables. So we need to connect to the DB specified in .env

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
            multipleStatements: true // Required to run multiple SQL statements from file
        });

        console.log('Connected to database.');

        const schemaPath = path.join(__dirname, '../DB_SQL/schema.sql');
        const schemaSql = await fs.readFile(schemaPath, 'utf8');

        console.log('Executing schema.sql...');
        await connection.query(schemaSql);

        console.log('Database initialized successfully!');
        await connection.end();

    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initDb();
