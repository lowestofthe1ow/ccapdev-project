import { ObjectId } from "mongodb";

export async function get_threads(req, res, next) {
    try {
        /* Fetch from database */
        let _threads = req.app.get("db").collection("threads");
        let threads = await _threads
            .aggregate([{ $sort: { created: -1 } }]) /* Sort by most recent post for now */
            .toArray(); /* toArray() "converts" aggregate() return value to a Promise */

        /* Apply to request object */
        req.app.set("threads", threads);
        next();
    } catch (error) {
        console.error(error);
    }
}

export async function get_thread(req, res, next) {
    try {
        /* Fetch from database */
        let _threads = req.app.get("db").collection("threads");
        let thread = await _threads.find({ _id: new ObjectId(req.params.id) }).toArray();
        console.log(thread);

        /* Apply to request object */
        req.app.set("thread", thread[0]);
        next();
    } catch (error) {
        console.error(error);
    }
}
