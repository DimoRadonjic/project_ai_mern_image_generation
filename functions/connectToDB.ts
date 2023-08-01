/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// import * as dotenv from 'dotenv';
// import connectDB from '../mongodb/connect.ts';

// dotenv.config();

// const mongodb_url = process.env.MONGODB_URL;

// if (mongodb_url) connectDB(mongodb_url);

// netlify/functions/mongodbFunction.ts
// netlify/functions/mongodbFunction.ts
import { Handler } from '@netlify/functions';
import { MongoClient } from 'mongodb';

const handler: Handler = async (event, context) => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const uri = process.env.MONGODB_URL;

    console.log('MONGODB_URL:', uri); // Add this line for logging

    if (!uri) {
      throw new Error('MONGODB_URL environment variable not set.');
    }

    const client = new MongoClient(uri);

    await client.connect();

    console.log('Connected to MongoDB successfully!');

    const collection = client.db('ImageGeneratorPosts').collection('Posts');

    // Perform your MongoDB operations here, for example:
    const result = await collection.find({}).toArray();

    client.close();

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error: any) {
    return { statusCode: 500, body: error.toString() };
  }
};

export { handler };
