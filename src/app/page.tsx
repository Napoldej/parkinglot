'use client';

import { useState, useEffect } from 'react';
import { Building2, Layers, ParkingSquare, Car } from 'lucide-react';

interface ParkingLot {
  id: string;
  name: string;
  location: string;
  levels: any[];
}

interface Vehicle {
  id: string;
  licenseplate: string;
  size: string;
  type: string;
  parkingSpot?: any;
}

export default function Home() {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    fetchParkingLots();
    fetchVehicles();
  }, []);

  const fetchParkingLots = async () => {
    try {
      const response = await fetch('/api/parkinglot');
      const data = await response.json();
      setParkingLots(data);
    } catch (error) {
      console.error('Error fetching parking lots:', error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicle');
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const totalSpots = parkingLots.reduce((acc, lot) => {
    return acc + lot.levels.reduce((levelAcc, level) => {
      return levelAcc + (level.parkingSpots?.length || 0);
    }, 0);
  }, 0);

  const occupiedSpots = vehicles.filter(vehicle => vehicle.parkingSpot).length;
  const availableSpots = totalSpots - occupiedSpots;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold">Parking Lots</h3>
              <p className="text-2xl font-bold">{parkingLots.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3">
            <Layers className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">Total Levels</h3>
              <p className="text-2xl font-bold">
                {parkingLots.reduce((acc, lot) => acc + lot.levels.length, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3">
            <ParkingSquare className="h-8 w-8 text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold">Available Spots</h3>
              <p className="text-2xl font-bold">{availableSpots}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3">
            <Car className="h-8 w-8 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold">Parked Vehicles</h3>
              <p className="text-2xl font-bold">{occupiedSpots}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Parking Lots</h2>
          <div className="space-y-4">
            {parkingLots.slice(0, 5).map(lot => (
              <div key={lot.id} className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{lot.name}</h3>
                  <p className="text-sm text-gray-600">{lot.location}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {lot.levels.length} levels
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recently Parked Vehicles</h2>
          <div className="space-y-4">
            {vehicles
              .filter(vehicle => vehicle.parkingSpot)
              .slice(0, 5)
              .map(vehicle => (
                <div key={vehicle.id} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{vehicle.licenseplate}</h3>
                    <p className="text-sm text-gray-600">
                      {vehicle.type} ({vehicle.size})
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    Spot {vehicle.parkingSpot.spotID}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
