import express from "express";

const router = express.Router();


router.get("/", async (req, res) => {

    
    res.render("submission", {
        layout: "forum",
        title: "Create Post",
    });
    

});

export default router;