import { useEffect, useState } from "react";
import axios from "../api/axios";

/* ------------------ GraphQL Helper ------------------ */

const graphqlRequest = async (query, variables = {}) => {
  const token = sessionStorage.getItem("jwtToken");

  const response = await axios.post(
    "/api/fleetservice/graphql",
    { query, variables },
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

/* ------------------ Component ------------------ */

export default function FleetManager() {
  const PAGE_SIZE = 5;

  const [fleets, setFleets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [endCursor, setEndCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [fleetForm, setFleetForm] = useState({
    name: "",
    plate: ""
  });

  const [deviceForm, setDeviceForm] = useState({
    fleetId: "",
    name: "",
    number: ""
  });

  /* ------------------ Fetch Fleets (Paginated) ------------------ */

  const loadFleets = async (loadMore = false) => {
    if (loading) return;

    setLoading(true);
    try {
      const data = await graphqlRequest(
        `
        query Fleets($after: String, $size: Int!) {
          fleetsWithPagination(after: $after, size: $size) {
            edges {
              cursor
              node {
                id
                name
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
        `,
        {
          after: loadMore ? endCursor : null,
          size: PAGE_SIZE
        }
      );

      const connection = data.fleetsWithPagination;
      const newFleets = connection.edges.map(e => e.node);

      setFleets(prev =>
        loadMore ? [...prev, ...newFleets] : newFleets
      );

      setEndCursor(connection.pageInfo.endCursor);
      setHasNextPage(connection.pageInfo.hasNextPage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFleets(false);
  }, []);

  /* ------------------ Create Fleet ------------------ */

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

    setFleetForm({ name: "", plate: "" });

    // Reload from first page
    setEndCursor(null);
    loadFleets(false);
  };

  /* ------------------ Attach Device ------------------ */

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

    setDeviceForm({ fleetId: "", name: "", number: "" });
  };

  /* ------------------ UI ------------------ */

  return (
    <div style={container}>
      <h1 style={title}>Fleet & Device Manager</h1>

      {/* Create Fleet */}
      <div style={card}>
        <h2>Create Fleet</h2>

        <input
          placeholder="Fleet name"
          value={fleetForm.name}
          onChange={(e) =>
            setFleetForm({ ...fleetForm, name: e.target.value })
          }
          style={input}
        />

        <input
          placeholder="Plate"
          value={fleetForm.plate}
          onChange={(e) =>
            setFleetForm({ ...fleetForm, plate: e.target.value })
          }
          style={input}
        />

        <button onClick={handleCreateFleet} style={primaryBtn}>
          Create Fleet
        </button>
      </div>

      {/* Attach Device */}
      <div style={card}>
        <h2>Attach Device</h2>

        <input
          placeholder="Fleet ID"
          value={deviceForm.fleetId}
          onChange={(e) =>
            setDeviceForm({ ...deviceForm, fleetId: e.target.value })
          }
          style={input}
        />

        <input
          placeholder="Device name"
          value={deviceForm.name}
          onChange={(e) =>
            setDeviceForm({ ...deviceForm, name: e.target.value })
          }
          style={input}
        />

        <input
          placeholder="Phone number"
          value={deviceForm.number}
          onChange={(e) =>
            setDeviceForm({ ...deviceForm, number: e.target.value })
          }
          style={input}
        />

        <button onClick={handleAttachDevice} style={successBtn}>
          Attach Device
        </button>
      </div>

      {/* Fleets List */}
      <div style={card}>
        <h2>Existing Fleets</h2>

        {fleets.map((fleet) => (
          <div key={fleet.id} style={row}>
            <span>{fleet.name}</span>
            <span style={muted}>{fleet.id}</span>
          </div>
        ))}

        {hasNextPage && (
          <button
            onClick={() => loadFleets(true)}
            disabled={loading}
            style={loadMoreBtn}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------ Styles ------------------ */

const container = {
  padding: "2rem",
  maxWidth: "800px",
  margin: "0 auto",
  fontFamily: "Arial, sans-serif"
};

const title = {
  fontSize: "1.8rem",
  fontWeight: "bold",
  marginBottom: "1rem"
};

const card = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "1rem",
  marginBottom: "1rem"
};

const input = {
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

const loadMoreBtn = {
  ...primaryBtn,
  width: "100%",
  marginTop: "1rem",
  backgroundColor: "#0ea5e9"
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  padding: "0.5rem 0",
  borderBottom: "1px solid #eee"
};

const muted = {
  fontSize: "0.8rem",
  color: "#666"
};
