import { MongoClient } from "mongodb";

const client = new MongoClient(encodeURIComponent(process.env.MONGODB_URI));

export default client;
