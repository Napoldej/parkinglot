import { PrismaClient } from "@prisma/client";
import ParkingSpot from "./parkingSpot";

const prisma = new PrismaClient();
export class Level {
  id?: string;
  levelNumber: number;
  parkingLotId: string;
  parkingSpots: ParkingSpot[];

  constructor(levelNumber: number, parkingLotId: string ,parkingSpots: ParkingSpot[] = [], id?: string) {
    this.id = id;
    this.levelNumber = levelNumber;
    this.parkingSpots = parkingSpots;
    this.parkingLotId = parkingLotId;
  }

  async create(parkingLotId: string) {
    try {
      const level = await prisma.level.create({
        data: {
          levelNumber: this.levelNumber,
          parkingLotId: this.parkingLotId,
        },
      });
      this.id = level.id;
      return level;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error(`Level number ${this.levelNumber} already exists in this parking lot`);
      }
      throw error;
    }
  }

  async findAvailableSpot(vehicle: any) {
    const availableSpot = await prisma.parkingSpot.findFirst({
      where: {
        levelId: this.id,
        isOccupied: false,
        size: vehicle.size,
      },
    });
    console.log("Available spot:")
    console.log(availableSpot)
    return availableSpot ? new ParkingSpot(availableSpot.spotID, availableSpot.size, this.id!, availableSpot.id) : null;
  }
}

export default Level