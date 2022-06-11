import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { Globals } from '../../globals';
function Restaurant() {
    const [activeOrders,setActiveOrders]=useState([])
    const [tables,setTables]=useState([])
    const getActiveOrders = async ()=>{
        try{
           const {data} = await axios.get(Globals.baseURL+"orders/active")
           console.log(data)
           setActiveOrders(data)
        }catch(err){
            console.log(err);
        }
    }


    const getTables=async ()=>{
        try{
            const {data} = await axios.get(Globals.baseURL+"tables")
            console.log(data)
            setTables(data)
         }catch(err){
             console.log(err);
         }
    }
    useEffect(()=>{
        getActiveOrders();
        getTables();
    },[])
  return (
    <div>
        
    </div>
  )
}

export default Restaurant