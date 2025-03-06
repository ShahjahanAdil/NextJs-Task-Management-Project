import mongoose from "mongoose";

const connectionStr = process.env.MONGODB_URL;

if (!connectionStr) {
    throw new Error("Please define the MONGODB_URL environment variable in .env.local");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(connectionStr, {
            dbName: "taskManagement",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}