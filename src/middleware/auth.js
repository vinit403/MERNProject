const jwt = require('jsonwebtoken');
const Register = require('../models/registers');


// if you use middleware then next keyword compalsory to continue the process

const auth = async(req, res, next) => {
    try {

        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);

        const user = await Register.findOne({ _id: verifyUser._id })
        console.log(user);

        next();

    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports = auth;