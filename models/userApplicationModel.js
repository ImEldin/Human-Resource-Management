const pool = require('../config/db');

const UserApplicationModel = {
    async getActiveJobs(position, company) {
        const query = `
            SELECT * FROM job_applications
            WHERE status = 'active'
            AND (LOWER(position) LIKE LOWER($1) OR $1 IS NULL)
            AND (LOWER(company) LIKE LOWER($2) OR $2 IS NULL)
            ORDER BY closing_date DESC;
        `;
        const values = [`%${position || ''}%`, `%${company || ''}%`];

        try {
            const result = await pool.query(query, values);
            return result.rows;
        }
        catch (error) {
            console.error('Error fetching active jobs:', { position, company, error });
            throw error;
        }
    },

    async getJobDetails(jobId) {
        const jobQuery = 'SELECT * FROM job_applications WHERE id = $1;';
        const fieldsQuery = 'SELECT * FROM application_fields WHERE job_application_id = $1;';

        try {
            const job = await pool.query(jobQuery, [jobId]);
            const fields = await pool.query(fieldsQuery, [jobId]);

            if (job.rows.length === 0) {
                console.warn('Job not found:', { jobId });
                throw error;
            }

            return { job: job.rows[0], fields: fields.rows };
        }
        catch (error) {
            console.error('Error fetching job details:', { jobId, error });
            throw error;
        }
    },

    async saveApplication(userId, jobId) {
        const query = `
            INSERT INTO user_applications (user_id, job_id) VALUES ($1, $2) RETURNING id;
        `;
        try {
            const result = await pool.query(query, [userId, jobId]);
            return result.rows[0].id;
        }
        catch (error) {
            console.error('Error saving application:', { userId, jobId, error });
            throw error;
        }
    },

    async saveApplicationResponses(applicationId, dynamicFields) {
        const query = `
            INSERT INTO user_application_responses (user_application_id, field_name, field_value)
            VALUES ($1, $2, $3);
        `;

        try {
            const inserts = Object.entries(dynamicFields).map(([fieldName, fieldValue]) => {
                return pool.query(query, [applicationId, fieldName, fieldValue]);
            });

            await Promise.all(inserts);
        }
        catch (error) {
            console.error('Error saving application responses:', { applicationId, dynamicFields, error });
            throw error;
        }
    },

    async getUserApplications(userId) {
        const query = `
            SELECT ja.job_name, ja.position, ja.company, ua.submitted_at, ua.status 
            FROM user_applications ua
            INNER JOIN job_applications ja ON ua.job_id = ja.id
            WHERE ua.user_id = $1
            ORDER BY ua.submitted_at DESC;
        `;

        try {
            const result = await pool.query(query, [userId]);
            return result.rows;
        }
        catch (error) {
            console.error('Error fetching user applications:', { userId, error });
            throw error;
        }
    },

    async hasUserApplied(userId, jobId) {
        const query = `
        SELECT COUNT(*) AS count
        FROM user_applications
        WHERE user_id = $1 AND job_id = $2;
        `;

        try {
            const result = await pool.query(query, [userId, jobId]);
            return parseInt(result.rows[0].count, 10) > 0;
        }
        catch (error) {
            console.error('Error checking if user has applied for the job:', { userId, jobId, error });
            throw error;
        }
    }


};

module.exports = UserApplicationModel;
