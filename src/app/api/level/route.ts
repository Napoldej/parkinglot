// model Level {
//     id            String         @id @default(auto()) @map("_id") @db.ObjectId
//     levelNumber   Int
//     parkingSpots  ParkingSpot[]  @relation("LevelParkingSpots")
//     parkingLotId  String         @db.ObjectId  // Added this
//     parkingLot    ParkingLot     @relation("ParkingLotLevels", fields: [parkingLotId], references: [id])  // Added this
//   }

import { PrismaClient } from "@prisma/client";
import Level from "@/app/lib/levels";

const prisma = new PrismaClient();

export async function GET() {
    const level = await prisma.level.findMany({
        include: {
            parkingSpots: true
        }
    });
    return Response.json(level)
}

export async function POST(request: Request){
    const { levelNumber, parkingLotId } = await request.json();
    const level = new Level(levelNumber, parkingLotId);
    const created = await level.create(parkingLotId);
    return Response.json(created, {status: 200});
}