const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('./Model/userSchema')
const jwt = require('jsonwebtoken');
const { default: axios, formToJSON } = require('axios');
const nodemailer = require('nodemailer');
const { text } = require('body-parser');
const transporter = require('./Middleware/mailmiddleware');
const OtpSch = require('./Model/otpSchema');
const AIcard = require('./Model/CardSchema');
const app = express();
const fs = require("fs");
const path = require("path");

const jwt_key = "sjdkjwkokdowkdokwldkowkdowkdowkdwokowkkowkdkdldldldldlpwpwpwpwwlspspdpekemmdqp2o02o2wp-2w0w";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
require('dotenv').config();
const PORT = process.env.PORT;

require('./Db/db');

app.use(cors(
    {
        origin: 'http://localhost:5173',
        methods: 'GET,POST,DELETE,PUT',
        credentials: true
    }
))
app.use(express.json())




app.post('/register', async (req, res) => {
    const { name, email, phone, pass } = req.body;
    const hashedpass = await bcrypt.hash(pass, 10);
    try {
        const newUser = new User({ name, email, phone, pass: hashedpass });
        console.log('newuser', newUser);
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        res.status(400).json({ message: 'Error registering user' });
    }
});
app.post('/login', async (req, res) => {
    try {
        const { email, pass } = req.body;
        const existUser = await User.findOne({ email });
        console.log('user');

        if (!existUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(pass, existUser.pass);
        if (!isMatch) {
            return res.status(401).json({ message: 'Please enter correct password' });
        }

        const token = jwt.sign(
            { id: existUser._id, email: existUser.email },
            jwt_key,
            { expiresIn: '1h' }
        );
        res.status(202).json({ message: 'Login successfully', token });

        const mail_Option = {
            from: process.env.ADMIN_MAIL,
            to: email,
            subject: 'Login Successful',
            text: `Hello ${existUser.name} \n\n you have successfully logged in.`
        }
        transporter.sendMail(mail_Option, (error, info) => {
            if (error) {
                console.log('error sending email:', error);
            }
            else {
                console.log('Email sent', info.response);
            }
        })

    } catch (error) {
        console.error("login error", error);
        res.status(500).json({ message: 'Server error' });
    }
});

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
    if (!token) {
        return res.status(401).json({ message: "Unauthorized, token missing" });
    }

    try {
        const decoded = jwt.verify(token, jwt_key);
        req.user = decoded; // Store decoded user info in req.user
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

app.get('/login/success', verifyToken, async (req, res) => {
    console.log(req.user);
    if (req.user) {
        res.status(200).json({ message: "User authorized", user: req.user });
    } else {
        res.status(400).json({ message: "Authentication failed" });
    }
});


app.get('/logout', async (req, res) => {

})

app.post('/forgot_password', async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);

        const existUser = await User.findOne({ email });
        if (!existUser) {
            console.log('Email is not registered');
            return res.status(404).json({ message: 'Email is not registered' });
        }

        console.log('Email is registered');
        const otp = crypto.randomInt(100000, 999999).toString();

        // Save OTP to database
        const newOtp = new OtpSch({ email, otp });
        await newOtp.save();

        // Send OTP via email
        const mail_Option = {
            from: process.env.ADMIN_MAIL,
            to: email,
            subject: 'OTP for Password Reset',
            text: ` Hello ${existUser.name}, \n\nYour OTP for password reset is: ${otp}.\n\nIt is valid for 3 minutes.`
        };
        transporter.sendMail(mail_Option, (error, info) => {
            if (error) {
                console.log('Error sending OTP:', error);
                return res.status(500).json({ message: 'Failed to send OTP' });
            } else {
                console.log('OTP Sent:', info.response);
                res.status(200).json({ message: 'OTP sent successfully' });
            }
        });
    } catch (error) {
        console.error('Something went wrong:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/otp', async (req, res) => {
    const { email, otp } = req.body;
    const updatedOtp = otp.toString();
    console.log("accepted", updatedOtp, email)
    const existOtp = await OtpSch.findOne({ email });
    if (!existOtp) {
        res.status(404).json({ message: 'Invalid OTP' })
    }
    console.log(existOtp)
    if (existOtp.otp == updatedOtp) {
        res.status(200).json({ message: "otp successfully verified" })
    }
})

app.post('/update_password', async (req, res) => {
    const { email, pass } = req.body;
    const hashpass = await bcrypt.hash(pass, 10);
    try {
        const updatePass = await User.findOneAndUpdate({ email }, { pass: hashpass }, { new: true })
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

app.post("/api/interviews", async (req, res) => {
    try {
        const newInterview = new AIcard(req.body);
        await newInterview.save();
        res.status(201).json({ message: "Mock interview created successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

app.get('/api/interviews', async (req, res) => {
    try {
        const currentDate = new Date();
        await AIcard.deleteMany({ expiryDate: { $lt: currentDate } }); // Delete expired records
        const interviews = await AIcard.find();
        res.status(200).json(interviews);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});




app.delete('/api/interviews/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedInterview = await AIcard.findByIdAndDelete(id);

        if (!deletedInterview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        res.status(200).json({ message: "Interview deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

app.get('/', (req, res) => {
    res.send("hi");
})

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})