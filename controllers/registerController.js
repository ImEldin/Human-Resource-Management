const bcrypt = require('bcrypt');
const User = require('../models/user');

const registerController = {

    async renderRegisterPage(req, res) {
        return res.render('register', { error: null });
    },

    async registerUser(req, res) {

        const { email, username, password } = req.body;

        try{
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.findUserByEmail(email);
            if(user) {
                return res.render('register', {error: 'User already exists'});
            }

            await User.createUser(email, username, hashedPassword);

            res.redirect('/');
        }
        catch (error) {
            return res.render('register', {error: 'Error creating user'});
        }
    }
};

module.exports = registerController;