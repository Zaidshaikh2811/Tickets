import Express, { json, RequestHandler } from "express";

import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieSession from "cookie-session";
import { CustomError, errorHandler, getCurrentUser } from "@zspersonal/common";
import { orderRouter } from "./routes/order_route";

const app = Express();


app.set("trust proxy", true);
app.use(helmet());
app.use(compression());
app.use(json());

app.use(cookieSession({
    signed: false,
    secure: false,
    sameSite: "lax",
}));

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
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


app.use(errorHandler);

export { app };