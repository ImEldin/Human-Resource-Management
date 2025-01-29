const MenageUsersModel = require('../models/MenageUsersModel');
const User = require("../models/user");
const FileModel = require("../models/fileModel");
const path = require("path");

const MenageUsersController = {

    async getUserApplicationDetails(req, res) {
        const { applicationId, userId } = req.params;

        try {
            const userDetails = await MenageUsersModel.getUserResponses(applicationId, userId);
            const uploadedFiles = await MenageUsersModel.getUploadedFiles(applicationId, userId);

            res.render('userApplicationDetails', { userDetails, uploadedFiles, applicationId, userId});
        } catch (error) {
            res.status(500).send('Error retrieving user application details.' + error.message);
        }
    },

    async userProfilePage(req, res) {
        const userId = req.params.userId;
        const applicationId = req.params.applicationId;
        let user = await User.findUserByID(userId);
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
        let education = await User.getUserByIDSchool(userId);
        if (!education) {
            education = {
                id: '',
                user_id: '',
                primary_school: '',
                middle_school: '',
                collage: ''
            }
        }
        let work = await  User.getUserWork(userId);
        let skills = await User.getUserSkills(userId);
        res.render('userProfile', {user, education, work, skills, applicationId, userId});
    },

    async getUserFiles(req, res) {
        const userId = req.params.userId;
        const applicationId = req.params.applicationId;

        try {
            const files = await FileModel.getFilesByUserId(userId);

            res.render('viewUserFiles', { files, userId, applicationId });
        }
        catch (error) {
            res.status(500).send('Error retrieving files for user' + error.message);
        }
    },

    async downloadUserFile(req, res) {

        const fileId = req.params.id;

        try {
            const fileRecord = await FileModel.getFileById(fileId);

            if (!fileRecord) {
                return res.status(404).send('File not found');
            }

            const filePath = path.join(__dirname, '..', 'public', fileRecord.file_path);

            res.download(filePath, fileRecord.original_name);
        }
        catch (error) {
            res.status(500).send('Error retrieving the file' + error.message);
        }
    }

};

module.exports = MenageUsersController;