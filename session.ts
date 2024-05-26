
import session, { MemoryStore } from "express-session";
import { FlashMessage, User } from "./views/interfaces";
import mongoDbSession from "connect-mongodb-session";
import dotenv from "dotenv";
const MongoDBStore = mongoDbSession(session);

declare module 'express-session' {
    export interface SessionData {
        user?: User,
        message?: FlashMessage
    }
}

export default session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    store: new MemoryStore(),
    resave: true,
    saveUninitialized: true,
});
