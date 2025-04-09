import { PrismaClient } from "@prisma/client";
import ParkingSpot from "@/app/lib/parkingSpot";


// constructor(spotID: string, size: string, levelId: string, id?: string) {
//     this.id = id;
//     this.spotID = spotID;
//     this.size = size;
//     this.isOccupied = false;
//     this.vehicle = null;
//     this.levelId = levelId;
//   }

const prisma = new PrismaClient();

export async function GET() {
    const parkingspot = await prisma.parkingSpot.findMany();
    return Response.json(parkingspot)
}


export async function POST(req: Request){
    const {spotID, size, levelId} = await req.json()
    const parkingspot = new ParkingSpot(spotID, size, levelId)
    const created = await parkingspot.create()
    return Response.json(created, {status: 200})
}