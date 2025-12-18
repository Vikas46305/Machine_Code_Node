import express from 'express';

import UserController from '../controller/User.controler.js';

const app = express.Router()

app.use("/user", UserController)

export default app;