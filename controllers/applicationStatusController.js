const ApplicationStatusModel = require('../models/applicationStatusModel');
const { sendEmail } = require('../utils/email');
const express = require("express");

const ApplicationStatusController = {

    async getAllCandidates(req, res) {
        let { email, job, position } = req.query;

        email = email || '';
        job = job || '';
        position = position || '';

        try {
            const candidates = await ApplicationStatusModel.getCandidates(email, job, position);
            res.render('candidatesApplicationStatus', { candidates, email, job, position });
        }
        catch (error) {
            res.status(500).send('Error fetching candidates.' + error.message);
        }
    },

    async updateApplicationStatus(req, res) {

        const { applicationId } = req.params;
        const { status, email } = req.body;

        try {

            await ApplicationStatusModel.updateApplicationStatus(applicationId, status);

            const subject = `Your application status has been updated to ${status}`;
            const text = `Dear applicant,\n\nYour application status has been updated to: ${status}.\n\nThank you for your interest.`;
            console.log(email);
            await sendEmail(email, subject, text);

            res.redirect('/admin-welcome/application-status');
        }
        catch (error) {
            res.status(500).send('Error updating application status.' + error.message);
        }
    }
};

module.exports = ApplicationStatusController;