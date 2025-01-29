const  UserApplicationModel = require('../models/userApplicationModel');
const multer = require('multer');
const FileModel = require('../models/fileModel');

const upload = multer({ dest: 'public/uploads/' }).any();

const UserApplicationController = {
    async viewActiveJobs(req, res) {
        const { position, company } = req.query;

        try {
            const jobs = await UserApplicationModel.getActiveJobs(position, company);

            const formattedJobs = jobs.map(job => ({
                ...job,
                closing_date: job.closing_date.toISOString().split('T')[0], // Format as YYYY-MM-DD
            }));

            res.render('activeJobs', { jobs: formattedJobs });
        } catch (error) {
            res.status(500).send('Error retrieving jobs: ' + error.message);
        }
    },

    async viewJobForm(req, res) {
        const jobId = req.params.id;

        try {
            const jobDetails = await UserApplicationModel.getJobDetails(jobId);
            res.render('jobForm', { job: jobDetails.job, fields: jobDetails.fields });
        } catch (error) {
            res.status(500).send('Error loading job form: ' + error.message);
        }
    },

    async submitJobApplication(req, res) {
        const jobId = req.params.id;
        const userId = req.user.userId;
        const { fields: dynamicFields = {} } = req.body;

        try {
            const hasApplied = await UserApplicationModel.hasUserApplied(userId, jobId);

            if (hasApplied) {
                return res.status(400).send('You have already applied for this job.');
            }

            const applicationId = await UserApplicationModel.saveApplication(userId, jobId);

            if (dynamicFields) {
                await UserApplicationModel.saveApplicationResponses(applicationId, dynamicFields);
            }

            if (req.files) {
                    for (const file of req.files) {
                        await FileModel.insertFile(userId, file.originalname, file.filename, `/uploads/${file.filename}`, jobId);
                    }

            }

            res.redirect('/user-welcome/applications');
        }
        catch (error) {
            res.status(500).send('Error submitting application: ' + error.message);
        }
    },

    async viewUserApplications(req, res) {
        const userId = req.user.userId;

        try {
            const applications = await UserApplicationModel.getUserApplications(userId);

            const formattedApplications = applications.map(app => ({
                ...app,
                submitted_at: app.submitted_at.toISOString().split('T')[0], // Format as YYYY-MM-DD
            }));

            res.render('userApplication', { applications: formattedApplications });
        }
        catch (error) {
            res.status(500).send('Error retrieving applications: ' + error.message);
        }
    }
}

module.exports = {
    ...UserApplicationController,
    uploadMiddleware: upload,
};