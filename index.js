import express from "express";
import { MongoClient } from "mongodb";

const app = express();
const port = 8000;

const client = new MongoClient(process.env.MONGODB_URI);

/* Sample function for accessing MongoDB database */
async function mongodb_test() {
    try {
        const database = client.db("shinosawa");
        const users = database.collection("users");

        /* Sample query */
        const user = await users.findOne({ username: "lowestofthelow" });

        console.log(user);
    } finally {
        await client.close();
    }
}

app.use(express.static("public"));

app.listen(port, () => {
    mongodb_test();
    console.log(`Listening on port ${port}.`);
});
