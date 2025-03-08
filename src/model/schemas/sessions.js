/**
 * Schema validator for the `featured_games` collection.
 */
export default {
    $jsonSchema: {
        bsonType: "object",
        required: ["expires", "session"],
        properties: {
            expires: {
                bsonType: "date",
                description: "'expires' must be a date and is required",
            },
            session: {
                bsonType: "string",
                description: "'session' must be a string and is required",
            },
        },
    },
};
