import { PrismaClient } from "@prisma/client";
import Level from "./levels";
import ParkingSpot from "./parkingSpot";

const prisma = new PrismaClient();

export class ParkingLot {
  id?: string;
  name: string;
  location: string;
  levels: Level[];

  constructor(name: string, location: string, levels: Level[] = [], id?: string) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.levels = levels;
  }

  async create() {
    const parkingLot = await prisma.parkingLot.create({
      data: {
        name: this.name,
        location: this.location,
      },
    });
    this.id = parkingLot.id;
    return parkingLot;
  }

  static async read(id: string) {
    const data = await prisma.parkingLot.findUnique({
      where: { id },
      include: { 
        levels: {
          include: { parkingSpots: true } 
        }
      },
    });
    
    if (!data) return null;
    
    const levelInstances = data.levels.map(levelData => 
      new Level(
        levelData.levelNumber, 
        levelData.parkingLotId,
        levelData.parkingSpots ? levelData.parkingSpots.map(spotData => 
          new ParkingSpot(spotData.spotID, spotData.size, levelData.id)
        ) : [],
        levelData.id
      )
    );

    return new ParkingLot(data.name, data.location, levelInstances, data.id);
  }

  async update(updates: { name?: string; location?: string }) {
    if (!this.id) throw new Error("ParkingLot must be created first");
    const updated = await prisma.parkingLot.update({
      where: { id: this.id },
      data: updates,
    });
    this.name = updated.name;
    this.location = updated.location;
    return updated;
  }

  async delete() {
    if (!this.id) throw new Error("ParkingLot must be created first");
    await prisma.parkingLot.delete({
      where: { id: this.id },
    });
  }

  async parkVehicle(vehicle: any) {
    for (let level of this.levels) {
      const spot = await level.findAvailableSpot(vehicle);
      if (spot) {
        return await spot.assignVehicle(vehicle);
      }
    }
    return null;
  }

  async addLevel(level: Level) {
    if (!this.id) await this.create();
    const createdLevel = await prisma.level.create({
      data: {
        levelNumber: level.levelNumber,
        parkingLotId: this.id!,
      },
    });
    this.levels.push(new Level(createdLevel.levelNumber, this.id ?? '', [], createdLevel.id));
    return createdLevel;
  }
}