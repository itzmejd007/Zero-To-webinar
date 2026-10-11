import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/resume-parser';
let mongoClient;
let comparisonCollection;
let connectionPromise;

export async function connectMongo() {
  if (comparisonCollection) {
    return comparisonCollection;
  }

  if (!connectionPromise) {
    connectionPromise = (async () => {
      const client = new MongoClient(mongoUri, {
        serverSelectionTimeoutMS: 5_000,
      });

      try {
        await client.connect();
        mongoClient = client;
        const databaseName = new URL(mongoUri).pathname.slice(1) || 'resume_parser';
        comparisonCollection = client.db(databaseName).collection('comparisons');
        console.log('MongoDB connected.');
        return comparisonCollection;
      } catch {
        await client.close();
        console.error('MongoDB connection failed.');
        throw Object.assign(
          new Error('MongoDB is unavailable. Check MONGO_URI and the database network access settings.'),
          { statusCode: 503 },
        );
      } finally {
        connectionPromise = null;
      }
    })();
  }

  return connectionPromise;
}

export function getComparisonCollection() {
  return comparisonCollection;
}

export async function closeMongo() {
  if (mongoClient) {
    await mongoClient.close();
    mongoClient = null;
    comparisonCollection = null;
  }
}
