import  ParkingSpot  from "@/app/lib/parkingSpot";


export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;  
    const spot = await ParkingSpot.read(id)
    if (!spot) {
        return Response.json("Parking lot not found", { status: 404 });
    }
    const unparked = await spot.removeVehicle(); 
    if(unparked == true){
        return Response.json("Vehicle has been unparked", { status: 200 });
    }
    return Response.json("Vehicle could not be unparked", { status: 400 });
}
