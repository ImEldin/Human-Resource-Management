const pool = require('../config/db');

const JobApplicationModel = {
    async createJobApplication(jobName, position, company, closingDate, jobDescription) {
        const query = `
            INSERT INTO job_applications (job_name, position, company, closing_date, job_description, status)
            VALUES ($1, $2, $3, $4, $5, 'active')
            RETURNING id;
        `;
        const values = [jobName, position, company, closingDate, jobDescription];

        try {
            const result = await pool.query(query, values);
            return result.rows[0].id;
        }
        catch (error) {
            console.error('Error creating job application:', {
                jobName, position, company, closingDate, jobDescription, error
            });
            throw error;
        }
    },

    async addApplicationField(jobApplicationId, fieldName, isRequired, isFileUpload) {
        const query = `
            INSERT INTO application_fields (job_application_id, field_name, is_required, is_file_upload)
            VALUES ($1, $2, $3, $4);
        `;
        const values = [jobApplicationId, fieldName, isRequired, isFileUpload];

        try {
            await pool.query(query, values);
        }
        catch (error) {
            console.error('Error adding application field:', {
                jobApplicationId, fieldName, isRequired, error
            });
            throw error;
        }
    },

    async getFilteredJobApplications(status, company, position) {
        let query = `SELECT * FROM job_applications WHERE status = $1`;
        const values = [status];
        let index = 2;

        if (company && company.trim() !== '') {
            query += ` AND company ILIKE $${index++}`;
            values.push(`%${company.trim()}%`);
        }

        if (position && position.trim() !== '') {
            query += ` AND position ILIKE $${index++}`;
            values.push(`%${position.trim()}%`);
        }

        query += ` ORDER BY closing_date DESC`;

        try {
            const result = await pool.query(query, values);
            return result.rows;
        }
        catch (error) {
            console.error('Error fetching filtered job applications:', {
                status, company, position, error
            });
            throw error;
        }
    },

    async archiveApplication(applicationId) {
        const query = `
            UPDATE job_applications
            SET status = 'archived'
            WHERE id = $1 AND status = 'active';
        `;

        try {
            const result = await pool.query(query, [applicationId]);
            if (result.rowCount === 0) {
                console.warn('No job application archived:', { applicationId });
                throw error;
            }
        }
        catch (error) {
            console.error('Error archiving job application:', { applicationId, error });
            throw error;
        }
    },

    async fetchApplicantsForJob(jobId, { skill, work, education, status, grade }) {
        let query = `
        SELECT DISTINCT 
            u.id, 
            u.email, 
            us.skill, 
            uw.work, 
            ue.collage AS education, 
            ua.status, 
            r.final_grade AS grade
        FROM users u
        LEFT JOIN user_applications ua ON u.id = ua.user_id
        LEFT JOIN user_skills us ON u.id = us.user_id
        LEFT JOIN user_work uw ON u.id = uw.user_id
        LEFT JOIN user_education ue ON u.id = ue.user_id
        LEFT JOIN reviews r ON ua.id = r.application_id
        WHERE ua.job_id = $1
    `;

        const conditions = [];
        const values = [jobId];
        let index = 2;

        if (skill) {
            conditions.push(`us.skill ILIKE $${index++}`);
            values.push(`%${skill.trim()}%`);
        }
        if (work) {
            conditions.push(`uw.work ILIKE $${index++}`);
            values.push(`%${work.trim()}%`);
        }
        if (education) {
            conditions.push(`ue.collage ILIKE $${index++}`);
            values.push(`%${education.trim()}%`);
        }
        if (status) {
            conditions.push(`ua.status = $${index++}`);
            values.push(status);
        }
        if (grade) {
            conditions.push(`r.final_grade = $${index++}`);
            values.push(grade);
        }

        if (conditions.length > 0) {
            query += ` AND ${conditions.join(' AND ')}`;
        }

        query += ' ORDER BY u.email';

        try {
            const result = await pool.query(query, values);
            return result.rows;
        }
        catch (error) {
            console.error('Error fetching applicants for job:', error);
            throw error;
        }
    }
};

module.exports = JobApplicationModel;
