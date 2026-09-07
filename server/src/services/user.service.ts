import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User, { IUser } from "../models/User.js";
import { AppError } from "../utils/AppError.js";

export const registerUser = async (
    name: string,
    email: string,
    password: string
): Promise<IUser> => {
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({email: normalizedEmail});

    if(existingUser){
        throw new AppError("An Account with this email already exists", 409)
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword
    })

    return user;
}

export const createAuthToken = (userId: string): string => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign({ userId }, jwtSecret, {
        expiresIn: "7d",
    });
};

export const loginUser = async (
    email: string,
    password: string
): Promise<{user: IUser, token: string}> => {

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({email: normalizedEmail}).select("+password");
    if(!user) {
        throw new AppError("Invalid Credentials", 401);
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if(!passwordMatches) {
        throw new AppError("Invalid Credentials", 401);
    }

    const token = createAuthToken(user._id.toString());

    return {user, token};
}

export const getUserById = async (
    userId: string
): Promise<IUser | null> => {
    return User.findById(userId);
};
