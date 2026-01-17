/* eslint-disable */
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

  /* ---------- Modals ---------- */
  const [showFleetModal, setShowFleetModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  const [fleetForm, setFleetForm] = useState({ name: "", plate: "" });
  const [deviceForm, setDeviceForm] = useState({ fleetId: "", name: "", number: "" });

  /* ------------------ Fetch Fleets ------------------ */

  const loadFleets = async (loadMore = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const data = await graphqlRequest(
        `
        query Fleets($after: String, $size: Int!) {
          fleetsWithPagination(after: $after, size: $size) {
            edges {
              node { id name plate }
            }
            pageInfo { hasNextPage endCursor }
          }
        }
        `,
        { after: loadMore ? endCursor : null, size: PAGE_SIZE }
      );

      const conn = data.fleetsWithPagination;
      const newFleets = conn.edges.map(e => e.node);

      setFleets(prev => (loadMore ? [...prev, ...newFleets] : newFleets));
      setEndCursor(conn.pageInfo.endCursor);
      setHasNextPage(conn.pageInfo.hasNextPage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFleets(false);
  }, []);

  /* ------------------ Mutations ------------------ */

  const handleCreateFleet = async () => {
    await graphqlRequest(
      `mutation ($input: CreateFleetInput!) { createFleet(input: $input) { id } }`,
      { input: fleetForm }
    );

    setFleetForm({ name: "", plate: "" });
    setShowFleetModal(false);
    setEndCursor(null);
    loadFleets(false);
  };

  const handleAttachDevice = async () => {
    await graphqlRequest(
      `mutation ($input: CreateDeviceInput!) { attachDevice(input: $input) { id } }`,
      { input: deviceForm }
    );

    setDeviceForm({ fleetId: "", name: "", number: "" });
    setShowDeviceModal(false);
  };

  /* ------------------ UI ------------------ */

  return (
    <div style={container}>
      <h1 style={title}>Fleet & Device Manager</h1>

      <div style={actions}>
        <button style={primaryBtn} onClick={() => setShowFleetModal(true)}>+ Add Fleet</button>
        <button style={successBtn} onClick={() => setShowDeviceModal(true)}>+ Attach Device</button>
      </div>

      {/* Fleets List */}
      <div style={card}>
        <h2>Existing Fleets</h2>
        {fleets.map(f => (
          <div key={f.id} style={row}>
            <span>{f.name}</span>
            <span style={muted}>{f.id}</span>
          </div>
        ))}

        {hasNextPage && (
          <button style={loadMoreBtn} disabled={loading} onClick={() => loadFleets(true)}>
            {loading ? "Loading..." : "Load More"}
          </button>
        )}
      </div>

      {/* Fleet Modal */}
      {showFleetModal && (
        <Modal title="Create Fleet" onClose={() => setShowFleetModal(false)}>
          <input style={input} placeholder="Fleet name" value={fleetForm.name}
            onChange={e => setFleetForm({ ...fleetForm, name: e.target.value })} />
          <input style={input} placeholder="Plate" value={fleetForm.plate}
            onChange={e => setFleetForm({ ...fleetForm, plate: e.target.value })} />
          <button style={primaryBtn} onClick={handleCreateFleet}>Create</button>
        </Modal>
      )}

      {/* Device Modal */}
      {showDeviceModal && (
        <Modal title="Attach Device" onClose={() => setShowDeviceModal(false)}>
          <input style={input} placeholder="Fleet ID" value={deviceForm.fleetId}
            onChange={e => setDeviceForm({ ...deviceForm, fleetId: e.target.value })} />
          <input style={input} placeholder="Device name" value={deviceForm.name}
            onChange={e => setDeviceForm({ ...deviceForm, name: e.target.value })} />
          <input style={input} placeholder="Phone number" value={deviceForm.number}
            onChange={e => setDeviceForm({ ...deviceForm, number: e.target.value })} />
          <button style={successBtn} onClick={handleAttachDevice}>Attach</button>
        </Modal>
      )}
    </div>
  );
}

/* ------------------ Modal ------------------ */

function Modal({ title, children, onClose }) {
  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>{title}</h2>
        {children}
        <button style={closeBtn} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

/* ------------------ Styles ------------------ */

const container = { maxWidth: 800, margin: "2rem auto", fontFamily: "Arial" };
const title = { fontSize: "1.8rem", marginBottom: "1rem" };
const actions = { display: "flex", gap: "1rem", marginBottom: "1rem" };
const card = { border: "1px solid #ddd", borderRadius: 8, padding: "1rem" };
const row = { display: "flex", justifyContent: "space-between", padding: "0.5rem 0" };
const muted = { fontSize: "0.8rem", color: "#666" };

const input = { width: "100%", padding: "0.5rem", marginBottom: "0.5rem" };

const primaryBtn = { padding: "0.5rem 1rem", background: "#4f46e5", color: "#fff", border: 0 };
const successBtn = { ...primaryBtn, background: "#16a34a" };
const loadMoreBtn = { ...primaryBtn, width: "100%", marginTop: "1rem", background: "#0ea5e9" };
const closeBtn = { marginTop: "1rem" };

const overlay = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
  display: "flex", alignItems: "center", justifyContent: "center"
};

const modal = {
  background: "white", padding: "1.5rem", borderRadius: 8, width: 400
};
