/*import axios from 'axios';
import { IResponse } from '../interfaces/Iupload';

export const sendImage = async (image: string) => {
  const apiUrl = 'https://ai.google.dev/gemini-api/vision';
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const data = await axios.post(apiUrl, { image }, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    }).data;

    const res: IResponse = {
            image_url: data.image_url,
            measure_value: data.measure_value,
            measure_uuid: data.measure_uuid
        };

    return {}
    
  } catch (error) {
    console.error("Erro ao chamar API Gemini", error);
    throw error;
  }
};*/