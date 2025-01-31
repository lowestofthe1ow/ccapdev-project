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
    res.render("index", {
        title: "Home",
        images: [
            [
                {
                    image: "https://res.cloudinary.com/dezghxeg3/image/upload/v2/gkms/img_general_csprt-3-0045_full.webp",
                    icon: "/img/game_gkms.png",
                    name: "Gakuen iDOLM@STER",
                },
                {
                    image: "https://webusstatic.yo-star.com/arknights-us/ark-us-5th-collect-h5/main/h5/assets/banner-3c38af04.jpg",
                    icon: "/img/game_akni.png",
                    name: "Arknights",
                },
                {
                    image: "https://images.ctfassets.net/vfkpgemp7ek3/2004891259/a6972bb9d4019e1f2e939592a3b0e596/fate-grand-order-revenue-three-billion.jpg",
                    icon: "/img/game_fate.png",
                    name: "Fate/Grand Order",
                },
            ],
            [
                {
                    image: "https://nichegamer.com/wp-content/uploads/2023/02/kazusa-recollect-blue-archive-02-28-2023.jpg",
                    icon: "/img/game_brak.png",
                    name: "Blue Archive",
                },
                {
                    image: "https://s1.zerochan.net/Akiyama.Mizuki.600.3325026.jpg",
                    icon: "https://play-lh.googleusercontent.com/FxJ-b7THm0gz6wR8nZ9kH33ZHGbYQDBC5eYPNPWnugizlFiUfPN4aGO7H48OmM7-K-A=h1024-rw",
                    name: "Project Sekai",
                },
                {
                    image: "https://azurlane.netojuu.com/images/a/a7/Bg_2022.01.06_4.png",
                    icon: "https://play-lh.googleusercontent.com/Xvzm9AdC2rEpP_gcwoJWBD7BsDClyOhRZ5AmIyhZDKRRCB2k1hdovUqpLgEIcx5b1YY=h1024-rw",
                    name: "Azur Lane",
                },
            ],
        ],
    });
});

app.get("/signin", (req, res) => {
    res.render("signin", { title: "Sign in" });
});
