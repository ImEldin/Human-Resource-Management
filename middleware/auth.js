const jwt = require('jsonwebtoken');

const AuthMiddleware = {

    isLoggedIn(req, res, next) {
        const token = req.cookies.token;

        if (token) {
            try {
                req.user = jwt.verify(token, process.env.JWT_SECRET);

                if (req.user.role === 'admin') {
                    return res.redirect('/admin-welcome');
                } else if (req.user.role === 'korisnik') {
                    return res.redirect('/user-welcome');
                }
            }
            catch (error) {
                return res.status(400).send('Invalid token: ' + error.message);
            }
        }

        next();
    },

    isAuthenticated(req, res, next) {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect('/');
        }

        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET);
            next();
        } catch (error) {
            return res.status(400).send('Invalid token: ' + error.message);
        }
    },

    authorizeRole(role) {
        return (req, res, next) => {
            if (req.user && req.user.role === role) {
                next();
            } else {
                res.status(403).send('Access denied');
            }
        };
    }
}

module.exports = AuthMiddleware;