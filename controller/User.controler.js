import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';

import isAuth from '../middleware/isAuth.js';
import UserModel from '../model/User.model.js';
import calculateDistance from '../util/calculateDistance.js';
import ServerError from '../util/serverError.js';
import validator from '../util/zod.js';
import ZodError from '../util/zodError.js';
const { userDataValidate, LoginDataValidate } = validator;

const app = express()

// Create a new User
app.post("/create", async (req, res) => {
    try {

        const { fullName, email, password, address, latitude, longitude } = req.body;

        // Check all important field are available or not
        if (!fullName || !email || !password || !address || !latitude || !longitude) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        }

        const ZodResult = userDataValidate.safeParse(req.body)

        if (!ZodResult.success) {
            return ZodError(ZodResult, res)
        }

        // Trim the email and make it lowercase
        const LowerCaseEmail = ZodResult.data.email.toLocaleLowerCase().trim();

        // Check UserExist
        const CheckEmailExitOrNot = await UserModel.findOne({ email: LowerCaseEmail })

        if (CheckEmailExitOrNot) {
            return res.status(400).json({
                message: "Email already exist",
                success: false
            })
        }

        // Password Hashing
        const HashPassword = await bcrypt.hash(ZodResult.data.password, 10)

        // Save all data in db
        const saveUserData = await new UserModel({
            ...ZodResult.data,
            email,
            password: HashPassword
        })

        await saveUserData.save()

        res.status(200).json({
            message: "User created successfully!",
            success: true,
            data: req.body,
        })
    } catch (error) {
        return ServerError(error, res)
    }
})

// User Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        }

        const ZodResult = LoginDataValidate.safeParse(req.body)

        if (!ZodResult.success) {
            return ZodError(ZodResult, res)
        }

        const findUser = await UserModel.findOne({ email: ZodResult.data.email })

        if (!findUser) {
            return res.status(400).json({
                message: "No user found!",
                success: false
            })
        }

        const VerifyPassword = await bcrypt.compare(password, findUser.password);

        if (!VerifyPassword) {
            return res.status(400).json({
                message: "Invalid password",
                success: false
            })
        }

        const token = await jwt.sign({ id: findUser._id }, process.env.JWT_SIGN, { expiresIn: "1d" })

        res.cookie("Token", token,
            {
                maxAge: 24 * 60 * 60 * 1000,
                secure: false,
                httpOnly: true,
                sameSite: "strict"
            }).status(200).json({
                message: `Welcome ${findUser.fullName}`,
                success: true
            })
    } catch (error) {
        return ServerError(error, res)
    }
})

// User Logout
app.get("/logout", isAuth, async (req, res) => {
    try {
        return res.clearCookie("Token", { maxAge: 0 }).status(200).json({
            message: "User logout",
            success: true
        })
    } catch (error) {
        ServerError(error, res)
    }
})

// Change User Status
app.put("/change-status", isAuth, async (req, res) => {
    try {

        const result = await UserModel.updateMany(
            {},
            [
                {
                    $set: {
                        status: {
                            $cond: [
                                { $eq: ['$status', 'active'] },
                                'inactive',
                                'active'
                            ]
                        }
                    }
                }
            ],
            { updatePipeline: true }
        )

        return res.status(200).json({
            message: "Done",
            success: true,
            result
        })
    } catch (error) {
        return ServerError(error, res)
    }
})

// Get Distance
app.get("/get-distance", isAuth, async (req, res) => {
    try {

        const { latitude, longitude } = req.query;
        const findUserByID = await UserModel.findById(req.userId)

        const distance = calculateDistance(
            Number(latitude),
            Number(longitude),
            findUserByID.latitude,
            findUserByID.longitude,
        );

        res.status(200).json({
            message: "Done",
            success: true,
            distance: `${distance.toFixed(2)} km`
        })
    } catch (error) {
        ServerError(error, res)
    }
})

// Get user listing
app.get("/listing", isAuth, async (req, res) => {
    try {

        const dayMap = {
            0: 'sunday',
            1: 'monday',
            2: 'tuesday',
            3: 'wednesday',
            4: 'thursday',
            5: 'friday',
            6: 'saturday'
        };

        if (!req.query.week) {
            return res.status(400).json({ message: 'week number is required' });
        }

        const daysArray = (req.query.week)
            .split(',')
            .map(num => parseInt(num.trim()))
            .filter(num => num >= 0 && num <= 6);

        if (daysArray.length === 0) {
            return res.status(400).json({ message: 'No valid week numbers provided' });
        }

        const users = await UserModel.find({ registration_day: { $in: daysArray } })
            .lean(); // lean() improves performance for large datasets

        // Organize users day-wise
        const data = {};
        daysArray.forEach(dayNum => {
            const dayName = dayMap[dayNum];
            data[dayName] = users
                .filter(u => u.registration_day === dayNum)
                .map(u => ({ name: u.name, email: u.email }));
        });

        return res.status(200).json({
            message: "Done",
            success: true,
            data
        })
    } catch (error) {
        ServerError(error, res)
    }
})

export default app;