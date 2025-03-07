/**
 * Schema validator for the `featured_games` collection.
 */
export default {
    $jsonSchema: {
        bsonType: "object",
        required: ["image", "icon", "name"],
        properties: {
            image: {
                bsonType: "string",
                description: "'image' must be a string and is required",
            },
            icon: {
                bsonType: "string",
                description: "'icon' must be a string and is required",
            },
            name: {
                bsonType: "string",
                description: "'name' must be a string and is required",
            },
        },
    },
};
