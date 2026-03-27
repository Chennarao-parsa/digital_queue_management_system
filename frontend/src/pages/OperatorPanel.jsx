import { useState, useEffect } from "react";
import {
  getOrganizations,
  getCounters,
  callNext,
  completeToken,
  getQueue
} from "../services/api";

function OperatorPanel() {

  const [organizations, setOrganizations] = useState([]);
  const [org, setOrg] = useState("");

  const [counters, setCounters] = useState([]);
  const [counter, setCounter] = useState("");

  const [currentToken, setCurrentToken] = useState(null);

  // ==============================
  // LOAD ORGANIZATIONS
  // ==============================
  useEffect(() => {
    getOrganizations()
      .then(res => setOrganizations(res.data))
      .catch(() => alert("Failed to load organizations"));
  }, []);

  // ==============================
  // LOAD SERVING TOKEN (FIXED)
  // ==============================
  const loadServing = (orgId) => {

    if (!orgId) {
      console.log("❌ Org not selected");
      return;
    }

    getQueue(orgId)
      .then(res => {
        if (res.data.serving) {
          setCurrentToken(res.data.serving.token_number);
        } else {
          setCurrentToken(null);
        }
      })
      .catch(err => console.error(err));
  };

  // ==============================
  // SELECT ORGANIZATION
  // ==============================
  const selectOrganization = (id) => {

    setOrg(id);

    if (!id) {
      setCounters([]);
      return;
    }

    // load counters
    getCounters(id)
      .then(res => setCounters(res.data))
      .catch(() => alert("Failed to load counters"));

    // load serving token
    loadServing(id);
  };

  // ==============================
  // CALL NEXT TOKEN
  // ==============================
  const nextToken = () => {

    if (!org) {
      alert("Select organization first");
      return;
    }

    if (!counter) {
      alert("Select counter first");
      return;
    }

    callNext({
      counter: counter,
      organization: org
    })
      .then(res => {
        setCurrentToken(res.data.token);

        // refresh queue
        loadServing(org);
      })
      .catch(err => {
        if (err.response) {
          alert(err.response.data.message);
        } else {
          alert("Server error");
        }
      });
  };

  // ==============================
  // COMPLETE TOKEN (FIXED)
  // ==============================
  const finishToken = () => {

    if (!currentToken) {
      alert("No token serving");
      return;
    }

    completeToken({ token: currentToken })
      .then(() => {
        alert("Service Completed");

        // refresh queue
        loadServing(org);
      })
      .catch(() => {
        alert("Error completing token");
      });
  };

  // ==============================
  // AUTO REFRESH (BEST PRACTICE)
  // ==============================
  useEffect(() => {
    if (!org) return;

    const interval = setInterval(() => {
      loadServing(org);
    }, 3000);

    return () => clearInterval(interval);
  }, [org]);

  // ==============================
  // UI
  // ==============================
  return (
    <div className="container">

      <h2 className="panel-title">Operator Panel</h2>

      {/* ORGANIZATION */}
      <div className="section">
        <h3>Select Organization</h3>

        <select
          className="organization-select"
          value={org}
          onChange={(e) => selectOrganization(e.target.value)}
        >
          <option value="">Select Organization</option>

          {organizations.map(o => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </div>

      {/* COUNTER */}
      <div className="section">
        <h3>Select Counter</h3>

        <select
          className="counter-dropdown"
          value={counter}
          onChange={(e) => setCounter(e.target.value)}
        >
          <option value="">Select Counter</option>

          {counters.map(c => (
            <option key={c.id} value={c.id}>
              {c.counter_name}
            </option>
          ))}
        </select>
      </div>

      {/* ACTION BUTTONS */}
      <div className="operator-actions">
        <button className="call-btn" onClick={nextToken}>
          Call Next Token
        </button>

        <button className="complete-btn" onClick={finishToken}>
          Complete Service
        </button>
      </div>

      {/* CURRENT TOKEN */}
      {currentToken && (
        <div className="serving-box">
          <h3>Now Serving</h3>
          <h1>{currentToken}</h1>
        </div>
      )}

    </div>
  );
}

export default OperatorPanel;