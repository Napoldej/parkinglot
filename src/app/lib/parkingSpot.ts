import { PrismaClient } from "@prisma/client";
import { randomInt } from "crypto";
import { ObjectId } from "mongodb";


const prisma = new PrismaClient();
export class ParkingSpot {
  id?: string;
  spotID: string;
  size: string;
  isOccupied: boolean;
  vehicle: any | undefined;
  levelId: string;

  constructor(spotID: string, size: string, levelId: string, id?: string) {
    this.id = id;
    this.spotID = spotID;
    this.size = size;
    this.isOccupied = false;
    this.vehicle =  new ObjectId();
    this.levelId = levelId;
  }

  async create() {
    const spot = await prisma.parkingSpot.create({
      data: {
        spotID: this.spotID,
        size: this.size,
        levelId: this.levelId,
        isOccupied: false,
        vehicleId: this.vehicle
      },
    });
    this.id = spot.id;
    return spot;
  }

  static async read(id : string) {
    const spot = await prisma.parkingSpot.findUnique({
      where: {
        id:id
      }
  })
    if(spot == null){
      return null
  }
    return new ParkingSpot(spot.spotID, spot.size, spot.levelId, spot.id)
  }

  async assignVehicle(vehicle: any) {
    if (!this.isOccupied && vehicle.size === this.size) {
      await prisma.parkingSpot.update({
        where: { id: this.id },
        data: { isOccupied: true, vehicleId: vehicle.id },
      });
      this.isOccupied = true;
      this.vehicle = vehicle;
      return true;
    }
    return false;
  }

  async removeVehicle() {
    const tempID = new ObjectId().toString();
    await prisma.parkingSpot.update({
      where: { id: this.id },
      data: { isOccupied: false, vehicleId: tempID },
    });
    this.isOccupied = false;
    this.vehicle = tempID;
    return true;
  }
}

export default ParkingSpot;


