import Link from 'next/link';
import { Home, Car, ParkingSquare, Layers, Settings } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/parking-lots" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
              <ParkingSquare className="h-5 w-5" />
              <span>Parking Lots</span>
            </Link>
            <Link href="/levels" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
              <Layers className="h-5 w-5" />
              <span>Levels</span>
            </Link>
            <Link href="/parking-spots" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
              <ParkingSquare className="h-5 w-5" />
              <span>Parking Spots</span>
            </Link>
            <Link href="/vehicles" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
              <Car className="h-5 w-5" />
              <span>Vehicles</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 