import { z } from "zod";

const userDataValidate = z.object({
    fullName: z.string().min(3, { message: "Name should have minimum 3 characters" }),
    email: z.string().trim().email(),
    password: z.string().min(6, { message: "Password should have minimum 6 characters" }),
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    status: z.enum(["active", "inactive"]),
    registration_day: z.number().min(0).max(6)
})

const LoginDataValidate = z.object({
    email: z.string().toLowerCase().trim().email(),
    password: z.string().min(6, { message: "Password should have minimum 6 characters" })
})

export default {
    userDataValidate,
    LoginDataValidate
};