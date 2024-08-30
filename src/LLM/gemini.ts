import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { PrismaClient, Measure } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

import { IResponse, IRequest } from "../interfaces/Iupload";

const prisma = new PrismaClient();

//const measureDB: Measure;

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const fileGemini = new GoogleAIFileManager(process.env.GEMINI_API_KEY as string);
const model = gemini.getGenerativeModel({
    model: "gemini-1.5-pro",
});

export default async function sendImg(measure: IRequest, imageName: string): Promise<IResponse>{    
    try {

        const measureUuid: string = uuidv4();


        const response = await fileGemini.uploadFile(imageName, {
            mimeType: "image/jpeg",
            displayName: "Meter reading image",
        });

        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: response.file.mimeType,
                    fileUri: response.file.uri
                }
            },
            { text: "mostre-me um numero de 0 a 10" },
        ]);

        if (!result.response || !result.response.text) {
            throw new Error("Invalid response from Gemini API.");
        }

        const meterReading = result.response.text();

        const newMeasure = await prisma.measure.create({
            data: {
                uuid: measureUuid,
                datetime: new Date(measure.measure_datetime),
                type: measure.measure_type,
                value: parseInt(meterReading),
                has_confirmed: false,
                image_url: response.file.uri,
                costumer_code: measure.customer_code
            }
        });

        return {
            image_url: response.file.uri,
            measure_value: parseInt(meterReading),
            measure_uuid: newMeasure.uuid
        };

    } catch (error) {
        throw new Error(`Erro ao processar a leitura do medidor ${error}.`);
    } finally {
        await prisma.$disconnect();
    }
};