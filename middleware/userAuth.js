const User = require('../model/userModel');

const isLogged = (req, res, next) => {
    if (req.session.user) {
        User.findById({ _id: req.session.user }).lean()
            .then((data) => {
                if (!data.isBlocked) {
                    next();
                } else {
                    res.redirect('/logout');
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Server Error');
            });
    } else {
        res.redirect('/login');
    }
}

const adminLoggedIn = (req, res, next) => {
    if (req.session.adminLoggedIn) {  // Assuming adminLoggedIn is a Boolean in session
        next();
    } else {
        res.redirect('/admin/login');
    }
}

module.exports = {
    isLogged,
    adminLoggedIn
}
