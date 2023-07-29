/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios, { AxiosRequestConfig } from 'axios';
import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const prompt = event?.body;

  if (!prompt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Please provide a prompt' }),
    };
  }

  try {
    const formData = new FormData();
    formData.append('prompt', prompt);

    const axiosConfig: AxiosRequestConfig<FormData> = {
      headers: {
        'x-api-key': process.env.API_KEY,
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'arraybuffer',
    };

    const { data } = await axios.post(
      'https://clipdrop-api.co/text-to-image/v1',
      formData,
      axiosConfig
    );

    const uint8Array = new Uint8Array(data);
    const base64ImageData = Buffer.from(uint8Array).toString('base64');

    if (base64ImageData) {
      return {
        statusCode: 200,
        body: JSON.stringify({ base64ImageData }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Image generation failed' }),
    };
  }

  // If no valid response is returned within the try block, return a default response
  return {
    statusCode: 500,
    body: JSON.stringify({ error: 'Unexpected error occurred' }),
  };
};

export { handler };

// exports.handler.path = '/generate-image';

// export { handler };
