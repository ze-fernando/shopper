import { Router, Request, Response } from "express";
import * as fs from 'fs';

import isDoubleReport from "../utlis/validBody";
import sendImg from "../LLM/gemini";
import { IRequest, IResponse } from "../interfaces/Iupload";

export async function uploadService(req: Request, res: Response){

    if (!req.body) {
        return res.status(400).json({
            error_code: "INVALID_DATA",
            error_description: "O corpo da requisição está vazio"
        });
    }

    const { image, costumer_code, measure_datetime, measure_type } = req.body;

    if(!image || !costumer_code ||
        !measure_datetime || !measure_type){
            res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "Os dados fornecidos no corpo da requisição são inválidos"
            });
        }

        if(isDoubleReport(measure_datetime)){
            res.status(409).json({
                error_code: "DOUBLE REPORT",
                error_description: "Leitura do mês já realizada"
            });
        }

        const measure: IRequest = {
            image: image,
            customer_code: costumer_code,
            measure_datetime: measure_datetime,
            measure_type: measure_type
        };

        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

        const imageBuffer = Buffer.from(base64Data, 'base64');
        const imagePath = `uploads/${Date.now()}.jpg`; 
        await fs.writeFileSync(imagePath, imageBuffer);

        const response: IResponse = await sendImg(measure, imagePath);

        return res.status(200).json(response);
}

