const pool = require('../config/db');

const MenageUsersModel = {

    async getUserResponses(applicationId, userId) {

        const query = `
        SELECT r.field_name, r.field_value, u.email
        FROM user_application_responses r
        INNER JOIN user_applications a ON r.user_application_id = a.id
        INNER JOIN users u ON a.user_id = u.id
        WHERE a.job_id = $1 AND u.id = $2;
    `;

        try {
            const result = await pool.query(query, [applicationId, userId]);
            return result.rows;
        }
        catch (error) {
            console.error('Error fetching user responses for application and user:', { applicationId, userId, error });
            throw error;
        }
    },

    async getUploadedFiles(applicationId, userId) {
        const query = `
        SELECT original_name, id
        FROM uploaded_files
        WHERE user_id = $1 AND job_id = $2;
    `;

        try {
            const result = await pool.query(query, [userId, applicationId]);
            return result.rows;
        }
        catch (error) {
            console.error('Error fetching uploaded files for application and user:', { applicationId, userId, error });
            throw error;
        }
    }
};

module.exports = MenageUsersModel;