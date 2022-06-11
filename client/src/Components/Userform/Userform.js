import React, { useState } from 'react'
import "./Userfrom.css"
import axios from 'axios';
import {Globals} from '../../globals';
function Userform() {
const [formData,setFormData] = useState({email:"",name:"",phone:""});
const handleChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
}

const submitForm = (e)=>{
    e.preventDefault();
    axios.post(Globals)
}
    return (
    <div className='form'>
    <form>
        <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder='Name' required />
        <input name="email" type="email"  value={formData.email} onChange={handleChange} placeholder='Email' required />
        <input name="phone" type="text" value={formData.phone} onChange={handleChange} placeholder='Phone' required />
        <button onClick={submitForm}> Continue to menu</button>
    </form>
    </div>
  )
}

export default Userform