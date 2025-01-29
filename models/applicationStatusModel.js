const pool = require('../config/db');

const ApplicationStatusModel = {

    async getCandidates(email, job, position) {
        let query = `
        SELECT a.id AS application_id, u.id AS user_id, u.email, ja.job_name, ja.position, a.status
        FROM user_applications a
        INNER JOIN users u ON a.user_id = u.id
        INNER JOIN job_applications ja ON a.job_id = ja.id
        WHERE 1=1
    `;
        const values = [];
        let index = 1;

        if (email) {
            query += ` AND LOWER(u.email) LIKE LOWER($${index++})`;
            values.push(`%${email.trim()}%`);
        }
        if (job) {
            query += ` AND LOWER(ja.job_name) LIKE LOWER($${index++})`;
            values.push(`%${job.trim()}%`);
        }
        if (position) {
            query += ` AND LOWER(ja.position) LIKE LOWER($${index++})`;
            values.push(`%${position.trim()}%`);
        }

        try {
            const result = await pool.query(query, values);
            return result.rows;
        }
        catch (error) {
            console.error('Error fetching candidates:', error);
            throw error;
        }
    },

    async updateApplicationStatus(applicationId, status) {
        const query = `
        UPDATE user_applications
        SET status = $1
        WHERE id = $2;
    `;

        try {
            await pool.query(query, [status, applicationId]);
        }
        catch (error) {
            console.error('Error updating application status:', error);
            throw error;
        }
    }
};

module.exports = ApplicationStatusModel;