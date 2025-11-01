const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//register controller
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //if username or password is not provided
        if (!name || !password || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        //check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }


        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);



        //creating new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        //save new user to DB
        await newUser.save();

        res.status(201).json({ message: `User registered with username ${name} successfully` });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: err.message });
        }
        if (err.code === 11000) {
            return res.status(400).json({ message: "Email or Username already exists" });
        }
        console.error("Error in register controller:", err);
        res.status(500).json({ message: "Something went wrong" });
    }

}

//login controller
const login = async (req, res) => {
    try {
        console.log("Incoming request body:", req.body);

        const { email, password } = req.body;

        //if username or password is not provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }


        //find user in db
        const user = await User.findOne({ email });

        //if user does not exist
        if (!user) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }

        //if user exists, compare password
        const isMatch = await bcrypt.compare(password, user.password);

        //if password does not match
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        //genrate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.status(200).json({
            message: `User ${user.name} logged in successfully`, token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });

    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' });
        console.log("Error is login controller in authController.js", err);
    }
}



module.exports = { register, login }