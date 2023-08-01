/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Handler } from '@netlify/functions';
import { MongoClient } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface RequestBody {
  name: string;
  prompt: string;
  photo: string;
}

interface ResponseData {
  success: boolean;
  data?: any;
  message?: string;
}

export const handler: Handler = async (event) => {
  try {
    const requestBody = event.body;

    if (!requestBody) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is empty' }),
      };
    }

    const { name, prompt, photo } = JSON.parse(requestBody);

    // Upload the image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(photo, {
      resource_type: 'image',
    });

    const photoUrl = uploadResult.secure_url;

    // MongoDB Connection
    const uri = process.env.MONGODB_URL;
    if (!uri) {
      throw new Error('MONGODB_URL environment variable not set.');
    }
    const client = new MongoClient(uri);
    await client.connect();

    const collection = client.db('ImageGeneratorPosts').collection('Posts');

    // Save data to MongoDB
    const newPost = await collection.insertOne({
      name,
      prompt,
      photo: photoUrl,
    });

    await client.close();

    const responseData: ResponseData = {
      success: true,
      data: newPost,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(responseData),
    };
  } catch (error) {
    console.error(error);

    const responseData: ResponseData = {
      success: false,
      message: 'Unable to create a post, please try again',
    };

    return {
      statusCode: 500,
      body: JSON.stringify(responseData),
    };
  }
};
