import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'db',
  port: 3306,
  user: 'root',
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export async function queryDB(sql: string, values?: any): Promise<any> {
  const [results] = await pool.execute(sql, values);
  return results;
}

export async function initializeDatabase() {
  try {
    const createPageTableSQL = `
    CREATE TABLE IF NOT EXISTS Page (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        parent_id INT,
        FOREIGN KEY (parent_id) REFERENCES Page(id)
    )
    `;
    const createIndexSQL = `
    CREATE INDEX idx_id ON Page(id);
    CREATE INDEX idx_parent_id ON Page(parent_id);
    `;

    await queryDB(createPageTableSQL);
    await queryDB(createIndexSQL);
    console.log('Page table initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}
