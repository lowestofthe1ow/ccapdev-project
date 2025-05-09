/**
 * Schema validator for the `threads` collection.
 */
export default {
    $jsonSchema: {
        bsonType: "object",
        required: ["author", "comments", "content", "created", "games", "tags", "thumbnail", "title", "vote_count"],
        properties: {
            author: {
                bsonType: "objectId",
                description: "'author' must be an ObjectId and is required",
            },
            comments: {
                bsonType: "array",
                items: {
                    bsonType: "objectId",
                    description: "'comments' must be an array of ObjectIds and is required",
                },
                minItems: 0,
                uniqueItems: true,
            },
            content: {
                bsonType: "string",
                description: "'content' must be a string and is required",
            },
            created: {
                bsonType: "date",
                description: "'created' must be a date and is required",
            },
            deleted: {
                bsonType: "bool",
                description: "'deleted' must be a boolean",
            },
            edited: {
                bsonType: "date",
                description: "'edited' must be a date",
            },
            /* TODO: Should games and tags be separate objects */
            games: {
                bsonType: "array",
                items: {
                    bsonType: "string",
                    description: "'games' must be an array of strings and is required",
                },
                minItems: 0,
                uniqueItems: true,
            },
            tags: {
                bsonType: "array",
                items: {
                    bsonType: "string",
                    description: "'tags' must be an array of strings and is required",
                },
                minItems: 0,
                uniqueItems: true,
            },
            /* Thumbnail will be an empty string for threads without images */
            thumbnail: {
                bsonType: "string",
                description: "'thumbnail' must be a string and is required",
            },
            title: {
                bsonType: "string",
                description: "'title' must be a string and is required",
            },
            vote_count: {
                bsonType: "int",
                description: "'vote_count' must be an integer and is required",
            },
        },
    },
};
