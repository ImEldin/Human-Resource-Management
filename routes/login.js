var express = require('express');
const loginController = require('../controllers/loginController');
const AuthMiddleware = require('../middleware/auth');
var router = express.Router();

router.get('/', AuthMiddleware.isLoggedIn, loginController.renderLoginPage);

router.post('/', loginController.userLogin);

module.exports = router;
