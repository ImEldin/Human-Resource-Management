const { sendEmail } = require('../utils/email');
const reviewUsersModel = require("../models/reviewUsersModel");
const User = require('../models/user');

const EmailController = {

    renderAdminEmailPage(req, res) {
        const userId = req.params.userId;
        res.render('adminSendEmail', {userId});
    },

    renderUserEmailPage(req, res) {
        res.render('userSendEmail');
    },

    async sendEmailFromAdmin(req, res) {
        const user = await User.getUserLoginByID(req.params.userId);
        const to = user.email;
        const { subject, message } = req.body;

        try {
            await sendEmail(to, subject, message, );
            res.redirect('/admin-welcome/email-user');
        }
        catch (error) {
            res.status(500).send('Failed to send email' + error);
        }
    },

    async sendEmailFromUser(req, res) {
        const { subject, message } = req.body;
        const adminEmail = process.env.EMAIL_USER;
        const userEmail = req.user.email;

        try {
            await sendEmail(adminEmail, subject, message, userEmail);
            res.redirect('/user-welcome');
        }
        catch (error) {
            res.status(500).send('Failed to send email' + error.message);
        }
    },

    async getAllCandidates(req, res) {
        let { email, job, position } = req.query;

        email = email || '';
        job = job || '';
        position = position || '';

        try {
            const candidates = await reviewUsersModel.getCandidates(email, job, position);
            res.render('adminEmailUser', { candidates, email, job, position });
        }
        catch (error) {
            res.status(500).send('Error fetching candidates.' + error.message);
        }
    },
};

module.exports = EmailController;
