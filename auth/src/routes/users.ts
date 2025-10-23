import { Router, Request, Response } from "express";
import { getCurrentUser, signup, signin } from "../controllers/userController";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validateRequest";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
    res.send({ status: "Auth service is healthy" });
});

router.get("/currentuser", getCurrentUser);


router.post("/signup", [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().withMessage("Invalid email"),
    body("password").trim().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    validateRequest,
], signup);


router.post("/signin", [
    body("email").trim().isEmail().withMessage("Invalid email"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    validateRequest,
], signin);


export default router;
