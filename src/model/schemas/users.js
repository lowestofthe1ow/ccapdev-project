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

            /* Working as of now, touch as you please */
            thread_vote_list: {
                bsonType: "object",
                description: "Dictionary of thread votes, keyed by thread ObjectId string",
                patternProperties: {
                  "^[0-9a-fA-F]{24}$": {
                    bsonType: "int",
                    description: "Vote value must be an integer",
                  },
                },
                additionalProperties: false,
              },
            comment_vote_list: {
                bsonType: "object",
                description: "Dictionary of comment votes, keyed by comment ObjectId string",
                patternProperties: {
                    "^[0-9a-fA-F]{24}$": {
                    bsonType: "int",
                    description: "Vote value must be an integer",
                    },
                },
                additionalProperties: false,
            },
            pfp: {
                bsonType: "string",
                description: "'pfp' must be a string and is required",
            },
            banner: {
                bsonType: "string",
                description: "'banner' must be a string and is required",
            },
            bio: {
                bsonType: "string",
                description: "'bio' must be a string and is required",
            },
            deleted: {
                bsonType: "bool",
                description: "'deleted' must be a boolean and is required",
            },
        },
    },
};
