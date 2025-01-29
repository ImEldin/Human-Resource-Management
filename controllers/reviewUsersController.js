const reviewUsersModel = require("../models/reviewUsersModel");

const ReviewUsersController = {

    async getAllCandidates(req, res) {
        let { email, job, position } = req.query;

        email = email || '';
        job = job || '';
        position = position || '';

        try {
            const candidates = await reviewUsersModel.getCandidates(email, job, position);
            res.render('adminCandidates', { candidates, email, job, position });
        }
        catch (error) {
            res.status(500).send('Error fetching candidates.' + error.message);
        }
    },

    async getCandidateReviewForm(req, res) {
        const { applicationId, userId } = req.params;

        try {
            const review = await reviewUsersModel.getCandidateReview(applicationId, userId) || { grades: [], comment: '' };
            res.render('candidateReview', { review, applicationId, userId });
        }
        catch (error) {
            res.status(500).send('Error fetching candidate review.' + error.message);
        }
    },

    async saveCandidateReview(req, res) {
        const { applicationId, userId } = req.params;
        const { grades, comment } = req.body;

        try {
            await reviewUsersModel.saveCandidateReview(applicationId, userId, grades, comment);
            res.redirect('/admin-welcome/candidates');
        }
        catch (error) {
            res.status(500).send('Error saving candidate review.' + error.message);
        }
    }
};

module.exports = ReviewUsersController;