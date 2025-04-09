import { PrismaClient } from "@prisma/client";
import { ParkingLot } from "@/app/lib/parkingLot";
import { Vehicle } from "@/app/lib/vehicle";

const prisma = new PrismaClient();

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const parkingLot = await ParkingLot.read(id);
    
    if (!parkingLot) {
      return Response.json("Parking lot not found", { status: 404 });
    }
  
    const { vehicleId } = await request.json();
    const vehicle = await Vehicle.read(vehicleId);
    const parked = await (parkingLot as ParkingLot).parkVehicle(vehicle);
    if(parked == true){
        return Response.json("Vehicle has been parked", { status: 200 });
    }
    return Response.json("Vehicle could not be parked", { status: 400 });
  }

