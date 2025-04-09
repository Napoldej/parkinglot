import React, { useEffect, useState } from 'react';
import { Building2, Car, Layers } from 'lucide-react';

interface ParkingLot {
  id: string;
  name: string;
  location: string;
  levels: Level[];
}

interface Level {
  id: string;
  levelNumber: number;
  parkingSpots: ParkingSpot[];
}

interface ParkingSpot {
  id: string;
  spotID: string;
  isOccupied: boolean;
}

interface Vehicle {
  id: string;
  licenseplate: string;
  size: string;
  type: string;
}

const Dashboard = () => {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    // Fetch parking lots
    fetch('/api/parking-lots')
      .then(res => res.json())
      .then(data => setParkingLots(data));

    // Fetch vehicles
    fetch('/api/vehicles')
      .then(res => res.json())
      .then(data => setVehicles(data));
  }, []);

  const totalSpots = parkingLots.reduce((acc, lot) => {
    return acc + lot.levels.reduce((levelAcc, level) => {
      return levelAcc + level.parkingSpots.length;
    }, 0);
  }, 0);

  const occupiedSpots = parkingLots.reduce((acc, lot) => {
    return acc + lot.levels.reduce((levelAcc, level) => {
      return levelAcc + level.parkingSpots.filter(spot => spot.isOccupied).length;
    }, 0);
  }, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <Building2 className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total Parking Lots</p>
              <p className="text-2xl font-bold">{parkingLots.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <Layers className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Parking Spots</p>
              <p className="text-2xl font-bold">{occupiedSpots} / {totalSpots}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <Car className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Total Vehicles</p>
              <p className="text-2xl font-bold">{vehicles.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Vehicles</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vehicles.slice(0, 5).map(vehicle => (
                  <tr key={vehicle.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.licenseplate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;