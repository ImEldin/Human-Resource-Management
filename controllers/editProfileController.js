const User = require('../models/user');
const express = require("express");

const editProfileController = {

    async renderEditProfilePage(req, res) {
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
        return res.render('profileEdit', {user, education});
    },

    async updateUserData(req, res) {

        let {name, surname, id, dateOfBirth, number, gender, address, municipality, city, country} = req.body;
        const userID = req.user.userId;

        name = name || null;
        surname = surname || null;
        id = id || null;
        dateOfBirth = dateOfBirth || null;
        number = number || null;
        gender = gender || null;
        address = address || null;
        municipality = municipality || null;
        city = city || null;
        country = country || null;

        try{
            const user = await User.findUserByID(userID);
            if(user) {
                await User.updateUserData(userID, {name, surname, dateOfBirth, id, gender, number, address, municipality, city, country});
            }
            else{
                await User.insertUserData(userID, {name, surname, dateOfBirth, id, gender, number, address, municipality, city, country});
            }

            return res.redirect('/user-welcome/profile/edit')
        }
        catch (error) {
            return res.status(404).send('Error while updating user data' + error.message);
        }
    },

    async updateUserEducation(req, res) {

        let {primary, middle, collage} = req.body;
        const userID = req.user.userId;

        primary = primary || null;
        middle = middle || null;
        collage = collage || null;

        try{
            const user = await User.getUserByIDSchool(userID);
            if(user) {
                await User.updateUserEducation(userID, {primary, middle, collage});
            }
            else{
                await User.insertUserEducation(userID, {primary, middle, collage});
            }

            return res.redirect('/user-welcome/profile/edit')
        }
        catch (error) {
            return res.status(404).send('Error while updating user data' + error.message);
        }
    },

    async updateUserSkillsAndWork(req, res) {

        let {work, skill} = req.body;
        const userID = req.user.userId;

        work = work || null;
        skill = skill || null;

        if(work === null && skill == null){
            res.redirect('/user-welcome/profile/edit')
        }
        else if(work === null){
            try{
                await User.insertUserSkill(userID, skill);
                return res.redirect('/user-welcome/profile/edit')
            }
            catch(error){
                return res.status(404).send('Error while updating user data' + error.message);
            }
        }
        else if(skill === null){
            try{
                await User.insertUserWork(userID, work);
                return res.redirect('/user-welcome/profile/edit')
            }
            catch(error){
                return res.status(404).send('Error while updating user data' + error.message);
            }
        }
        else{
            try{
                await User.insertUserSkill(userID, skill);
                await User.insertUserWork(userID, work);
                return res.redirect('/user-welcome/profile/edit')
            }
            catch(error){
                return res.status(404).send('Error while updating user data' + error.message);
            }
        }

    },

    async deleteSkill(req, res) {
        let skillId = req.params.id;

        try{
            await User.deleteUserSkill(skillId);

            return res.redirect('/user-welcome/profile');
        }
        catch (error) {
            return res.status(404).send('Error while deleting user data' + error.message);
        }

    },

    async deleteWork(req, res) {
        const workId = req.params.id;
        console.log(workId);

        try{
            await User.deleteUserWork(workId);

            return res.redirect('/user-welcome/profile');
        }
        catch (error) {
            return res.status(404).send('Error while deleting user data' + error.message);
        }

    }
};

module.exports = editProfileController;