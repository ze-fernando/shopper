import { Router, Request, Response } from "express";
import * as fs from 'fs';

import isDoubleReport from "../utlis/validBody";

export async function uploadService(req: Request, res: Response){
    const {image, costumer_code, measure_datetime, measure_type} = req.body

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
        const imageBuffer = Buffer.from(image, 'base64');
        const imagePath = `uploads/${Date.now()}temp.jpg`; 
        fs.writeFileSync(imagePath, imageBuffer);

}

