var express = require('express');
var router = express.Router();

const AuthMiddleware = require('../middleware/auth');
const editProfileController = require('../controllers/editProfileController');
const profileController = require('../controllers/profileController');
const fileController = require('../controllers/fileController');
const userApplicationController = require('../controllers/userApplicationController');
const interviewController = require('../controllers/interviewController');
const EmailController = require('../controllers/EmailController');


router.get('/', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('korisnik'), function(req, res, next) {
    res.render('userWelcome', {username: req.user.username, email: req.user.email});
});

router.get('/profile', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('korisnik'), profileController.renderProfilePage);

router.post('/profile/delete-skill/:id', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('korisnik'), editProfileController.deleteSkill);

router.post('/profile/delete-work/:id', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('korisnik'), editProfileController.deleteWork);

router.get('/profile/edit', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('korisnik'), editProfileController.renderEditProfilePage);

router.post('/profile/edit-basic', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('korisnik'), editProfileController.updateUserData);

router.post('/profile/edit-education', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('korisnik'), editProfileController.updateUserEducation);

router.post('/profile/edit-work-and-skills', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('korisnik'), editProfileController.updateUserSkillsAndWork);

router.post('/profile/upload', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('korisnik'), fileController.uploadFile, fileController.handleFileUpload);

router.get('/profile/files', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('korisnik'), fileController.getUserFiles);

router.get('/profile/files/download/:id', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('korisnik'), fileController.downloadFile);

router.post('/profile/files/delete/:id', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('korisnik'), fileController.deleteFile);

router.get('/jobs', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('korisnik'), userApplicationController.viewActiveJobs);

router.get('/jobs/:id', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('korisnik'), userApplicationController.viewJobForm);

router.post('/jobs/:id/apply', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('korisnik'), userApplicationController.uploadMiddleware, userApplicationController.submitJobApplication);

router.get('/applications', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('korisnik'), userApplicationController.viewUserApplications);

router.get('/interviews', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('korisnik'), interviewController.viewUserInterviews);

router.post('/interviews/:interviewId/confirm', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('korisnik'), interviewController.confirmInterviewAttendance);

router.get('/send-email', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('korisnik'), EmailController.renderUserEmailPage);

router.post('/send-email', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('korisnik'), EmailController.sendEmailFromUser);

module.exports = router;
