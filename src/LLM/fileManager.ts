import { GoogleAIFileManager } from "@google/generative-ai/server";

import path from 'path';
import fs from 'fs';


export const fileGemini = new GoogleAIFileManager(process.env.GEMINI_API_KEY as string);


export const fileManagerAI = async (image: string) => {
    try{
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

        const imageBuffer = Buffer.from(base64Data, 'base64');
        const imagePath = path.join(`src/uploads/${Date.now()}.jpg`);
        fs.writeFileSync(imagePath, imageBuffer);
    
        const response = await fileGemini.uploadFile(imagePath, {
            mimeType: "image/jpeg"
        });
    
        const getResponse = await fileGemini.getFile(response.file.name);
    
        return { imagePath, getResponse };
    } catch(error){
        console.log(error); 
        throw new Error("Failed to upload file");
    }
}
