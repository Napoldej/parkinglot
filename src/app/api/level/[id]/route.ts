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
    const params = await props.params;
    const id = params.id
    const level = await prisma.level.delete({
        where:{
            id: id
        }
    })
    return Response.json(`Delete: ${JSON.stringify(level)}`, {status: 200})
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