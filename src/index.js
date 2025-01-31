import express from "express";
import { MongoClient } from "mongodb";
import Handlebars from "handlebars";
import { engine } from "express-handlebars";

const app = express();
const port = 8000;

// const client = new MongoClient(process.env.MONGODB_URI);

/* Use the handlebars engine */
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

/* Set src/views as the views directory */
app.set("views", "src/views");

/* Serve static content from the public directory */
app.use("/", express.static("public"));

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});

app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

app.get("/signin", (req, res) => {
    res.render("signin", { title: "Sign in" });
});
