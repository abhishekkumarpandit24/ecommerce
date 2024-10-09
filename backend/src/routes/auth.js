const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user")
const { validateSignupData } = require('../utils/validation')

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    // console.log("req", req.body)
    // creating a new instance of the user model
    const { password, firstName, lastName, emailId, gender, about, age, } = req.body;
    try {
        //
        validateSignupData(req);

        // encrypt password
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            password: passwordHash,
            emailId,
            gender,
            about,
            age
        });

        await user.save();

        // Automatically log the user in (generate JWT token)
        const token = await user.getJWT();

        // Set token in cookies
        res.cookie('token', token, {
            expires: new Date(Date.now() + 8 * 3600000), // Expires in 8 hours
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production' // Only send the cookie over HTTPS in production
        });

        // Send response with token and user information
        res.send({
            message: "User added successfully and logged in!",
            accessToken: token,
            user
        });

    } catch (err) {
        console.log(err)
        res.status(400).send('ERROR: ' + err.message)

    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credential!");
        }

        const isPasswordValid = await user.validatePassword(password)
        if (isPasswordValid) {
            // create a JWT token

            const token = await user.getJWT();

            // Add the token to cookie and send the response back to the user
            res.cookie('token', token, {
                expires: new Date(Date.now() + 8 * 3600000)
            })
            res.send({
                message: "Logged In",
                accessToken: token,
                user
            });
        } else {
            throw new Error(" Invalid credentials")
        }
    } catch (err) {
        res.status(400).send('ERROR' + err.message)
    }
});

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now())
        }).send("Logout successfully!");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
});


module.exports = authRouter;