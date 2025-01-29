const JobApplicationModel = require('../models/jobApplicationModel');

const jobApplicationController = {
    async renderJobCreationPage(req, res) {
        res.render('createJobApplication', { error: null });
    },

    async createJobApplication(req, res) {
        const { jobName, position, company, closingDate, jobDescription, fields } = req.body;

        try {
            const jobApplicationId = await JobApplicationModel.createJobApplication(jobName, position, company, closingDate, jobDescription);

            console.log(fields);

            if (Array.isArray(fields)) {
                for (const field of fields) {
                    const fieldName = field.name;
                    const isRequired = field.isRequired === "true";
                    const isFileUpload = field.isFileUpload === "true";
                    await JobApplicationModel.addApplicationField(jobApplicationId, fieldName, isRequired, isFileUpload);
                }
            } else if (fields) {
                const fieldName = fields.name;
                const isRequired = fields.isRequired === "true";
                const isFileUpload = fields.isFileUpload === "true";
                await JobApplicationModel.addApplicationField(jobApplicationId, fieldName, isRequired, isFileUpload);
            }

            res.redirect('/admin-welcome/create');
        }
        catch (error) {
            res.status(500).render('createJobApplication', { error: 'Error creating job application: ' + error.message });
        }
    },

    async listJobApplications(req, res) {
        const status = req.query.status || 'active';
        const company = req.query.company || '';
        const position = req.query.position || '';

        try {
            const jobApplications = await JobApplicationModel.getFilteredJobApplications(status, company, position);

            const formattedApplications = jobApplications.map(app => {
                return {
                    ...app,
                    closing_date: new Date(app.closing_date).toLocaleDateString('en-GB'),
                };
            });

            res.render('jobApplicationList', { formattedApplications, status, company, position });
        }
        catch (error) {
            res.status(500).send('Error retrieving job applications: ' + error.message);
        }
    },

    async allJobApplications(req, res) {
        const status = req.query.status || 'active';
        const company = req.query.company || '';
        const position = req.query.position || '';

        try {
            const jobApplications = await JobApplicationModel.getFilteredJobApplications(status, company, position);

            const formattedApplications = jobApplications.map(app => {
                return {
                    ...app,
                    closing_date: new Date(app.closing_date).toLocaleDateString('en-GB'),
                };
            });

            console.log(formattedApplications);
            res.render('menageUsers', { formattedApplications, status, company, position});
        }
        catch (error) {
            res.status(500).send('Error retrieving job applications: ' + error.message);
        }
    },

    async archiveJobApplication(req, res) {
        const applicationId = req.params.id;

        try {
            await JobApplicationModel.archiveApplication(applicationId);
            res.redirect('/admin-welcome/application-list?status=active');
        }
        catch (error) {
            res.status(500).send('Error archiving the job application: ' + error.message);
        }
    },

    async getUsersForJob(req, res) {
        const { id } = req.params;
        const { skill, work, education, status, grade } = req.query;

        try {
            const users = await JobApplicationModel.fetchApplicantsForJob(id, { skill, work, education, status, grade });

            res.render('userByJob', { users, jobId: id, filters: { skill, work, education, status, grade } });
        }
        catch (error) {
            res.status(500).send('Error fetching applicants.' + error.message);
        }
    }
};

module.exports = jobApplicationController;
