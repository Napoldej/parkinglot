'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Car } from 'lucide-react';

interface Vehicle {
  id: string;
  licenseplate: string;
  size: string;
  type: string;
  parkingSpot?: any;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [newVehicle, setNewVehicle] = useState({
    licenseplate: '',
    size: 'Small',
    type: 'Car'
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicle');
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/vehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVehicle),
      });
      if (response.ok) {
        setShowAddModal(false);
        setNewVehicle({ licenseplate: '', size: 'Small', type: 'Car' });
        fetchVehicles();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add vehicle');
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Failed to add vehicle');
    }
  };

  const handleUpdateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;

    try {
      const response = await fetch(`/api/vehicle/${editingVehicle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVehicle),
      });
      if (response.ok) {
        setEditingVehicle(null);
        setNewVehicle({ licenseplate: '', size: 'Small', type: 'Car' });
        fetchVehicles();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update vehicle');
      }
    } catch (error) {
      console.error('Error updating vehicle:', error);
      alert('Failed to update vehicle');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      try {
        const response = await fetch(`/api/vehicle/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchVehicles();
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to delete vehicle');
        }
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert('Failed to delete vehicle');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">Vehicles</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-800"
        >
          <Plus size={20} />
          <span>Add Vehicle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map(vehicle => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <Car className="h-6 w-6 text-black" />
                <div>
                  <h3 className="text-xl font-bold text-black">{vehicle.licenseplate}</h3>
                  <p className="text-black font-semibold">Type: {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1).toLowerCase()}</p>
                  <p className="text-black font-medium">Size: {vehicle.size}</p>
                  {vehicle.parkingSpot && (
                    <p className="text-black font-medium mt-1">
                      Parked at: {vehicle.parkingSpot.spotID}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingVehicle(vehicle);
                    setNewVehicle({
                      licenseplate: vehicle.licenseplate,
                      size: vehicle.size,
                      type: vehicle.type
                    });
                  }}
                  className="text-black hover:text-gray-700"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
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
      {(showAddModal || editingVehicle) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-black mb-4">
              {editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
            </h2>
            <form onSubmit={editingVehicle ? handleUpdateVehicle : handleAddVehicle}>
              <div className="mb-4">
                <label className="block text-black font-semibold mb-2">License Plate</label>
                <input
                  type="text"
                  value={newVehicle.licenseplate}
                  onChange={(e) => setNewVehicle({ ...newVehicle, licenseplate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:border-black text-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-black font-semibold mb-2">Size</label>
                <select
                  value={newVehicle.size}
                  onChange={(e) => setNewVehicle({ ...newVehicle, size: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:border-black text-black"
                  required
                >
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-black font-semibold mb-2">Type</label>
                <select
                  value={newVehicle.type}
                  onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black focus:border-black text-black"
                  required
                >
                  <option value="Car">Car</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingVehicle(null);
                    setNewVehicle({ licenseplate: '', size: 'Small', type: 'Car' });
                  }}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                >
                  {editingVehicle ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 