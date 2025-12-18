import cookieParser from 'cookie-parser';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import express from 'express';
configDotenv();

// imported external files
import DB_Connect from './config/dbConnection.js';
import router from './routes/routes.js';
DB_Connect()

const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: "*",
    credentials: true
}))

app.use("/", router)

app.listen(process.env.PORT, () => {
    console.log(`Express is running on port ${process.env.PORT}`)
})