/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Handler } from '@netlify/functions';
import { MongoClient } from 'mongodb';

interface ResponseData {
  success: boolean;
  arrayPosts?: any;
  message?: string;
}

export const handler: Handler = async () => {
  try {
    const uri = process.env.MONGODB_URL;
    if (!uri) {
      throw new Error('MONGODB_URL environment variable not set.');
    }
    const client = new MongoClient(uri);
    await client.connect();

    const collection = client.db('ImageGeneratorPosts').collection('Posts');

    // Fetch all posts from MongoDB
    const posts = await collection.find().toArray();

    await client.close();

    const responseData: ResponseData = {
      success: true,
      arrayPosts: posts,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(responseData),
    };
  } catch (error) {
    console.error(error);

    const responseData: ResponseData = {
      success: false,
      message: 'Unable to fetch posts, please try again',
    };

    return {
      statusCode: 500,
      body: JSON.stringify(responseData),
    };
  }
};
