const bcrypt = require('bcrypt');
const pool = require('../config/db');

const User = {
    async createUser(email, username, password) {
        const query = `CALL insert_user($1, $2, $3, $4);`;
        try {
            await pool.query(query, [email, username, password, 'korisnik']);
        }
        catch (error) {
            console.error('Error creating user:', { email, username, error });
            throw error;
        }
    },

    async findUserByEmail(email) {
        const query = `SELECT * FROM get_user($1);`;
        try {
            const result = await pool.query(query, [email]);

            if (result.rows.length === 0) {
                return null;
            }

            return result.rows[0];
        }
        catch (error) {
            console.error('Error finding user by email:', { email, error });
            throw new error;
        }
    },

    async getUserLoginByID(userID) {
        const query = `SELECT * FROM users u WHERE u.id = $1;`;
        try {
            const result = await pool.query(query, [userID]);

            if (result.rows.length === 0) {
                return null;
            }

            return result.rows[0];
        }
        catch (error) {
            console.error('Error finding user by ID:', { userID, error });
            throw new error;
        }
    },

    async findUserByID(ID) {
        const query = `
        SELECT 
            ID, 
            user_ID, 
            name, 
            surname, 
            dateOfBirth::TEXT AS dateOfBirth, 
            idNumber, 
            gender, 
            phone, 
            address, 
            municiplality, 
            city, 
            country
        FROM user_data 
        WHERE user_ID = $1;
        `;
        try {
            const result = await pool.query(query, [ID]);

            if (result.rows.length === 0) {
                return null;
            }

            return result.rows[0];
        }
        catch (error) {
            console.error('Error finding user by ID:', { ID, error });
            throw error;
        }
    },

    async getUserByIDSchool(ID) {
        const query = `SELECT * FROM user_education WHERE user_ID = $1;`;
        try {
            const result = await pool.query(query, [ID]);

            if (result.rows.length === 0) {
                return null;
            }

            return result.rows[0];
        }
        catch (error) {
            console.error('Error finding user education by ID:', { ID, error });
            throw error;
        }
    },

    async insertUserData(user_id, { name, surname, dateOfBirth, id, gender, number, address, municipality, city, country }) {
        const query = `CALL insert_user_data($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`;
        try {
            await pool.query(query, [user_id, name, surname, dateOfBirth, id, gender, number, address, municipality, city, country]);
        }
        catch (error) {
            console.error('Error inserting user data:', { user_id, name, surname, error });
            throw error;
        }
    },

    async updateUserData(user_id, { name, surname, dateOfBirth, id, gender, number, address, municipality, city, country }) {
        const query = `CALL update_user_data($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`;
        try {
            await pool.query(query, [user_id, name, surname, dateOfBirth, id, gender, number, address, municipality, city, country]);
        }
        catch (error) {
            console.error('Error updating user data:', { user_id, name, surname, error });
            throw error;
        }
    },

    async insertUserEducation(user_id, { primary, middle, collage }) {
        const query = `CALL insert_user_education($1, $2, $3, $4);`;
        try {
            await pool.query(query, [user_id, primary, middle, collage]);
        }
        catch (error) {
            console.error('Error inserting user education:', { user_id, primary, middle, collage, error });
            throw error;
        }
    },

    async updateUserEducation(user_id, { primary, middle, collage }) {
        const query = `CALL update_user_education($1, $2, $3, $4);`;
        try {
            await pool.query(query, [user_id, primary, middle, collage]);
        }
        catch (error) {
            console.error('Error updating user education:', { user_id, primary, middle, collage, error });
            throw error;
        }
    },

    async insertUserSkill(user_id, skill) {
        const query = `CALL insert_user_skill($1, $2);`;
        try {
            await pool.query(query, [user_id, skill]);
        }
        catch (error) {
            console.error('Error inserting user skill:', { user_id, skill, error });
            throw error;
        }
    },

    async getUserSkills(user_id) {
        const query = `SELECT * FROM get_user_skills($1);`;
        try {
            const result = await pool.query(query, [user_id]);
            return result.rows;
        }
        catch (error) {
            console.error('Error retrieving user skills:', { user_id, error });
            throw error;
        }
    },

    async deleteUserSkill(skill_id) {
        const query = `CALL delete_user_skill($1);`;
        try {
            await pool.query(query, [skill_id]);
        }
        catch (error) {
            console.error('Error deleting user skill:', { skill_id, error });
            throw error;
        }
    },

    async insertUserWork(user_id, work) {
        const query = `CALL insert_user_work($1, $2);`;
        try {
            await pool.query(query, [user_id, work]);
        }
        catch (error) {
            console.error('Error inserting user work:', { user_id, work, error });
            throw error;
        }
    },

    async getUserWork(user_id) {
        const query = `SELECT * FROM get_user_work($1);`;
        try {
            const result = await pool.query(query, [user_id]);
            return result.rows;
        }
        catch (error) {
            console.error('Error retrieving user work:', { user_id, error });
            throw error;
        }
    },

    async deleteUserWork(work_id) {
        const query = `CALL delete_user_work($1);`;
        try {
            await pool.query(query, [work_id]);
        }
        catch (error) {
            console.error('Error deleting user work:', { work_id, error });
            throw error;
        }
    },

    async comparePassword(inputPassword, storedPassword) {
        try {
            return await bcrypt.compare(inputPassword, storedPassword);
        }
        catch (error) {
            console.error('Error comparing passwords:', { error });
            throw error;
        }
    }
};

module.exports = User;
