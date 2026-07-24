import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;

let clientPromise;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    clientPromise = client.connect();
  }
} else {
  clientPromise = Promise.resolve(null);
}

export default clientPromise;

export async function pingMongo() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
  }
  const client = await clientPromise;
  if (!client) {
    throw new Error("MongoClient connection unavailable.");
  }
  await client.db("admin").command({ ping: 1 });
  return true;
}
