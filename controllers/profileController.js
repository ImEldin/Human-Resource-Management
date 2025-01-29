const User = require('../models/user');

const profileController = {

    async renderProfilePage(req, res) {
        let user = await User.findUserByID(req.user.userId);
        if (!user) {
            user = {
                id: '',
                user_id: '',
                name: '',
                surname: '',
                dateofbirth: '',
                idnumber: '',
                gender: '',
                phone: '',
                address: '',
                municiplality: '',
                city: '',
                country: ''
            }
        }
        let userInfo = req.user;
        let education = await User.getUserByIDSchool(req.user.userId);
        if (!education) {
            education = {
                id: '',
                user_id: '',
                primary_school: '',
                middle_school: '',
                collage: ''
            }
        }
        let work = await  User.getUserWork(req.user.userId);
        let skills = await User.getUserSkills(req.user.userId);
        res.render('profile', {user, education, work, skills, userInfo});
    }
};

module.exports = profileController;