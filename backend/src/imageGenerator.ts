import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DALLE_API_KEY = process.env.DALLE_API_KEY;

export async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: prompt,
        n: 1,
        size: '1024x1024',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DALLE_API_KEY}`,
        },
      }
    );

    return response.data.data[0].url;
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image');
  }
}