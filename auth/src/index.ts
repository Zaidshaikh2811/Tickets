import Express from "express";
import bodyParser from "body-parser";
import usersRouter from "./routes/users";
import { connectToDatabase } from "./db/db";
import cookieSession from "cookie-session";



const app = Express();
const port = process.env.PORT || 3000;

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

app.use((req, res) => {
    console.log('404 - Route not found:', req.method, req.path);
    res.status(404).send({
        error: 'Not Found',
        path: req.path
    });
});

app.listen(port, async () => {
    await connectToDatabase();
    console.log(`Auth service v2 listening on port ${port}`);
});
