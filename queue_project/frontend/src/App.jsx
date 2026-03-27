import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerPage from "./pages/CustomerPage";
import QueueDisplay from "./pages/QueueDisplay";
import OperatorPanel from "./pages/OperatorPanel";
import AdminLogin from "./admin/AdminLogin"
import AdminDashboard from "./admin/AdminDashboard"
import Navbar from "./components/Navbar";
import "./styles/main.css";
import ProtectedRoute from "./components/ProtectedRoute";
function App(){

return(

<BrowserRouter>

<Navbar/>

<Routes>

<Route path="/" element={<CustomerPage/>} />

<Route path="/display" element={<QueueDisplay/>} />

<Route path="/operator" element={<OperatorPanel/>} />
<Route path="/admin" element={<AdminLogin/>}/>
<Route 
path="/admin-dashboard" 
element={
<ProtectedRoute>
<AdminDashboard/>
</ProtectedRoute>
}
/>
</Routes>

</BrowserRouter>

);

}

export default App;