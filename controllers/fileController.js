const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FileModel = require('../models/fileModel');
const error = require("multer/lib/multer-error");


const upload = multer({ dest: 'public/uploads/' });

exports.uploadFile = upload.single('document');

exports.handleFileUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const { originalname, filename } = req.file;

    try {
        const userId = req.user.userId;

        await FileModel.insertFile(userId, originalname, filename, `/uploads/${filename}`);

        res.redirect('/user-welcome/profile/edit');
    }
    catch (error) {
        return res.status(404).send('Error while uploading user files' + error.message);
    }
};


exports.getUserFiles = async (req, res) => {
    const userId = req.user.userId;

    try {
        const files = await FileModel.getFilesByUserId(userId);

        res.render('userFiles', { files });
    }
    catch (error) {
        res.status(500).send('Error retrieving files for user' + error.message);
    }
};

exports.downloadFile = async (req, res) => {
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
};

exports.deleteFile = async (req, res) => {
    const fileId = req.params.id;
    const userId = req.user.userId;

    try {
        const fileRecord = await FileModel.getFileById(fileId);

        if (!fileRecord || fileRecord.user_id !== userId) {
            return res.status(403).send('Unauthorized or file not found');
        }

        const isDeleted = await FileModel.deleteFileById(fileId, userId);
        if (!isDeleted) {
            return res.status(500).send('Error deleting file from the database');
        }

        const filePath = path.join(__dirname, '..', 'public', fileRecord.file_path);
        fs.unlink(filePath, (error) => {
            if (error) {
                return res.status(500).send('File deletion failed' + error.message);
            }

            res.redirect("/user-welcome/profile/files");
        });
    }
    catch (error) {
        res.status(500).send('Error deleting the file' + error.message);
    }
};