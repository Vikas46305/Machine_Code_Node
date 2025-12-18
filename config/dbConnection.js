import mongoose from "mongoose";

async function DB_Connect() {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('DB Connected')
    } catch (error) {
        console.error(`Failed to connect DB ${error}`)
    }
}
export default DB_Connect;