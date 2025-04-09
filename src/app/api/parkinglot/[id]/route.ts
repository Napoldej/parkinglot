import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request, props: {params: Promise<{id: string}>}) {
    try {
        const params = await props.params;
        const id = params.id;
        
        // First check if the parking lot exists
        const parkingLot = await prisma.parkingLot.findUnique({
            where: { id: id },
            include: {
                levels: {
                    include: {
                        parkingSpots: true
                    }
                }
            }
        });

        if (!parkingLot) {
            return Response.json({ error: "Parking lot not found" }, { status: 404 });
        }

        // Delete all parking spots first
        for (const level of parkingLot.levels) {
            await prisma.parkingSpot.deleteMany({
                where: { levelId: level.id }
            });
        }

        // Delete all levels
        await prisma.level.deleteMany({
            where: { parkingLotId: id }
        });

        // Finally delete the parking lot
        const deleted = await prisma.parkingLot.delete({
            where: { id: id }
        });

        return Response.json({ 
            message: "Parking lot and all related data deleted successfully",
            deleted: deleted
        }, { status: 200 });
    } catch (error: any) {
        console.error("Delete error:", error);
        return Response.json({ 
            error: "Failed to delete parking lot",
            details: error.message 
        }, { status: 500 });
    }
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
