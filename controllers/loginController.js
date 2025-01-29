require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const loginController = {

    async renderLoginPage(req, res) {

        return res.render('login', { error: null });
    },

    async userLogin(req, res) {

        const {email, password} = req.body;

        const user = await User.findUserByEmail(email);
        if (!user) {
           return res.render('login', {error: 'This user does not exist'});
        }

        const isPasswordValid = await User.comparePassword(password, user.password);
        if(!isPasswordValid) {
            return res.render('login', {error: 'Invalid password'});
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, username: user.username, role: user.uloga },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000
        });

        if (user.uloga === 'admin') {
            return res.redirect('/admin-welcome');
        } else if (user.uloga === 'korisnik') {
            return res.redirect('/user-welcome');
        }
    }
};

module.exports = loginController;