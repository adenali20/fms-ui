import { Link, Outlet } from "react-router-dom";

/**
 * Home Page Dashboard
 * - Links to Fleets, Owners, Devices pages
 * - Renders selected route in Outlet
 */
export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Fleet Service Dashboard</h1>
      <nav className="flex gap-4 mb-6">
        <Link to="fleets" className="px-4 py-2 bg-blue-600 text-white rounded">Fleets</Link>
        <Link to="owners" className="px-4 py-2 bg-green-600 text-white rounded">Owners</Link>
        <Link to="devices" className="px-4 py-2 bg-purple-600 text-white rounded">Devices</Link>
      </nav>
      <div className="border p-4 rounded shadow">
        {/* Render selected route here */}
        <Outlet />
      </div>
    </div>
  );
}
