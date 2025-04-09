import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
export class Vehicle {
  id?: string;
  licenseplate: string;
  size: string;
  type: string;

  constructor(licenseplate: string, size: string, type: string, id?: string) {
    this.id = id;
    this.licenseplate = licenseplate;
    this.size = size;
    this.type = type;
  }


  async create() {
    const vehicle = await prisma.vehicle.create({
      data: {
        licenseplate: this.licenseplate,
        size: this.size,
        type: this.type,
      },
    });
    this.id = vehicle.id;
    return vehicle;
  }

  static async read(id : string){
    const vehicle = await prisma.vehicle.findUnique({
        where: {
          id:id
        }
    })
    if(vehicle == null){
      return null
    }
    return vehicle
  }
}