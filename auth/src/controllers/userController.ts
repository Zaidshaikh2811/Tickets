import { NextFunction, Request, Response } from "express";
import { User } from "../models/users";
import jwt from "jsonwebtoken";
import { CustomError } from "@zspersonal/common";


type AsyncHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>;

const asyncHandler =
    (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) =>
        fn(req, res, next).catch(next);



export const getCurrentUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.session?.jwt;

    if (!token) throw new CustomError("Authentication required", 401);

    let payload: any;
    try {
        payload = jwt.verify(token, process.env.JWT_KEY!);
    } catch (err) {

        throw new CustomError("Invalid token", 401);
    }

    const user = await User.findById(payload.id);
    if (!user) throw new CustomError("User not found", 404);




    res.status(200).json({ success: true, user: { name: user.name, email: user.email } });

});


export const signup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("adsasdasdads");

    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new CustomError("Email in use", 400);

    const user = User.build({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);
    req.session = { jwt: token };

    res.status(201).json({ success: true, token, message: "Sign-up successful", user: { name, email } });

});


export const signin = asyncHandler(async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new CustomError("Invalid credentials", 400);

    const validPassword = await user.comparePassword(password);
    if (!validPassword) throw new CustomError("Invalid credentials", 400);

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);
    req.session = { jwt: token };

    res.status(200).json({ success: true, token, user: { name: user.name, email: user.email } });

});



export const signOut = asyncHandler(async (req: Request, res: Response) => {
    req.session = null;
    res.status(200).json({ success: true, message: "Signed out successfully" });
});
