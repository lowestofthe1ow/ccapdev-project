/**
 * Schema validator for the `users` collection.
 */

/* TODO: Set max length if y'all want */
/* REALLY IMPORTANT TODO: BIO CAN BE EMPTY */
export default {
    $jsonSchema: {
        bsonType: "object",
        required: ["name", "password", "thread_vote_list", "comment_vote_list", 
                   "pfp",  "banner", "bio", "deleted" ],

        properties: {
            name: {
                bsonType: "string",
                description: "'name' must be a string and is required",
            },
            password: {
                bsonType: "string",
                description: "'password' must be a string and is required",
            },
            thread_vote_list: {
                bsonType: "array",
                items: {
                    bsonType: "objectId",
                    description: "'thread_vote_list' must be an array of ObjectIds",
                },
                minItems: 0,
                uniqueItems: true,
            },
            comment_vote_list: {
                bsonType: "array",
                items: {
                    bsonType: "objectId",
                    description: "'comment_vote_list' must be an array of ObjectIds",
                },
                minItems: 0,
                uniqueItems: true,
            },
            pfp: {
                bsonType: "string",
                description: "'pfp' must be a string and is required",
                /* add the default */
            },
            banner: {
                bsonType: "string",
                description: "'banner' must be a string and is required",
                /* add the default */
            },
            bio: {
                bsonType: "string",
                description: "'bio' must be a string and is required",
                default: "",
            },
            deleted: {
                bsonType: "bool",
                description: "'deleted' must be a boolean and is required",
            },
        },
    },
};
