import { app } from "./app";
import { connectToDatabase } from "./db/db";
const port = process.env.PORT || 3000;

app.listen(port, async () => {
    await connectToDatabase();
    console.log('JWT Key:', process.env.JWT_KEY);
    console.log(`Auth service v2 listening on port ${port}`);
});
