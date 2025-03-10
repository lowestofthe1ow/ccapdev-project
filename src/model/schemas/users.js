/**
 * Schema validator for the `users` collection.
 */

export default {
    $jsonSchema: {
        bsonType: "object",
        required: ["banner", "bio", "comment_vote_list", "name", "password", "pfp", "thread_vote_list"],
        properties: {
            banner: {
                bsonType: "string",
                description: "'banner' must be a string and is required",
            },
            bio: {
                bsonType: "string",
                description: "'bio' must be a string and is required",
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
            deleted: {
                bsonType: "bool",
                description: "'deleted' must be a boolean",
            },
            name: {
                bsonType: "string",
                description: "'name' must be a string and is required",
            },
            password: {
                bsonType: "string",
                description: "'password' must be a string and is required",
            },
            pfp: {
                bsonType: "string",
                description: "'pfp' must be a string and is required",
            },
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
        },
    },
};
