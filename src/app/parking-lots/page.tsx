'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Building2 } from 'lucide-react';

interface ParkingLot {
  id: string;
  name: string;
  location: string;
  levels: any[];
}

export default function ParkingLotsPage() {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLot, setNewLot] = useState({ name: '', location: '' });
  const [editingLot, setEditingLot] = useState<ParkingLot | null>(null);

  useEffect(() => {
    fetchParkingLots();
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

  const handleAddParkingLot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/parkinglot', {
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

  const handleUpdateParkingLot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLot) return;

    try {
      const response = await fetch(`/api/parkinglot/${editingLot.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLot),
      });
      if (response.ok) {
        setEditingLot(null);
        setNewLot({ name: '', location: '' });
        fetchParkingLots();
      }
    } catch (error) {
      console.error('Error updating parking lot:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this parking lot?')) {
      try {
        const response = await fetch(`/api/parkinglot/${id}`, {
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">Parking Lots</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-800"
        >
          <Plus size={20} />
          <span>Add Parking Lot</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parkingLots.map(lot => (
          <div key={lot.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <Building2 className="h-6 w-6 text-black" />
                <div>
                  <h3 className="text-xl font-bold text-black">{lot.name}</h3>
                  <p className="text-black font-semibold">{lot.location}</p>
                  <p className="text-black font-medium">Levels: {lot.levels?.length || 0}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingLot(lot);
                    setNewLot({ name: lot.name, location: lot.location });
                  }}
                  className="text-black hover:text-gray-700"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(lot.id)}
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
      {(showAddModal || editingLot) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-black mb-4">
              {editingLot ? 'Edit Parking Lot' : 'Add Parking Lot'}
            </h2>
            <form onSubmit={editingLot ? handleUpdateParkingLot : handleAddParkingLot}>
              <div className="mb-4">
                <label className="block text-black font-semibold mb-2">Name</label>
                <input
                  type="text"
                  value={newLot.name}
                  onChange={(e) => setNewLot({ ...newLot, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:border-black text-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-black font-semibold mb-2">Location</label>
                <input
                  type="text"
                  value={newLot.location}
                  onChange={(e) => setNewLot({ ...newLot, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:border-black text-black"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingLot(null);
                    setNewLot({ name: '', location: '' });
                  }}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  {editingLot ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 