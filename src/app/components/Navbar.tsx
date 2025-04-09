import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Car, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold">ParkingSystem</Link>
            <div className="flex space-x-4">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/parking-lots"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${isActive('/parking-lots')}`}
              >
                <Building2 size={20} />
                <span>Parking Lots</span>
              </Link>
              <Link
                to="/vehicles"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${isActive('/vehicles')}`}
              >
                <Car size={20} />
                <span>Vehicles</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar