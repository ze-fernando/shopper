import { Request, Response } from "express";

import prisma from "../dbConfig/prisma";

export default async function listByCodeController(req: Request, res: Response) {
    const { code } = req.params;
    const { type } = req.query;

    if (type && !['WATER', 'GAS'].includes(type as string)) {
        return res.status(400).json({
          error_code: "INVALID_TYPE",
          error_description: "Tipo de medição não permitida"
        });
      }
  
    try {
      const measures = await prisma.measure.findMany({
        where: {
          costumer_code: code,
          ...(type && { measureType: { equals: type, mode: 'insensitive' } }),
        },
        take: 15,
        skip: 0
      });
  
      if (measures.length === 0) {
        return res.status(404).json({
          error_code: "MEASURES_NOT_FOUND",
          error_description: "Nenhuma leitura encontrada",
        });
      }
  
      return res.status(200).json({
        customer_code: code,
        measures,
      });
    } catch (error) {

      return res.status(500).json({
        error_code: "INTERNAL_SERVER_ERROR",
        error_description: "Ocorreu um erro interno no servidor",
      });
    }
  }