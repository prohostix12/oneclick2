import { MongoClient, Db } from 'mongodb';

if (!process.env.DATABASE_URL) {
  throw new Error('Please add your MongoDB URI to .env');
}

const uri = process.env.DATABASE_URL;
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 45000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  waitQueueTimeoutMS: 10000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDatabase(): Promise<Db> {
  try {
    const client = await clientPromise;
    // Verify connection is healthy
    await client.db('admin').command({ ping: 1 });
    return client.db('advertisement');
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to database');
  }
}
