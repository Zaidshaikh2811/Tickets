import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import { validateRequest, requireAuth } from "@zspersonal/common";
import { addTicket, deleteTicket, getTickets, updateTicket, getParticularTicket } from "../controller/ticketsController";


const router = express.Router();

router.get("/health", (req: Request, res: Response) => {
    res.send({ status: "Tickets service is healthy" });
});

router.post("/", requireAuth, [
    body("title")
        .not().isEmpty().withMessage("Title is required"),
    body("price")
        .isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
    validateRequest
], addTicket);


router.get("/", getTickets);
router.get("/:id",
    [
        param("id").isMongoId().withMessage("Invalid ticket ID"),
    ],
    validateRequest,
    requireAuth,
    getParticularTicket)

router.put("/:id", [
    param("id").isMongoId().withMessage("Invalid ticket ID"),
    body("title")
        .not().isEmpty().withMessage("Title is required"),
    body("price")
        .isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
    validateRequest,
    requireAuth
], updateTicket);

router.delete("/:id", [
    param("id").isMongoId().withMessage("Invalid ticket ID"),
    validateRequest,
    requireAuth
], deleteTicket);


export { router as createTicketRouter };