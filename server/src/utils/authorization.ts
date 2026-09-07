import mongoose from "mongoose";
import { AppError } from "./AppError.js";


export const assertOwnership = (
    resourceUserId: mongoose.Types.ObjectId,
    currentUserId: string
): void => {
    if(resourceUserId.toString() !== currentUserId) {
        throw new AppError("You are not authorized to access this resource", 403);
    }
}