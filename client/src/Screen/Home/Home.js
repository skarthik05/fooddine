import React from 'react'
import { Link,useNavigate  } from 'react-router-dom'
function Home() {
    let navigate = useNavigate();
  return (
    <div style={{display:"flex",flexDirection:"row"}}>
        <div style={{display:"flex",justifyContent:'center',alignItems:'center',width:"50%"}}>
        <button className='button' onClick={()=>{navigate("/user/1")}}>User</button>
        </div>
        <div style={{display:"flex",justifyContent:'center',alignItems:'center',width:"50%"}}>
        <button className='button'  onClick={()=>{navigate("/restaurant")}}>Restaurant</button>
        </div>
    </div>
  )
}

export default Home