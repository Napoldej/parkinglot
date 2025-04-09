import { PrismaClient } from "@prisma/client";
import { ParkingLot } from "@/app/lib/parkingLot";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const { name, location } = await req.json()
    const parkingLot = new ParkingLot(name, location)
    const created = await parkingLot.create()
    return Response.json(created, {status: 200})
}

export async function GET(req: Request){
    const parkingLots = await prisma.parkingLot.findMany({
        include: {
            levels: {
                include: {
                    parkingSpots: {
                        include: {
                            vehicle: true
                        }
                    }
                }
            }
        }
    })
    return Response.json(parkingLots, {status : 200})
}