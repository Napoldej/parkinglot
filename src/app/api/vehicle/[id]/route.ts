import { NextResponse } from 'next/server';
import { PrismaClient} from '@prisma/client'  

const prisma = new PrismaClient();

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        
        // First check if the vehicle exists
        const vehicle = await prisma.vehicle.findUnique({
            where: { id }
        });

        if (!vehicle) {
            return Response.json(
                { error: 'Vehicle not found' },
                { status: 404 }
            );
        }

        // Delete the vehicle
        await prisma.vehicle.delete({
            where: { id }
        });

        return Response.json(
            { message: 'Vehicle deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        return Response.json(
            { error: 'Failed to delete vehicle' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const data = await request.json();

        // First check if the vehicle exists
        const vehicle = await prisma.vehicle.findUnique({
            where: { id }
        });

        if (!vehicle) {
            return Response.json(
                { error: 'Vehicle not found' },
                { status: 404 }
            );
        }

        // Update the vehicle
        const updatedVehicle = await prisma.vehicle.update({
            where: { id },
            data: {
                licenseplate: data.licenseplate,
                size: data.size,
                type: data.type
            }
        });

        return Response.json(updatedVehicle);
    } catch (error) {
        console.error('Error updating vehicle:', error);
        return Response.json(
            { error: 'Failed to update vehicle' },
            { status: 500 }
        );
    }
}

