import Express, { RequestHandler } from "express";
import bodyParser from "body-parser";

import cookieSession from "cookie-session";
import { CustomError, errorHandler, getCurrentUser } from "@zspersonal/common";
import { orderRouter } from "./routes/order_route";



const app = Express();


app.set("trust proxy", true);
app.use(bodyParser.json());
app.use(cookieSession({
    signed: false,
    secure: false,
    sameSite: "lax",
}));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

app.use(getCurrentUser as RequestHandler);

app.use("/api/orders", orderRouter);




app.use((req, res, next) => {
    next(new CustomError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handler - must be last
app.use(errorHandler);

export { app };