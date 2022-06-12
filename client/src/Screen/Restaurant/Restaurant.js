import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Globals } from '../../globals';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
function Restaurant() {
    const [activeOrders,setActiveOrders]=useState([])
    const [tables,setTables]=useState([])
    const [tab,setTab]=useState("table")
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


    const freeTable = async (tableNumber,phone)=>{
        try{
            const {data} = await axios.post(Globals.baseURL+"users/signout",{tableNumber,phone})
            console.log(data)
           if(data=='OK'){
               getTables();
               getActiveOrders()
           }
         }catch(err){
             console.log(err);
         }
    }

  return (
    <div>
       <div className='header'><h1>Restaurant</h1></div> 
       <div style={{padding:"2rem 1rem"}}>
           <h3>Table with orders</h3>
           <div>
           <div>
           <Row xs={1} md={4} className="g-3">
           {tables.map((table)=>{
 return <Col><Card style={{boxShadow: "3px 3px 14px -6px rgba(0,0,0,0.75)"}}>
   <Card.Header style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
      <span> Table {table.tableNumber}</span><span>{table.isOccupied?<Badge bg="danger">Occuied</Badge>:<Badge bg="success">Free</Badge> }</span>
    </Card.Header>  
 <Card.Body>
  <Card.Title>
      {table.isOccupied? <button className='button' onClick={()=>{freeTable(table.tableNumber,activeOrders.find(i=>i.tableNumber==table.tableNumber)?.tables[0].phone)}}>Free table</button>:<p style={{color:"#ccc"}}>No Orders!!</p>}
  </Card.Title>
  <Card.Text>
     {activeOrders.find(i=>i.tableNumber==table.tableNumber)?.tables.map(item=><div>{item.item} - {item.quantity}</div>)}
      </Card.Text>
 </Card.Body>
</Card>
</Col>
           })}
           </Row>
           </div>
           <div>
               {activeOrders.map(item=>{
                   return <></>
               })}
           </div>
           </div>
       </div>
      
    </div>
  )
}

export default Restaurant