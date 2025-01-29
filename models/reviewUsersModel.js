const pool = require('../config/db');

const ReviewUsersModel = {

    async getCandidates(email, job, position) {
        let query = `
        SELECT a.id AS application_id, u.id AS user_id, u.email, ja.job_name, ja.position, r.final_grade
        FROM user_applications a
        INNER JOIN users u ON a.user_id = u.id
        INNER JOIN job_applications ja ON a.job_id = ja.id
        LEFT JOIN reviews r ON a.id = r.application_id
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

        query += ` ORDER BY r.final_grade DESC NULLS LAST, ja.job_name, ja.position`;

        try {
            const result = await pool.query(query, values);
            return result.rows;
        }
        catch (error) {
            console.error('Error fetching candidates:', error);
            throw error;
        }
    },

    async getCandidateReview(applicationId, userId) {
        const query = `
        SELECT r.grades, r.comment, r.final_grade
        FROM reviews r
        WHERE r.application_id = $1 AND r.user_id = $2;
    `;

        try {
            const result = await pool.query(query, [applicationId, userId]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Error fetching candidate review:', error);
            throw error;
        }
    },

    async saveCandidateReview(applicationId, userId, grades, comment) {
        const query = `
        INSERT INTO reviews (application_id, user_id, grades, comment, final_grade)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (application_id) DO UPDATE
        SET grades = EXCLUDED.grades,
            comment = EXCLUDED.comment,
            final_grade = EXCLUDED.final_grade;
    `;

        grades = grades.map(grade => Number(grade));
        const finalGrade = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;

        try {
            await pool.query(query, [applicationId, userId, JSON.stringify(grades), comment, finalGrade]);
        }
        catch (error) {
            console.error('Error saving candidate review:', error);
            throw error;
        }
    },

};

module.exports = ReviewUsersModel