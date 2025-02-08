import express from "express";
import { engine } from "express-handlebars";

/* MongoDB connection */
import db_conn from "./model/db.js";

/* Routes */
import index from "./routes/index.js";
import forum from "./routes/threads.js";

const app = express();
const port = 8000;

/* Use the handlebars engine */
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

/* Set src/views as the views directory */
app.set("views", "src/views");

/* Serve static content from the public directory */
app.use("/", express.static("public"));

/* Set routers */
app.use("/", index);
app.use("/threads", forum);

/* Connect to MongoDB and begin listening to requests */
db_conn.connect().then(() => {
    app.set("db", db_conn.db(process.env.MONGODB_DBNAME));

    app.listen(port, () => {
        console.log(`Listening on port ${port}.`);
    });
});
