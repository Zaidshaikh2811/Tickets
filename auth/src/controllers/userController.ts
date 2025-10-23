import { Request, Response } from "express";
import { User } from "../models/users";
import jwt from "jsonwebtoken";


export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const token = req.session?.jwt;
        if (!token) return res.status(401).json({ error: "Not authenticated" });

        let payload: any;
        try {
            payload = jwt.verify(token, process.env.JWT_KEY!);
        } catch (err) {
            console.error("JWT verify failed:", err);
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        const user = await User.findById(payload.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ user: { name: user.name, email: user.email } });
    } catch (err) {
        console.error("Internal server error:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
};


export const signup = async (req: Request, res: Response) => {
    try {

        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: "Email already in use" });
            return;
        }
        const user = User.build({ name, email, password });
        await user.save();

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY || "default_jwt_key");
        req.session = { jwt: token };


        res.status(201).json({ message: "Sign-up successful", user: { name, email } });
    } catch (err) {
        res.status(500).send({ error: "Internal Server Error" });
    }
};

export const signin = async (req: Request, res: Response) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ error: "Invalid credentials" });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(400).json({ error: "Invalid credentials" });
            return;
        }


        res.status(200).json({ message: "Sign-in successful", user: { name: user.name, email: user.email } });


    }
    catch (err) {
        res.status(500).send({ error: "Internal Server Error" });
    }
};

