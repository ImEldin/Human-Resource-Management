var express = require('express');
const registerController = require('../controllers/registerController');
var router = express.Router();

router.get('/', registerController.renderRegisterPage);

router.post('/', registerController.registerUser);

module.exports = router;
