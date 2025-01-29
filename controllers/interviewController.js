const InterviewModel = require('../models/interviewModel');
const { sendEmail } = require('../utils/email');
const ApplicationStatusModel = require("../models/applicationStatusModel");

const InterviewController = {

    async scheduleInterview(req, res) {
        const { applicationId, userId } = req.params;
        const { interviewDate } = req.body;

        try {
            await InterviewModel.scheduleInterview(applicationId, userId, interviewDate);

            const subject = 'Interview Scheduled';
            const text = `Dear candidate,\n\nYour interview has been scheduled for ${new Date(interviewDate).toLocaleString()}.\n\nPlease confirm your attendance on the website.\n\nThank you!`;

            const userEmail = req.body.email;
            await sendEmail(userEmail, subject, text);

            res.redirect('/admin-welcome/interviews');
        }
        catch (error) {
            res.status(500).send('Error scheduling interview.' + error.message);
        }
    },

    async viewAllInterviews(req, res) {
        let { email, job, position } = req.query;
        try {
            const interviews = await InterviewModel.getAllInterviews(email, job, position);
            res.render('adminInterviews', { interviews, email, job, position});
        }
        catch (error) {
            res.status(500).send('Error fetching interviews.' + error.message);
        }
    },

    async deleteInterview(req, res) {
        const { interviewId } = req.params;

        try {
            await InterviewModel.deleteInterview(interviewId);
            res.redirect('/admin-welcome/interviews');
        }
        catch (error) {
            res.status(500).send('Error deleting interview.' + error.message);
        }
    },

    async viewUserInterviews(req, res) {
        const userId = req.user.userId;

        try {
            const interviews = await InterviewModel.getUserInterviews(userId);
            res.render('userInterviews', { interviews });
        }
        catch (error) {
            res.status(500).send('Error fetching interviews.' + error.message);
        }
    },

    async confirmInterviewAttendance(req, res) {
        const { interviewId } = req.params;

        try {
            await InterviewModel.confirmInterview(interviewId);

            res.redirect('/user-welcome/interviews');
        }
        catch (error) {
            res.status(500).send('Error confirming interview attendance.' + error.message);
        }
    },

    async getAllCandidates(req, res) {
        let { email, job, position } = req.query;

        email = email || '';
        job = job || '';
        position = position || '';

        try {
            const candidates = await ApplicationStatusModel.getCandidates(email, job, position);
            res.render('allInterviewCandidates', { candidates, email, job, position });
        }
        catch (error) {
            res.status(500).send('Error fetching candidates.' + error.message);
        }
    },
};

module.exports = InterviewController;
