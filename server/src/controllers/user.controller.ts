import type { Request, Response } from "express"
import { AppError } from "../utils/AppError.js";
import { createAuthToken, getUserById, loginUser, registerUser } from "../services/user.service.js";

const authCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // The Render frontend and API use different origins. Cross-origin XHR
    // requests can only persist/send this httpOnly cookie in production when
    // it is explicitly marked as cross-site and secure.
    sameSite: process.env.NODE_ENV === "production" ? "none" as const : "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registerUserController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {name, email, password} = req.body;

    if(typeof name !== "string" ||
       typeof email !== "string" ||
       typeof password !== "string" 
    ) {
        throw new AppError("Name, Email and Password are required", 400)
    }

    if(password.length < 8) {
        throw new AppError("Password must be at least 8 Characters long", 400)
    }

    if (!name.trim()) {
        throw new AppError("Name is required", 400);
    }

    const user = await registerUser(name, email, password);
    const token = createAuthToken(user._id.toString());

    res.cookie("token", token, authCookieOptions);

    res.status(201).json({
        success: true,
        message: "Account created Successfully",
        data: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    })
}

export const loginUserController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {email, password} = req.body;

     if (
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        throw new AppError("Email and password are required",400);
    }

    const {user, token} = await loginUser(email, password);
    
    res.cookie("token", token, authCookieOptions);

    res.status(200).json({
        success: true,
        message: "Login Successful",
        data: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
}

export const getCurrentUserController = async (
    req: Request,
    res: Response
): Promise<void> => {
    const user = await getUserById(req.userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    res.status(200).json({
        success: true,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    });
};


export const logoutUserController = (
    _req: Request,
    res: Response
): void => {
    res.clearCookie("token", authCookieOptions);

    res.status(200).json({
        success: true,
        message: "Logout Successful",
    });
};
