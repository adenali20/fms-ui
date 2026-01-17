import { NavLink } from "react-router-dom";

export default function Navbar() {
  const base = "px-4 py-2 rounded-lg font-medium transition-all duration-200 text-center";
  const activeBlue = "bg-blue-600 text-white shadow-lg scale-105";
  const activeGreen = "bg-green-600 text-white shadow-lg scale-105";
  const activePurple = "bg-purple-600 text-white shadow-lg scale-105";
  const inactive = "bg-gray-200 text-gray-700 hover:bg-gray-300";

  return (
    <nav className="flex gap-4 p-4 bg-white shadow sticky top-0 z-50 rounded-b-lg">
      
      <NavLink
        to="/nt"
        end
        className={({ isActive }) => `${base} ${isActive ? activeBlue : inactive}`}
      >
        🏠 Home
      </NavLink>

      <NavLink
        to="/nt/fleets"
        className={({ isActive }) => `${base} ${isActive ? activeBlue : inactive}`}
      >
        🚚 Fleets
      </NavLink>

      <NavLink
        to="/nt/owners"
        className={({ isActive }) => `${base} ${isActive ? activeGreen : inactive}`}
      >
        👥 Owners
      </NavLink>

      <NavLink
        to="/nt/devices"
        className={({ isActive }) => `${base} ${isActive ? activePurple : inactive}`}
      >
        📱 Devices
      </NavLink>

    </nav>
  );
}
