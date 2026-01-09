import { useEffect, useState } from "react";
import axios from '../api/axios';
const graphqlRequest = async (query, variables = {}) => {
  const token = sessionStorage.getItem("jwtToken");

  const response = await axios.post(
    "/api/fleetservice/graphql", // or "/api/fleetservice/graphql"
    {
      query,
      variables
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );
  if (response.data.errors) {
    console.error(response.data.errors);
    throw new Error("GraphQL error");
  }

  return response.data.data;
};

export default function FleetManager() {
  const [fleets, setFleets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [fleetForm, setFleetForm] = useState({
    type: "CAR",
    name: "",
    model: "",
    year: 2024,
    brand: "",
    plate: ""
  });

  const [deviceForm, setDeviceForm] = useState({
    fleetId: "",
    name: "",
    number: ""
  });

  // ---------------------------
  // Fetch Fleets
  // ---------------------------
  const loadFleets = async () => {
    setLoading(true);
    try {
      const data = await graphqlRequest(`
        query {
          fleets {
            id
            name
            plate
          }
        }
      `);
      setFleets(data.fleets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFleets();
  }, []);

  // ---------------------------
  // Create Fleet
  // ---------------------------
  const handleCreateFleet = async () => {
    await graphqlRequest(
      `
      mutation ($input: CreateFleetInput!) {
        createFleet(input: $input) {
          id
          name
        }
      }
    `,
      { input: fleetForm }
    );

    setFleetForm({ ...fleetForm, name: "", plate: "" });
    loadFleets();
  };

  // ---------------------------
  // Attach Device
  // ---------------------------
  const handleAttachDevice = async () => {
    await graphqlRequest(
      `
      mutation ($input: CreateDeviceInput!) {
        attachDevice(input: $input) {
          id
          name
          fleetId
        }
      }
    `,
      { input: deviceForm }
    );

    setDeviceForm({ ...deviceForm, name: "", number: "" });
  };

  if (loading) return <p>Loading fleets...</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Fleet & Device Manager
      </h1>

      {/* Create Fleet */}
      <div style={cardStyle}>
        <h2>Create Fleet</h2>

        <input
          placeholder="Fleet name"
          value={fleetForm.name}
          onChange={(e) => setFleetForm({ ...fleetForm, name: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Plate"
          value={fleetForm.plate}
          onChange={(e) => setFleetForm({ ...fleetForm, plate: e.target.value })}
          style={inputStyle}
        />

        <button onClick={handleCreateFleet} style={primaryBtn}>
          Create Fleet
        </button>
      </div>

      {/* Attach Device */}
      <div style={cardStyle}>
        <h2>Attach Device</h2>

        <input
          placeholder="Fleet ID"
          value={deviceForm.fleetId}
          onChange={(e) => setDeviceForm({ ...deviceForm, fleetId: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Device name"
          value={deviceForm.name}
          onChange={(e) => setDeviceForm({ ...deviceForm, name: e.target.value })}
          style={inputStyle}
        />

        <input
          placeholder="Phone number"
          value={deviceForm.number}
          onChange={(e) => setDeviceForm({ ...deviceForm, number: e.target.value })}
          style={inputStyle}
        />

        <button onClick={handleAttachDevice} style={successBtn}>
          Attach Device
        </button>
      </div>

      {/* Fleets List */}
      <div style={cardStyle}>
        <h2>Existing Fleets</h2>
        {fleets.map((fleet) => (
          <div key={fleet.id} style={rowStyle}>
            <span>
              {fleet.name} ({fleet.plate})
            </span>
            <span style={{ fontSize: "0.8rem", color: "#666" }}>
              {fleet.id}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------ Styles ------------------ */

const cardStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "1rem",
  marginBottom: "1rem"
};

const inputStyle = {
  padding: "0.5rem",
  marginBottom: "0.5rem",
  width: "100%",
  borderRadius: "4px",
  border: "1px solid #ccc"
};

const primaryBtn = {
  padding: "0.5rem 1rem",
  backgroundColor: "#4f46e5",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

const successBtn = {
  ...primaryBtn,
  backgroundColor: "#16a34a"
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "0.5rem 0",
  borderBottom: "1px solid #eee"
};
