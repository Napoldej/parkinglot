// model Level {
//     id            String         @id @default(auto()) @map("_id") @db.ObjectId
//     levelNumber   Int
//     parkingSpots  ParkingSpot[]  @relation("LevelParkingSpots")
//     parkingLotId  String         @db.ObjectId  // Added this
//     parkingLot    ParkingLot     @relation("ParkingLotLevels", fields: [parkingLotId], references: [id])  // Added this
//   }

import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export async function DELETE(req: Request, props: {params: Promise<{id: string}>}) {
    try {
        const params = await props.params;
        const id = params.id;

        // First check if the level exists
        const level = await prisma.level.findUnique({
            where: { id: id },
            include: {
                parkingSpots: true
            }
        });

        if (!level) {
            return Response.json({ error: "Level not found" }, { status: 404 });
        }

        // Delete all parking spots first
        await prisma.parkingSpot.deleteMany({
            where: { levelId: id }
        });

        // Then delete the level
        const deleted = await prisma.level.delete({
            where: { id: id }
        });

        return Response.json({ 
            message: "Level and all related parking spots deleted successfully",
            deleted: deleted
        }, { status: 200 });
    } catch (error: any) {
        console.error("Delete error:", error);
        return Response.json({ 
            error: "Failed to delete level",
            details: error.message 
        }, { status: 500 });
    }
}

export async function PUT(req: Request, {params}: {params: {id: string}}) {
    const id = params.id;
    const { levelNumber, parkingLotId } = await req.json()
    const updated = await prisma.level.update({
        where:{
            id:id
        },
        data:{
            levelNumber: levelNumber,
            parkingLotId: parkingLotId
        }
    })
    Response.json(updated, {status: 200});
}