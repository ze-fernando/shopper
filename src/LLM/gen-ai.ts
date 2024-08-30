import { GoogleGenerativeAI } from "@google/generative-ai";

import { v4 as uuidv4 } from 'uuid';

import { IResponse, IRequest } from "../interfaces/Iupload";
import prisma from '../dbConfig/prisma';
import { fileGemini, fileManagerAI } from "./fileManager";

export default async function sendImg(measure: IRequest, image64: string): Promise<IResponse>{    
    try {        
        const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

        const { imagePath } = await fileManagerAI(image64);

        const model = gemini.getGenerativeModel({
            model: "gemini-1.5-pro",
        });
        
        const response = await fileGemini.uploadFile(imagePath, {
            mimeType: "image/jpeg"
        });
        
        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: response.file.mimeType,
                    fileUri: response.file.uri
                }
            },
            { text: "mostre-me um numero de 0 a 10" }, //Return the consumption number of a reading
        ]);

        if (!result.response || !result.response.text) {
            throw new Error("Invalid response from Gemini API.");
        }

        const meterReading = result.response.text().match(/\d+/g);;

		const number = meterReading ? Number(meterReading) : 0;


        const newMeasure = await prisma.measure.create({
            data: {
                uuid: uuidv4(),
                datetime: new Date(measure.measure_datetime),
                type: measure.measure_type,
                value: number,
                has_confirmed: false,
                image_url: response.file.uri,
                costumer_code: measure.customer_code
            }
        });

        return {
            image_url: response.file.uri,
            measure_value: number,
            measure_uuid: newMeasure.uuid
        };

    } catch (error) {
        throw new Error(`Erro ao processar a leitura do medidor ${error}.`);
    } finally {
        await prisma.$disconnect();
    }
};