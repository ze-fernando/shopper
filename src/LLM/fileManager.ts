import { GoogleAIFileManager } from "@google/generative-ai/server";


export const fileGemini = new GoogleAIFileManager(process.env.GEMINI_API_KEY as string);


export const fileManagerAI = async (imagePath: string) => {
    try{
        const response = await fileGemini.uploadFile(imagePath, {
            mimeType: "image/jpeg"
        });
        
        const getResponse = await fileGemini.getFile(response.file.name);
    
        return { imagePath, getResponse };
    } catch(error){
        throw new Error("Failed to upload file");
    }
}
