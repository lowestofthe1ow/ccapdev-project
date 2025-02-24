/**
 * Schema validator for the `comments` collection.
 */
export default {
    $jsonSchema: {
        bsonType: "object",
        required: ["author", "children", "content", "created", "parent", "thread", "vote_count"],
        properties: {
            author: {
                bsonType: "objectId",
                description: "'author' must be an ObjectId and is required",
            },
            children: {
                bsonType: "array",
                items: {
                    bsonType: "objectId",
                    description: "'children' must be an array of ObjectIds and is required",
                },
                minItems: 0,
                uniqueItems: true,
            },
            content: {
                bsonType: "string",
                description: "'content' must be a string and is required",
                maxLength: 700 /* Set maximum length for comments */,
            },
            created: {
                bsonType: "date",
                description: "'created' must be a date and is required",
            },
            edited: {
                bsonType: "date",
                description: "'edited' must be a date",
            },
            parent: {
                bsonType: "objectId",
                description: "'parent' must be an ObjectId and is required",
            },
            thread: {
                bsonType: "objectId",
                description: "'thread' must be an ObjectId and is required",
            },
            vote_count: {
                bsonType: "int",
                description: "'vote_count' must be an integer and is required",
            },
        },
    },
};
