'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Layers } from 'lucide-react';

interface Level {
  id: string;
  levelNumber: number;
  parkingLotId: string;
  parkingSpots: any[];
}

interface ParkingLot {
  id: string;
  name: string;
}

export default function LevelsPage() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLevel, setNewLevel] = useState({ levelNumber: 0, parkingLotId: '' });
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);

  useEffect(() => {
    fetchLevels();
    fetchParkingLots();
  }, []);

  const fetchLevels = async () => {
    try {
      const response = await fetch('/api/level');
      const data = await response.json();
      setLevels(data);
    } catch (error) {
      console.error('Error fetching levels:', error);
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

  const handleAddLevel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/level', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLevel),
      });
      if (response.ok) {
        setShowAddModal(false);
        setNewLevel({ levelNumber: 0, parkingLotId: '' });
        fetchLevels();
      }
    } catch (error) {
      console.error('Error adding level:', error);
    }
  };

  const handleUpdateLevel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLevel) return;

    try {
      const response = await fetch(`/api/level/${editingLevel.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLevel),
      });
      if (response.ok) {
        setEditingLevel(null);
        setNewLevel({ levelNumber: 0, parkingLotId: '' });
        fetchLevels();
      }
    } catch (error) {
      console.error('Error updating level:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this level?')) {
      try {
        const response = await fetch(`/api/level/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchLevels();
        }
      } catch (error) {
        console.error('Error deleting level:', error);
      }
    }
  };

  const getParkingLotName = (parkingLotId: string) => {
    const lot = parkingLots.find(lot => lot.id === parkingLotId);
    return lot ? lot.name : 'Unknown';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">Levels</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-800"
        >
          <Plus size={20} />
          <span>Add Level</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map(level => (
          <div key={level.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <Layers className="h-6 w-6 text-black" />
                <div>
                  <h3 className="text-xl font-bold text-black">Level {level.levelNumber}</h3>
                  <p className="text-black font-semibold">Parking Lot: {getParkingLotName(level.parkingLotId)}</p>
                  <p className="text-black font-medium">Spots: {level.parkingSpots?.length || 0}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingLevel(level);
                    setNewLevel({ levelNumber: level.levelNumber, parkingLotId: level.parkingLotId });
                  }}
                  className="text-black hover:text-gray-700"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(level.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingLevel) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-black mb-4">
              {editingLevel ? 'Edit Level' : 'Add Level'}
            </h2>
            <form onSubmit={editingLevel ? handleUpdateLevel : handleAddLevel}>
              <div className="mb-4">
                <label className="block text-black font-semibold mb-2">Level Number</label>
                <input
                  type="number"
                  value={newLevel.levelNumber}
                  onChange={(e) => setNewLevel({ ...newLevel, levelNumber: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:border-black text-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-black font-semibold mb-2">Parking Lot</label>
                <select
                  value={newLevel.parkingLotId}
                  onChange={(e) => setNewLevel({ ...newLevel, parkingLotId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:border-black text-black"
                  required
                >
                  <option value="">Select Parking Lot</option>
                  {parkingLots.map(lot => (
                    <option key={lot.id} value={lot.id} className="text-black">
                      {lot.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingLevel(null);
                    setNewLevel({ levelNumber: 0, parkingLotId: '' });
                  }}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  {editingLevel ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 