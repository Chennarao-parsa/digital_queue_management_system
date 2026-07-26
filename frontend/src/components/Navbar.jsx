import { Link } from "react-router-dom"
import "../styles/main.css"

function Navbar(){

return(

<nav className="navbar">

<h2 className="logo">Digital Queue System</h2>

<div className="nav-links">

<Link to="/">Customer</Link>
<Link to="/display">Display</Link>
<Link to="/operator">Operator</Link>
<Link to="/admin">Admin</Link>

</div>

</nav>

)

}

export default Navbar