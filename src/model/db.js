import { MongoClient } from "mongodb";

const client = new MongoClient(encodeURI(process.env.MONGODB_URI));

export default client;
