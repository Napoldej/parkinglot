import React, { useEffect, useState } from 'react';
import { Building2, Plus, Trash2, Edit2 } from 'lucide-react';

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
  size: string;
  isOccupied: boolean;
}

const ParkingLots = () => {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLot, setNewLot] = useState({ name: '', location: '' });

  useEffect(() => {
    fetchParkingLots();
  }, []);

  const fetchParkingLots = () => {
    fetch('/api/parking-lots')
      .then(res => res.json())
      .then(data => setParkingLots(data));
  };

  const handleAddParkingLot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/parking-lots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLot),
      });
      if (response.ok) {
        setShowAddModal(false);
        setNewLot({ name: '', location: '' });
        fetchParkingLots();
      }
    } catch (error) {
      console.error('Error adding parking lot:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this parking lot?')) {
      try {
        const response = await fetch(`/api/parking-lots/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchParkingLots();
        }
      } catch (error) {
        console.error('Error deleting parking lot:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Parking Lots</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Add Parking Lot</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parkingLots.map(lot => (
          <div key={lot.id} className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-6 w-6 text-blue-500" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{lot.name}</h3>
                    <p className="text-gray-600">{lot.location}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(lot.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit2 size={20} />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-gray-700">Levels</h4>
                <div className="mt-2 space-y-2">
                  {lot.levels.map(level => (
                    <div key={level.id} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Level {level.levelNumber}</span>
                        <span className="text-sm text-gray-600">
                          {level.parkingSpots.filter(spot => spot.isOccupied).length} /{' '}
                          {level.parkingSpots.length} spots occupied
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Parking Lot</h2>
            <form onSubmit={handleAddParkingLot}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newLot.name}
                    onChange={e => setNewLot({ ...newLot, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={newLot.location}
                    onChange={e => setNewLot({ ...newLot, location: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Parking Lot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingLots;