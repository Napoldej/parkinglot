'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, ParkingSquare, Car } from 'lucide-react';

interface ParkingSpot {
  id: string;
  spotID: string;
  size: string;
  isOccupied: boolean;
  levelId: string;
  vehicle?: any;
}

interface Level {
  id: string;
  levelNumber: number;
  parkingLotId: string;
}

interface Vehicle {
  id: string;
  licenseplate: string;
  size: string;
  type: string;
}

interface ParkingLot {
  id: string;
  name: string;
  location: string;
  levels: Level[];
}

export default function ParkingSpotsPage() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showParkModal, setShowParkModal] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [newSpot, setNewSpot] = useState({ spotID: '', size: 'Small', levelId: '' });
  const [selectedVehicle, setSelectedVehicle] = useState('');

  useEffect(() => {
    fetchSpots();
    fetchLevels();
    fetchVehicles();
    fetchParkingLots();
  }, []);

  const fetchSpots = async () => {
    try {
      const response = await fetch('/api/parkingspot');
      const data = await response.json();
      setSpots(data);
    } catch (error) {
      console.error('Error fetching parking spots:', error);
    }
  };

  const fetchLevels = async () => {
    try {
      const response = await fetch('/api/level');
      const data = await response.json();
      setLevels(data);
    } catch (error) {
      console.error('Error fetching levels:', error);
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

  const fetchParkingLots = async () => {
    try {
      const response = await fetch('/api/parkinglot');
      const data = await response.json();
      setParkingLots(data);
    } catch (error) {
      console.error('Error fetching parking lots:', error);
    }
  };

  const handleAddSpot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/parkingspot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSpot),
      });
      if (response.ok) {
        setShowAddModal(false);
        setNewSpot({ spotID: '', size: 'Small', levelId: '' });
        fetchSpots();
      }
    } catch (error) {
      console.error('Error adding parking spot:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this parking spot?')) {
      try {
        const response = await fetch(`/api/parkingspot/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchSpots();
        }
      } catch (error) {
        console.error('Error deleting parking spot:', error);
      }
    }
  };

  const handlePark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpot || !selectedVehicle) return;

    // Find the level to get the parkingLotId
    const level = levels.find(l => l.id === selectedSpot.levelId);
    if (!level) {
      console.error('Level not found');
      return;
    }

    try {
      const response = await fetch(`/api/parkinglot/${level.parkingLotId}/park`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId: selectedVehicle }),
      });
      if (response.ok) {
        setShowParkModal(false);
        setSelectedSpot(null);
        setSelectedVehicle('');
        fetchSpots();
      }
    } catch (error) {
      console.error('Error parking vehicle:', error);
    }
  };

  const handleUnpark = async (spotId: string) => {
    try {
      const response = await fetch(`/api/parkingspot/${spotId}/unpark`, {
        method: 'PUT',
      });
      if (response.ok) {
        fetchSpots();
      }
    } catch (error) {
      console.error('Error unparking vehicle:', error);
    }
  };

  const getLevelInfo = (levelId: string) => {
    const level = levels.find(l => l.id === levelId);
    if (!level) return 'Unknown Level';
    
    const parkingLot = parkingLots.find(lot => lot.id === level.parkingLotId);
    return parkingLot 
      ? `${parkingLot.name} - Level ${level.levelNumber}` 
      : `Level ${level.levelNumber}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">Parking Spots</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-800"
        >
          <Plus size={20} />
          <span>Add Parking Spot</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spots.map(spot => (
          <div key={spot.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <ParkingSquare className={`h-6 w-6 ${spot.isOccupied ? 'text-red-500' : 'text-green-500'}`} />
                <div>
                  <h3 className="text-xl font-bold text-black">Spot {spot.spotID}</h3>
                  <p className="text-black font-semibold">Size: {spot.size}</p>
                  <p className="text-black font-medium">{getLevelInfo(spot.levelId)}</p>
                  {spot.isOccupied && spot.vehicle && (
                    <p className="text-black font-medium mt-1">
                      Vehicle: {spot.vehicle.licenseplate}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {!spot.isOccupied ? (
                  <button
                    onClick={() => {
                      setSelectedSpot(spot);
                      setShowParkModal(true);
                    }}
                    className="text-black hover:text-gray-700"
                  >
                    <Car size={20} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnpark(spot.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Car size={20} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(spot.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Spot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-black mb-4">Add Parking Spot</h2>
            <form onSubmit={handleAddSpot}>
              <div className="mb-4">
                <label className="block text-black font-semibold mb-2">Spot ID</label>
                <input
                  type="text"
                  value={newSpot.spotID}
                  onChange={(e) => setNewSpot({ ...newSpot, spotID: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:border-black text-black placeholder-gray-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-black font-semibold mb-2">Size</label>
                <select
                  value={newSpot.size}
                  onChange={(e) => setNewSpot({ ...newSpot, size: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:border-black text-black"
                  required
                >
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-black font-semibold mb-2">Level</label>
                <select
                  value={newSpot.levelId}
                  onChange={(e) => setNewSpot({ ...newSpot, levelId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:border-black text-black"
                  required
                >
                  <option value="">Select Level</option>
                  {levels.map(level => (
                    <option key={level.id} value={level.id} className="text-black">
                      {getLevelInfo(level.id)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewSpot({ spotID: '', size: 'Small', levelId: '' });
                  }}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Park Vehicle Modal */}
      {showParkModal && selectedSpot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-black mb-4">Park Vehicle</h2>
            <form onSubmit={handlePark}>
              <div className="mb-4">
                <label className="block text-black font-semibold mb-2">Select Vehicle</label>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:border-black text-black"
                  required
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id} className="text-black">
                      {vehicle.licenseplate} ({vehicle.size})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowParkModal(false);
                    setSelectedSpot(null);
                    setSelectedVehicle('');
                  }}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  Park
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 