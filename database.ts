import { Collection, MongoClient } from "mongodb";
import {Element,Discoverer, User} from './views/interfaces';
import elements from './assets/elements.json';
import scientists from './assets/scientists.json';
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();


export const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
export const elementscollection : Collection<Element> = client.db("taakwebontwikkeling").collection("elementen");
export const discovererscollection : Collection<Discoverer> = client.db("taakwebontwikkeling").collection("ontdekkers");
export const userCollection : Collection = client.db("taakwebontwikkeling").collection("users");


async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

async function getElements() {
    return await elementscollection.find({}).toArray();
}
async function getScientists() {
    return await discovererscollection.find({}).toArray();
}


export async function checkDatabaseAndfillElements() {
    const elementsArray : Element[] = await getElements();
    if (elementsArray.length == 0) {
        console.log("Database is empty, loading elements")
        const elementsArray : Element[] = [];
        for(let i = 0; i < elements.length; i++){
            elementsArray.push(elements[i]);
        }
        await elementscollection.insertMany(elementsArray);
    }
    return elementsArray
}
export async function checkDatabaseAndfillScientists() {
    const scientistsArray : Discoverer[] = await getScientists();
    if (scientistsArray.length == 0) {
        console.log("Database is empty, loading elements")
        const scientistsArray : Discoverer[] = [];
        for(let i = 0; i < scientists.length; i++){
            scientistsArray.push(scientists[i]);
        }
        await discovererscollection.insertMany(scientistsArray);
    }
    return scientistsArray;
}


export async function connect() {
    try {
        await client.connect();
         
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }
}

export async function getDataById(id: string, collection: any) {
    return await collection.findOne({ id: id });
}

export async function search(q: string, collection: any) {
    return await collection.name.toLowerCase().startsWith(q.toLowerCase())};


export async function login(email: string, password: string) {
        if (email === "" || password === "") {
            throw new Error("Email and password required");
        }
        let user : User | null = await userCollection.findOne<User>({email: email});
        if (user) {
            if (await bcrypt.compare(password, user.password!)) {
                return user;
            } else {
                throw new Error("Password incorrect");
            }
        } else {
            throw new Error("User not found");
        }
    }