const pool = require('../config/db');

const InterviewModel = {

    async scheduleInterview(applicationId, userId, interviewDate) {
        const query = `
        INSERT INTO interviews (application_id, user_id, interview_date)
        VALUES ($1, $2, $3);
    `;

        try {
            await pool.query(query, [applicationId, userId, interviewDate]);
        }
        catch (error) {
            console.error('Error scheduling interview:', error);
            throw error;
        }
    },

    async getAllInterviews(email, job, position) {
        let query = `
        SELECT i.id, i.interview_date, i.status, u.email, ja.job_name, ja.position
        FROM interviews i
        INNER JOIN user_applications ua ON i.application_id = ua.id
        INNER JOIN users u ON i.user_id = u.id
        INNER JOIN job_applications ja ON ua.job_id = ja.id
    `;

        const values = [];
        let index = 1;

        // Add filtering conditions dynamically
        const conditions = [];
        if (email) {
            conditions.push(`LOWER(u.email) LIKE LOWER($${index++})`);
            values.push(`%${email.trim()}%`);
        }
        if (job) {
            conditions.push(`LOWER(ja.job_name) LIKE LOWER($${index++})`);
            values.push(`%${job.trim()}%`);
        }
        if (position) {
            conditions.push(`LOWER(ja.position) LIKE LOWER($${index++})`);
            values.push(`%${position.trim()}%`);
        }

        // Append WHERE clause only if there are conditions
        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` ORDER BY i.interview_date ASC`;

        try {
            const result = await pool.query(query, values);
            return result.rows;
        }
        catch (error) {
            console.error('Error fetching interviews:', error);
            throw error;
        }
    },

    async deleteInterview(interviewId) {
        const query = `
        DELETE FROM interviews
        WHERE id = $1;
    `;

        try {
            await pool.query(query, [interviewId]);
        }
        catch (error) {
            console.error('Error deleting interview:', error);
            throw error;
        }
    },

    async confirmInterview(interviewId) {
        const query = `
        UPDATE interviews
        SET status = 'confirmed'
        WHERE id = $1;
    `;

        try {
            await pool.query(query, [interviewId]);
        }
        catch (error) {
            console.error('Error confirming interview:', error);
            throw error;
        }
    },

    async getUserInterviews(userId) {
        const query = `
        SELECT 
            i.id AS interview_id,
            i.interview_date,
            i.status,
            ja.company AS company_name,
            ja.job_name AS job_title
        FROM interviews i
        INNER JOIN user_applications ua ON i.application_id = ua.id
        INNER JOIN job_applications ja ON ua.job_id = ja.id
        WHERE i.user_id = $1
        ORDER BY i.interview_date ASC;
    `;

        try {
            const result = await pool.query(query, [userId]);
            return result.rows;
        }
        catch (error) {
            console.error('Error fetching user interviews:', error);
            throw error;
        }
    }
};

module.exports = InterviewModel;