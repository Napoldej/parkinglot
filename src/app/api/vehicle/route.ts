import { PrismaClient } from "@prisma/client"
import { Vehicle } from "@/app/lib/vehicle";


// model Vehicle {
//     id           String       @id @default(auto()) @map("_id") @db.ObjectId
//     licenseplate String
//     size         String
//     type         String
//     parkingSpot  ParkingSpot? @relation("SpotVehicle")
//   }

const prisma = new PrismaClient();

export async function GET() {
    const vehicles = await prisma.vehicle.findMany(); 
    return Response.json(vehicles);
}


export async function POST(request: Request){
    const { licenseplate, size, type } = await request.json();
    const vehicle = new Vehicle(licenseplate, size, type);
    const created = await vehicle.create();
    return Response.json(created);
}