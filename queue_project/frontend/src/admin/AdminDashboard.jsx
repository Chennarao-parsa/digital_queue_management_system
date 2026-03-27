import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQueueTracking, getTokenStats, getOrganizations } from "../services/api";
import "../styles/admin.css";

function AdminDashboard() {

  const navigate = useNavigate();

  // states
  const [tokens, setTokens] = useState([]);
  const [stats, setStats] = useState({});
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");

  // check admin login + fetch data
  useEffect(() => {

    if (localStorage.getItem("admin") !== "true") {
      navigate("/admin");
      return;
    }

    getOrganizations().then(res => setOrgs(res.data));
    getQueueTracking().then(res => setTokens(res.data));
    getTokenStats().then(res => setStats(res.data));

  }, [navigate]);

  // ✅ FILTER LOGIC (FIXED & SAFE)
  const filteredTokens = selectedOrg
    ? tokens.filter(t => Number(t.organization_id) === Number(selectedOrg))
    : tokens;

  // logout
  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/admin");
  };

  return (

    <div className="admin-layout">

      {/* Sidebar */}
      <div className="sidebar">

        <h2>Queue Admin</h2>

        {/* All */}
        <button
          className={selectedOrg === "" ? "active-btn" : ""}
          onClick={() => setSelectedOrg("")}
        >
          All
        </button>

        {/* Dynamic Organizations */}
        {orgs.map(org => (
          <button
            key={org.id}
            className={Number(selectedOrg) === Number(org.id) ? "active-btn" : ""}
            onClick={() => setSelectedOrg(org.id)}
          >
            {org.name}
          </button>
        ))}

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

      </div>

      {/* Main */}
      <div className="main-content">

        <h1>Dashboard</h1>

        {/* Stats */}
        <div className="stats">

          <div className="card">
            <h3>Total</h3>
            <p>{stats.total_tokens || 0}</p>
          </div>

          <div className="card">
            <h3>Waiting</h3>
            <p>{stats.waiting_tokens || 0}</p>
          </div>

          <div className="card">
            <h3>Serving</h3>
            <p>{stats.serving_tokens || 0}</p>
          </div>

          <div className="card">
            <h3>Completed</h3>
            <p>{stats.completed_tokens || 0}</p>
          </div>

        </div>

        {/* Table */}
        <h2>Queue Tracking</h2>

        <table className="token-table">

          <thead>
            <tr>
              <th>Token</th>
              <th>Service</th>
              <th>Status</th>
              <th>Counter</th>
              <th>Organization</th> {/* ✅ Added for clarity */}
            </tr>
          </thead>

          <tbody>

            {filteredTokens.length > 0 ? (
              filteredTokens.map(t => (
                <tr key={t.id}>
                  <td>{t.token_number}</td>
                  <td>{t.service_name}</td>
                  <td className={t.status}>{t.status}</td>
                  <td>{t.counter_name || "-"}</td>
                  <td>{t.organization_name || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No data available
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>

  );
}

export default AdminDashboard;