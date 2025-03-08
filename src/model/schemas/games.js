/**
 * Schema validator for the `featured_games` collection.
 */
export default {
    $jsonSchema: {
        bsonType: "object",
        required: ["description", "icon", "image", "logo", "name"],
        properties: {
            description: {
                bsonType: "string",
                description: "'description' must be a string and is required",
            },
            icon: {
                bsonType: "string",
                description: "'icon' must be a string and is required",
            },
            image: {
                bsonType: "string",
                description: "'image' must be a string and is required",
            },
            logo: {
                bsonType: "string",
                description: "'logo' must be a string  and is required",
            },
            name: {
                bsonType: "string",
                description: "'name' must be a string and is required",
            },
        },
    },
};
