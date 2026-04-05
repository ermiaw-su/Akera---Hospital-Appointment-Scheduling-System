import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!
const dbName = process.env.MONGODB_DB!

let client: MongoClient
let clientPromise: Promise<MongoClient>

if(!uri){
    throw new Error('MONGODB_URI is not defined')
}

if(!dbName){
    throw new Error('MONGODB_DB is not defined')
}

//Ensure doesn't connect twice
if (process.env.NODE_ENV === "development") {
    if(!(global as any)._mongoClientPromise) {
        client = new MongoClient(uri);(global as any).
        _mongoClientPromise = client.connect()
    }
    clientPromise = (global as any)._mongoClientPromise
} else {
    client = new MongoClient(uri)
    clientPromise = client.connect()
}

export async function getDB(){
    const client = await clientPromise
    return client.db(dbName)
}