import Express from "express";
import bodyParser from "body-parser";
import usersRouter from "./routes/users";

import cookieSession from "cookie-session";
import { CustomError } from "./errors/CustomError";
import { errorHandler } from "./middleware/errorHandler";



const app = Express();


app.set("trust proxy", true);
app.use(bodyParser.json());
app.use(cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY_1 || "default_key_1", process.env.COOKIE_KEY_2 || "default_key_2"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
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