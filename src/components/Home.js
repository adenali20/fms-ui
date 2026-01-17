import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const adverts = [
    {
      title: "🚚 Manage Fleets",
      description: "Add, view, and manage all your fleets easily from a single dashboard.",
      link: "/nt/fleets",
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "📱 Track Devices",
      description: "Attach devices and monitor them in real-time for better operations.",
      link: "/nt/devices",
      color: "from-green-400 to-green-600",
    },
    {
      title: "👥 Owner Management",
      description: "Keep all fleet owners organized and up-to-date effortlessly.",
      link: "/nt/owners",
      color: "from-purple-400 to-purple-600",
    },
  ];

  return (
    <div className="flex justify-center py-12 px-4 bg-gray-50 min-h-screen">
      <div className="w-full max-w-6xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-800">Welcome to Fleet Dashboard 🚀</h1>
          <p className="text-gray-600 text-lg">
            Quick access to fleets, devices, and owners in a friendly interface.
          </p>
        </div>

        {/* Advert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {adverts.map((ad, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer mx-auto"
              onClick={() => navigate(ad.link)}
            >
              {/* Card Header with Gradient */}
              <div className={`p-6 bg-gradient-to-br ${ad.color}`}>
                <h2 className="text-xl font-bold text-white">{ad.title}</h2>
              </div>
              {/* Card Body */}
              <div className="p-6">
                <p className="text-gray-700 mb-4">{ad.description}</p>
                <button
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition shadow"
                >
                  Go
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Quick Links</h2>
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow"
              onClick={() => navigate("/nt/fleets")}
            >
              Fleets
            </button>
            <button
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow"
              onClick={() => navigate("/nt/devices")}
            >
              Devices
            </button>
            <button
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition shadow"
              onClick={() => navigate("/nt/owners")}
            >
              Owners
            </button>
          </div>
        </div>

        {/* Tips / Announcements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-yellow-100 rounded-xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">💡 Tip</h3>
            <p className="text-gray-800">
              Use the Fleets section to quickly add and manage your vehicles efficiently.
            </p>
          </div>
          <div className="bg-pink-100 rounded-xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">📢 Announcement</h3>
            <p className="text-gray-800">
              New device tracking features coming soon! Stay tuned for updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
