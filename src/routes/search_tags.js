import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let tags_db = req.app.get("db").collection("tags");

        const searchQuery = req.query.q || "";
        const tags = await tags_db.find({ name: { $regex: searchQuery, $options: "i" } }).toArray();
        
        res.json(tags.map(tag => tag.name));
    } catch (error) {
        console.error(error);
    }
});

export default router;


