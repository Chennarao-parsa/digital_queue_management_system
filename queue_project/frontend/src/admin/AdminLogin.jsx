import { useState } from "react"
import { adminLogin } from "../services/api"
import "../styles/admin.css"

function AdminLogin(){

const [username,setUsername] = useState("")
const [password,setPassword] = useState("")

const handleLogin = () => {

if(!username || !password){
alert("Please enter username and password")
return
}

adminLogin({username,password})
.then(()=>{

localStorage.setItem("admin","true")
window.location.href="/admin-dashboard"

})
.catch(()=>{
alert("Invalid username or password")
})

}

return(

<div className="login-container">

<div className="login-card">

<h2>Admin Login</h2>

<input
className="login-input"
placeholder="Username"
onChange={(e)=>setUsername(e.target.value)}
/>

<input
className="login-input"
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button className="login-btn" onClick={handleLogin}>
Login
</button>

</div>

</div>

)

}

export default AdminLogin
