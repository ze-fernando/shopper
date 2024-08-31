import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

import { IResponse, IRequest } from "../interfaces/Iupload";
import prisma from '../dbConfig/prisma';
import { fileManagerAI } from "./fileManager";


function fileToGenerativePart(path: string, mimeType: string) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType
      },
    };
  }


export default async function sendImg(measure: IRequest, image64: string): Promise<IResponse>{    
    try {        
        const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

        const { imagePath, getResponse } = await fileManagerAI(image64);

        const model = gemini.getGenerativeModel({
            model: "gemini-1.5-pro",
        });     

        const img = fileToGenerativePart(image64, 'image/jpg');
        const prompt = "Return the consumption number of a reading";
        
        const result = await model.generateContent([prompt, img]);    

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
                image_url: getResponse.uri,
                costumer_code: measure.customer_code
            }
        });

        return {
            image_url: getResponse.uri,
            measure_value: number,
            measure_uuid: newMeasure.uuid
        };

    } catch (error) {
        console.log(error)
        throw new Error(`${error}`);
    } finally {
        await prisma.$disconnect();
    }
};