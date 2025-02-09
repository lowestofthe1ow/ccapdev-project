import { ObjectId } from "mongodb";

/**
 * Wrapper function for {@link ObjectId.equals} for use in Handlebars.
 *
 * @param id1 - The first ObjectID to compare
 * @param id2 - The second ObjectID to compare
 */
export default (id1, id2) => {
    return id1.equals(id2);
};
