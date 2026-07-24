import { MongoClient, ServerApiVersion } from "mongodb";

function getClientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please define MONGODB_URI in .env.local");
  }

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
  return global._mongoClientPromise;
}

const clientPromise = {
  then(...args) {
    return getClientPromise().then(...args);
  },
  catch(...args) {
    return getClientPromise().catch(...args);
  },
};

export default clientPromise;

export async function pingMongo() {
  const client = await clientPromise;
  await client.db("admin").command({ ping: 1 });
  return true;
}
