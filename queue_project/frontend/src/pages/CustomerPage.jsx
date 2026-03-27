import { useEffect, useState } from "react";
import { getOrganizations, getServices, registerCustomer } from "../services/api";

function CustomerPage(){

const [orgs,setOrgs] = useState([]);
const [services,setServices] = useState([]);

const [service,setService] = useState(null);
const [selectedOrg,setSelectedOrg] = useState(null);

const [name,setName] = useState("");
const [phone,setPhone] = useState("");

const [token,setToken] = useState("");
const [loading,setLoading] = useState(false);


/* Load organizations */

useEffect(()=>{

getOrganizations()
.then(res=>{
setOrgs(res.data);
})
.catch(()=>{
alert("Failed to load organizations");
});

},[]);


/* Select organization */

const selectOrg = (id)=>{

setSelectedOrg(id);
setService(null); // reset previous service

getServices(id)
.then(res=>{
setServices(res.data);
})
.catch(()=>{
alert("Failed to load services");
});

};


/* Generate Token */

const generateToken = ()=>{

setLoading(true);

registerCustomer({
name:name,
phone:phone,
service:service
})
.then(res=>{
setToken(res.data.token);

/* optional reset */

setName("");
setPhone("");
})
.catch(()=>{
alert("Token generation failed");
})
.finally(()=>{
setLoading(false);
});

};


return(

<div className="container">

<h2 className="panel-title">Customer Token Kiosk</h2>


{/* SELECT ORGANIZATION */}

<div className="section">

<h3>Select Organization</h3>

<div className="button-group">

{orgs.map(org=>(

<button
key={org.id}
className={selectedOrg === org.id ? "active-btn" : ""}
onClick={()=>selectOrg(org.id)}
>

{org.name}

</button>

))}

</div>

</div>


{/* SELECT SERVICE */}

<div className="section">

<h3>Select Service</h3>

<div className="button-group">

{services.length === 0 && (
<p className="empty-box">Select organization first</p>
)}

{services.map(s=>(

<button
key={s.id}
className={service === s.id ? "active-btn" : ""}
onClick={()=>setService(s.id)}
>

{s.service_name}

</button>

))}

</div>

</div>


{/* CUSTOMER DETAILS */}

<div className="section">

<h3>Register Customer</h3>

<label>Name</label>

<input
placeholder="Enter your name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<label>Phone</label>

<input
placeholder="Enter phone number"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
/>

<button
className="generate-btn"
onClick={generateToken}
disabled={!service || !name || !phone || loading}
>

{loading ? "Generating..." : "Generate Token"}

</button>

</div>


{/* TOKEN DISPLAY */}

{token &&

<div className="token-box">

<h3>Your Token</h3>

<div className="token-number">
{token}
</div>

</div>

}

</div>

);

}

export default CustomerPage;