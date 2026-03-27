import { useEffect, useState } from "react";
import { getQueue } from "../services/api";

function QueueDisplay(){

const [organization,setOrganization] = useState(1)
const [waiting,setWaiting] = useState([])
const [serving,setServing] = useState(null)
const [loading,setLoading] = useState(true)

const loadQueue = () => {

getQueue(organization)
.then(res=>{

setWaiting(res.data.waiting || [])
setServing(res.data.serving || null)
setLoading(false)

})

.catch(err=>{
console.log("Queue loading error:", err)
setLoading(false)
})

}

useEffect(()=>{

loadQueue()

const interval = setInterval(loadQueue,2000)

return ()=>clearInterval(interval)

},[organization])

return(

<div className="container display-container">

<h2 className="panel-title">Queue Display</h2>

<select
value={organization}
onChange={(e)=>setOrganization(e.target.value)}
>

<option value="1">Bank</option>
<option value="2">Hospital</option>

</select>

{/* NOW SERVING */}

<div className="serving-section">

<h3>NOW SERVING</h3>

{serving ? (

<div className="serving-token">

<div className="token-number">
{serving.token_number}
</div>

<div className="counter-label">
Counter {serving.counter || "-"}
</div>

</div>

) : (

<div className="empty-box">
No token currently serving
</div>

)}

</div>

{/* WAITING QUEUE */}

<div className="waiting-section">

<h3>Waiting Queue</h3>

<div className="queue">

{loading && (
<p className="empty">Loading queue...</p>
)}

{!loading && waiting.length === 0 && (
<p className="empty">No waiting tokens</p>
)}

{waiting.map(token => (

<div key={token.id} className="token">
{token.token_number}
</div>

))}

</div>

</div>

</div>

)

}

export default QueueDisplay
