import jwt from 'jsonwebtoken';

import ServerError from "../util/serverError.js";

async function isAuth(req, res, next) {
    try {

        const { Token } = req.cookies;
        if (!Token) {
            return res.status(400).json({
                message: "User not login",
                success: false
            })
        }

        const VerifyToken = await jwt.verify(Token, process.env.JWT_SIGN)

        if (!VerifyToken) {
            return res.status(400).json({
                message: "Invalid Token",
                success: false
            })
        }

        req.userId = VerifyToken.id;
        next();
    } catch (error) {
        ServerError(error, res)
    }
}
export default isAuth;