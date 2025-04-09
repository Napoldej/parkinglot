import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export class ParkingSpot {
  id?: string;
  spotID: string;
  size: string;
  isOccupied: boolean;
  vehicle: any | null;
  levelId: string;

  constructor(spotID: string, size: string, levelId: string, id?: string) {
    this.id = id;
    this.spotID = spotID;
    this.size = size;
    this.isOccupied = false;
    this.vehicle = null;
    this.levelId = levelId;
  }

  async create() {
    const spot = await prisma.parkingSpot.create({
      data: {
        spotID: this.spotID,
        size: this.size,
        levelId: this.levelId,
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
    await prisma.parkingSpot.update({
      where: { id: this.id },
      data: { isOccupied: false, vehicleId: null },
    });
    this.isOccupied = false;
    this.vehicle = null;
    return true;
  }
}

export default ParkingSpot;