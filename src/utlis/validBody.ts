import prisma from "../dbConfig/prisma";

export default async function isDoubleReport(date: Date){
    const dateDb = await prisma.measure.findUnique({
        where: {
            datetime: new Date(date)
        }
    });

 if (dateDb){
        return true;
    }
    return false;
}
