import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request, props: {params: Promise<{id: string}>}) {
    try {
        const params = await props.params;
        const id = params.id;

        const parkingSpot = await prisma.parkingSpot.findUnique({
            where: { id: id },
            include: {
                vehicle: true
            }
        });

        if (!parkingSpot) {
            return Response.json({ error: "Parking spot not found" }, { status: 404 });
        }

        if (parkingSpot.vehicle) {
            await prisma.vehicle.update({
                where: { id: parkingSpot.vehicle.id },
                data: {
                    parkingSpot: {
                        disconnect: true
                    }
                }
            });
        }

        const deleted = await prisma.parkingSpot.delete({
            where: { id: id }
        });

        return Response.json({ 
            message: "Parking spot deleted successfully",
            deleted: deleted
        }, { status: 200 });
    } catch (error: any) {
        console.error("Delete error:", error);
        return Response.json({ 
            error: "Failed to delete parking spot",
            details: error.message 
        }, { status: 500 });
    }
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