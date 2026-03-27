import axios from "axios";

const API = axios.create({
baseURL: "http://127.0.0.1:8000/api/",
timeout: 5000
});

/* Customer APIs */

export const getOrganizations = () => API.get("organizations/");

export const getServices = (orgId) =>
API.get(`services/?organization=${orgId}`);

export const registerCustomer = (data) =>
API.post("register/", data);

export const getQueue = (organization) => {
return API.get(`queue/?organization=${organization}`)
}

/* Operator APIs */

export const callNext = (data) =>
API.post("call-next/", data);

export const completeToken = (data) =>
API.post("complete/", data);

export const getCounters = (orgId) =>
API.get(`counters/?organization=${orgId}`);

/* ----------------------- */
/* Admin Panel APIs */
/* ----------------------- */

export const adminLogin = (data) =>
API.post("admin-login/", data);

export const getQueueTracking = () =>
API.get("queue-tracking/");

export const getTokenStats = () =>
API.get("token-stats/");