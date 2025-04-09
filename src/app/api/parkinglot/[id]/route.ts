import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request, props: {params: Promise<{id: string}>}) {
    const params = await props.params;
    const id = params.id;
    const deleted = await prisma.parkingLot.delete({
        where: {
            id: id
        }
    })
    return Response.json(`Deleted: ${JSON.stringify(id)}`, {status : 200})
}

export async function PUT(req: Request, {params}: {params: {id: string}}) {
    const id = params.id;
    const { name, location } = await req.json()
    if(name == null || location == null){
        Response.json("Does not has data", {status : 401})
    }
    const updated = await prisma.parkingLot.update({
        where:{
            id: id
        },
        data: {
            name: name,
            location: location
        }
    })
    return Response.json(updated, {status: 200})
}
