import { Request, Response } from "express";
import { User } from "../models/users";
import jwt from "jsonwebtoken";
import { CustomError } from "@zspersonal/common";
import { asyncHandler } from "@zspersonal/common";


export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const token = req.session?.jwt;



        if (!token) return res.status(401).json({ error: "Not authenticated" });

        let payload: any;
        try {
            payload = jwt.verify(token, process.env.JWT_KEY!);
        } catch (err) {
            console.error("JWT verify failed:", err);
            throw new CustomError("Invalid token", 401);
        }

        const user = await User.findById(payload.id);
        if (!user) throw new CustomError("User not found", 404);




        res.status(200).json({ user: { name: user.name, email: user.email } });
    } catch (err) {
        console.error("Internal server error:", err);
        throw new CustomError("Internal Server Error", 500);
    }
};


export const signup = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new CustomError("Email in use", 400);

        const user = User.build({ name, email, password });
        await user.save();

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);
        req.session = { jwt: token };

        res.status(201).json({ message: "Sign-up successful", user: { name, email } });
    } catch (err) {
        if (err instanceof CustomError) throw err;
        throw new CustomError("Internal Server Error", 500);
    }
});


export const signin = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) throw new CustomError("Invalid credentials", 400);

        const isMatch = await user.comparePassword(password);
        if (!isMatch) throw new CustomError("Invalid credentials", 400);

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);
        req.session = { jwt: token };

        res.status(200).json({ message: "Sign-in successful", user: { name: user.name, email: user.email } });
    } catch (err) {
        if (err instanceof CustomError) throw err;
        throw new CustomError("Internal Server Error", 500);
    }
});



export const signOut = asyncHandler(async (req: Request, res: Response) => {
    req.session = null;
    res.status(200).json({ message: "Sign-out successful" });
});
