import { app } from "./app";
import { connectToDatabase } from "./db/db";

const port = process.env.PORT || 3001;

app.listen(port, async () => {
    await connectToDatabase();
    console.log('JWT Key:', process.env.JWT_KEY);
    console.log(`Tickets service   listening on port ${port}`);
});
