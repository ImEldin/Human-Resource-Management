var express = require('express');
var router = express.Router();

const AuthMiddleware = require('../middleware/auth');
const jobApplicationController = require('../controllers/jobApplicationController');
const userApplicationController = require("../controllers/userApplicationController");
const menageUsersController = require("../controllers/menageUsersController");
const reviewUsersController = require("../controllers/reviewUsersController");
const applicationStatusController = require('../controllers/applicationStatusController');
const interviewController = require('../controllers/interviewController');
const EmailController = require('../controllers/EmailController');

router.get('/', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin') ,function(req, res, next) {
    let mail = req.user.email;
    res.render('adminWelcome', { mail: mail });
});

router.get('/create', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), jobApplicationController.renderJobCreationPage);

router.post('/create', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), jobApplicationController.createJobApplication);

router.get('/application-list', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), jobApplicationController.listJobApplications);

router.post('/application-archive/:id', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), jobApplicationController.archiveJobApplication);

router.get('/jobs', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), userApplicationController.viewActiveJobs);

router.get('/all-applications', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), jobApplicationController.allJobApplications);

router.get('/all-applications/:id', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), jobApplicationController.getUsersForJob);

router.get('/all-applications/:applicationId/user/:userId', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), menageUsersController.getUserApplicationDetails);

router.get('/all-applications/:applicationId/user/:userId/profile', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), menageUsersController.userProfilePage);

router.get('/all-applications/:applicationId/user/:userId/files', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), menageUsersController.getUserFiles);

router.get('/all-applications/:applicationId/user/:userId/files/download/:id', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), menageUsersController.downloadUserFile);

router.get('/candidates', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), reviewUsersController.getAllCandidates);

router.get('/candidates/:applicationId/user/:userId/review', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), reviewUsersController.getCandidateReviewForm);

router.post('/candidates/:applicationId/user/:userId/review', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), reviewUsersController.saveCandidateReview);

router.get('/application-status', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), applicationStatusController.getAllCandidates);

router.post('/application-status/:applicationId', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), applicationStatusController.updateApplicationStatus);

router.get('/interviews', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), interviewController.viewAllInterviews);

router.get('/interviews/create', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), interviewController.getAllCandidates);

router.post('/interviews/create/:applicationId/user/:userId', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), interviewController.scheduleInterview);

router.post('/interviews/:interviewId/delete', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), interviewController.deleteInterview);

router.get('/email-user', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), EmailController.getAllCandidates);

router.get('/email-user/user/:userId', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), EmailController.renderAdminEmailPage);

router.post('/email-user/user/:userId', AuthMiddleware.isAuthenticated, AuthMiddleware.authorizeRole('admin'), EmailController.sendEmailFromAdmin);

module.exports = router;
