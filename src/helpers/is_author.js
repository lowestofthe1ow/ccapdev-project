import { ObjectId } from "mongodb";

export default (author_id) => {
    return (id) => {
        return id.equals(author_id);
    };
};
