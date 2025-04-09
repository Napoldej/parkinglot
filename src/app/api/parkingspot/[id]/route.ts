import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req : Request, {params}: {params: {id: string}}) {
    const id = params.id
    const deleted = await prisma.parkingSpot.delete({
        where:{
            id: id
        }
    })
    return Response.json(`Deleted: ${JSON.stringify(id)}`, {status: 200})
}

export async function UPDATE(req: Request, {params}: {params: {id: string}}) {
    const id = params.id
    const { spotID, size, levelId } = await req.json()
    const updated = await prisma.parkingSpot.update({
        where: {
            id: id
        },
        data: {
            spotID: spotID,
            size: size,
            levelId: levelId
        }
    })
    return Response.json(updated, {status: 200})
}