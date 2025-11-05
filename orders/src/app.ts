import Express, { json, RequestHandler } from "express";

import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieSession from "cookie-session";
import { CustomError, errorHandler, getCurrentUser } from "@zspersonal/common";
import { orderRouter } from "./routes/order_route";



const app = Express();


app.set("trust proxy", true);
app.use(helmet()); // Adds common security headers
app.use(compression()); // Gzip responses
app.use(json()); // Parses JSON body

app.use(cookieSession({
    signed: false,
    secure: false,
    sameSite: "lax",
}));

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev')); // Pretty logging for dev environments
}


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