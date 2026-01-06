import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE = "http://dev.adenali.com/api/fleetservice";

export default function FleetManager() {
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [fleets, setFleets] = useState([]);
  const [name, setName] = useState("");
  const [attributes, setAttributes] = useState([{ key: "", value: "" }]);
  const [editingFleetId, setEditingFleetId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = window.sessionStorage.getItem("jwtToken");

  // Fetch fleets for owner (useCallback to avoid useEffect warning)
  const fetchFleets = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/owners/${ownerId}/fleets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFleets(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [ownerId, token]);

  useEffect(() => {
    fetchFleets();
  }, [fetchFleets]);

  // Dynamic attribute helpers
  const addAttribute = () => setAttributes([...attributes, { key: "", value: "" }]);
  const removeAttribute = (index) => setAttributes(attributes.filter((_, i) => i !== index));
  const updateAttribute = (index, field, value) =>
    setAttributes(attributes.map((attr, i) => (i === index ? { ...attr, [field]: value } : attr)));

  // Owner email submit
  const handleOwnerSubmit = () => {
    setOwnerId(ownerEmail); // treat owner email as ownerId
    fetchFleets();
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setAttributes([{ key: "", value: "" }]);
    setEditingFleetId(null);
  };

  // Create or update fleet
  const saveFleet = async () => {
    setError(null);
    const attrObj = {};
    for (const { key, value } of attributes) {
      if (key) attrObj[key] = value;
    }

    try {
      let response;
      if (editingFleetId) {
        // Update fleet
        response = await axios.put(
          `${API_BASE}/fleets/${editingFleetId}`,
          { name, attributes: attrObj },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        setFleets(fleets.map((f) => (f.id === editingFleetId ? response.data : f)));
      } else {
        // Create fleet
        response = await axios.post(
          `${API_BASE}/owners/${ownerId}/fleets`,
          { name, attributes: attrObj },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        setFleets([...fleets, response.data]);
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Edit fleet
  const editFleet = (fleet) => {
    setEditingFleetId(fleet.id);
    setName(fleet.name);
    setAttributes(Object.entries(fleet.attributes || {}).map(([key, value]) => ({ key, value })));
  };

  // Delete fleet
  const deleteFleet = async (fleetId) => {
    if (!window.confirm("Are you sure you want to delete this fleet?")) return;
    try {
      await axios.delete(`${API_BASE}/fleets/${fleetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFleets(fleets.filter((f) => f.id !== fleetId));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Fleet Management</h2>

      {/* Owner Email Input */}
      <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
        <input
          placeholder="Owner Email"
          value={ownerEmail}
          onChange={(e) => setOwnerEmail(e.target.value)}
          className="border p-3 flex-1 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleOwnerSubmit}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition w-full md:w-auto"
        >
          Load Fleets
        </button>
      </div>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
      {loading && <p className="text-gray-500 text-center">Loading fleets...</p>}

      {ownerId && (
        <>
          {/* Fleet Form */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
            <input
              placeholder="Fleet Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <h3 className="font-semibold mb-2 text-gray-700">Attributes</h3>
            {attributes.map((attr, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  placeholder="Attribute Name"
                  value={attr.key}
                  onChange={(e) => updateAttribute(index, "key", e.target.value)}
                  className="border p-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <input
                  placeholder="Attribute Value"
                  value={attr.value}
                  onChange={(e) => updateAttribute(index, "value", e.target.value)}
                  className="border p-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  onClick={() => removeAttribute(index)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addAttribute}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition mb-4"
            >
              + Add Attribute
            </button>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={saveFleet}
                disabled={!name}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {editingFleetId ? "Update Fleet" : "Create Fleet"}
              </button>
              {editingFleetId && (
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Fleet List */}
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Fleets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fleets.map((fleet) => (
              <div
                key={fleet.id}
                className="border p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col justify-between bg-white"
              >
                <div className="flex justify-between items-start mb-3">
                  <strong className="text-lg text-gray-800">{fleet.name}</strong>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editFleet(fleet)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteFleet(fleet.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="text-sm bg-gray-100 p-3 rounded">
                  {Object.entries(fleet.attributes || {}).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b py-1 last:border-b-0">
                      <span className="font-medium text-gray-700">{k}</span>
                      <span className="text-gray-800">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
