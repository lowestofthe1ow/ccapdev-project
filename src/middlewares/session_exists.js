export default async (req, res, next) => {
    if (req.session?.user_id) {
        return res.redirect("/threads");
    }else{
        return next();
    }
    
};
