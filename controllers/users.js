
const userStatus = ['landlord/landlady', 'student'];
const User = require('../models/user');


module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register', { userStatus });
};

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password, tel, userStatus } = req.body;
        const user = new User({ email, username, userStatus, phoneNumber: tel });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Hostel4You');
            res.redirect('/lodges');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/lodges';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/lodges');
    });
};
