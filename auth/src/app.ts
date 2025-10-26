import Express from "express";
import bodyParser from "body-parser";
import usersRouter from "./routes/users";

import cookieSession from "cookie-session";
import { CustomError, errorHandler } from "@zspersonal/common";




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



app.use("/api/users", usersRouter);

app.use((req, res, next) => {
    next(new CustomError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handler - must be last
app.use(errorHandler);

export { app };