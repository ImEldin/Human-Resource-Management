const pool = require('../config/db');

const FileModel = {
    async insertFile(userId, originalName, storedName, filePath, jobId) {
        const query = `
            INSERT INTO uploaded_files (user_ID, original_name, stored_name, file_path, job_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, original_name, stored_name, file_path;
        `;

        try {
            const result = await pool.query(query, [userId, originalName, storedName, filePath, jobId]);
            return result.rows[0];
        } catch (error) {
            console.error('Error inserting file:', error.message);
            throw error;
        }
    },

    async getFilesByUserId(userId) {
        const query = `SELECT * FROM uploaded_files WHERE user_ID = $1 AND job_id IS NULL;`;

        try {
            const result = await pool.query(query, [userId]);
            return result.rows;
        } catch (error) {
            console.error('Error retrieving files for user:', error.message);
            throw error;
        }
    },

    async getFileById(fileId) {
        const query = 'SELECT * FROM uploaded_files WHERE ID = $1';

        try {
            const result = await pool.query(query, [fileId]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Error fetching file by ID:', error.message);
            throw error;
        }
    },

    async deleteFileById(fileId, userId) {
        const query = `
            DELETE FROM uploaded_files
            WHERE id = $1 AND user_ID = $2
            RETURNING *;
        `;

        try {
            const result = await pool.query(query, [fileId, userId]);
            return result.rowCount > 0;
        }
        catch (error) {
            console.error('Error deleting file from database:', error.message);
            throw error;
        }
    }
}

module.exports = FileModel;
