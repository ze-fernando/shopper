import { Request, Response } from 'express'
import { IRequest } from "../interfaces/Iconfirm";
import prisma from "../dbConfig/prisma";


export default async function confirmController(req: Request, res: Response) {
    try{
        const measure: IRequest = req.body

        if (!measure.measure_uuid || !measure.confirmed_value) {
            return res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "Os dados fornecidos no corpo da requisição são inválidos"
            });
          }
          const measureDB = await prisma.measure.findUnique({
            where: { uuid: measure.measure_uuid }
          })

          if(!measureDB){
            return res.status(409).json({
                    error_code: "CONFIRMATION_DUPLICATE",
                    error_description: "Leitura do mês já realizada"                   
            });
          }
          
          
          await prisma.measure.update({
            where: { uuid: measure.measure_uuid },
            data: { has_confirmed: true },
          });
          

          return res.status(200).json({sucess: true});
    } catch (RecordNotFoundError){
        return res.status(404).json({
            error_code: "MEASURE_NOT_FOUND",
            error_description: "Leitura do mês já realizada"               
        });
    }
    finally{
        prisma.$disconnect;
    }
}