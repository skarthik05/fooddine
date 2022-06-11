import React, { useState,useEffect } from 'react'
import { useParams } from "react-router-dom";
import axios from 'axios';
import { Globals } from '../../globals';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import "./Menu.css"
import { toast } from 'react-toastify';
function Menu() {
    let params = useParams();
    const [showFrom,setShowForm] = useState(false);
    const [showModal,setShow] = useState(false);
    const [formData,setFormData] = useState({email:"",name:"",phone:""});
    const [cart,setCart] = useState({})
    const [menu,setMenu] = useState([]);
    const [recentItems,setRecentItems] = useState([]);
    const [bestSellers,setBestSellers]= useState([])
    const getMenu = async ()=>{
        try{
           const {data} = await axios.get(Globals.baseURL+"menus")
           //console.log(data)
           setMenu(data)
        }catch(err){
            console.log(err);
        }
    }

    const recentOrders = async ()=>{
        try{
            let token = localStorage.getItem("token");
            const {data} = await axios.post(Globals.baseURL+"users/recent/orders",{},{
                "headers": {
                  'Authorization': `Bearer ${JSON.parse(token)}` 
                }})
            //console.log(data)
            setRecentItems([...data])
         }catch(err){
             console.log(err);
         }
    }

    const bestSellerFun = async ()=>{
        try{
            const {data} = await axios.get(Globals.baseURL+"orders")
            //console.log(data)
            setBestSellers([...data])
         }catch(err){
             console.log(err);
         }
    }
    useEffect(() => {
     getMenu()
     recentOrders()
     bestSellerFun()
    }, [])
    

// add to cart start
    const addToCart = (item,type)=>{
        let cartCopy = {...cart}
        if(Object.keys(cartCopy).length>0){
          if(type=='plus'){
            if(cartCopy[item.item]){
                cartCopy[item.item].quantity = ++cartCopy[item.item].quantity;
              }else{
                cartCopy[item.item]={item:item.item,quantity:1,price:item.price}
            }
          }
          if(type=='minus'){
            if(cartCopy[item.item].quantity>1){
                cartCopy[item.item].quantity = --cartCopy[item.item].quantity;
              }else{
                  delete cartCopy[item.item];
              }
          }
        }else{
            if(type=='plus'){
                cartCopy[item.item]={item:item.item,quantity:1,price:item.price}
            }
        }

        setCart({...cartCopy})
    }
// add to cart end



const handleChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
}

const submitForm = async (e)=>{
    e.preventDefault();
   try{
            let token = localStorage.getItem("token");
            if(token){
                const {data}= await axios.post(Globals.baseURL+"orders/create",{items:Object.values(cart),tableNumber:params.id},{
                    "headers": {
                      'Authorization': `Bearer ${JSON.parse(token)}` 
                    }})
                if(data && data.items){
                  localStorage.setItem("items",JSON.stringify(data.items));
                  setShow(false)
                  setCart({})
                  toast("Order placed!")
                } 
            }else{
                const {data}= await axios.post(Globals.baseURL+"users/signup",{...formData,items:Object.values(cart),tableNumber:params.id})
                if(data && data.items && data.token){
                  localStorage.setItem("token",JSON.stringify(data.token));
                  localStorage.setItem("items",JSON.stringify(data.items));
                  setShow(false)
                  setCart({})
                  toast("Order placed!")
                } 
            }
     
   }catch(err){
       console.log(err)
   }
}

  return (
    <div>
       <div className='header'><h1>Menu</h1>  {Object.keys(cart).length>0?<div className='placeorder'><button onClick={()=>{setShow(true)}}>Place order</button></div>:null}</div> 
       <div style={{padding:"0rem 1rem"}}>
       <Row style={{marginTop:"2rem"}}>
                        <Col sm={9} m={6}>           
        {menu.map((menuItem,index)=>{
            return <div key={index} style={{boxShadow: "3px 3px 14px -6px rgba(0,0,0,0.75)",padding:"2rem",marginRight:"1rem",marginLeft:"1rem",marginBottom:"1rem"}}>
                <h3>{(menuItem.type).toUpperCase()}</h3>
                <div>
                
                     
                        <Row xs={1} md={4} className="g-3">
                    {
                            
                            
                        menuItem.menu.map((item)=>{
                            
                            return <Col>
                             <Card style={{boxShadow: "3px 3px 14px -6px rgba(0,0,0,0.75)"}}>
                            <Card.Body>
                              <Card.Text style={{display:'flex',flexDirection:"row",justifyContent:"space-between"}}>
                              <span style={{padding:"1rem 0rem"}}>{item.item}</span>
                             {!cart[item.item]?
                             <button onClick={()=>addToCart(item,"plus")} className="button">Add</button>
                             :(<div style={{display:"inherit",justifyContent:"flex-end",alignItems:"center"}}><button onClick={()=>addToCart(item,"plus")} className="plus" >+</button>{cart[item.item]?cart[item.item].quantity:0}<button onClick={()=>addToCart(item,"minus")} className="minus">−</button></div>)} 
                              </Card.Text>
                            </Card.Body>
                            <Card.Footer style={{display:'flex',flexDirection:"row",justifyContent:"space-between"}}>
                            {parseFloat(item.price).toFixed(2)}
                            <Badge bg="success">{item.cuisine}</Badge> 
                            </Card.Footer>
                          </Card>
                          </Col>
                        })
                        
                    }
                   </Row>
                        
                       
                     
                </div>
            </div>
        })}
        </Col>
        <Col sm={3} m={2} >
            <div style={{position:'sticky',top:"15%"}}>
            {recentItems.length>0&& <div >
         <h2>
             Recent Orders
         </h2>
         {recentItems.length>0&&recentItems.map((item) => {
       return <Card
          className="mb-2">
          <Card.Header style={{display:'flex',flexDirection:"row",justifyContent:"space-between"}}><span>{item.item}</span></Card.Header>
          <Card.Body>
            
            <Card.Text style={{display:'flex',flexDirection:"row",justifyContent:"space-between"}}>
            <Card.Title>{item.price} </Card.Title>
                             {!cart[item.item]?
                             <button onClick={()=>addToCart(item,"plus")} className="button">Repeat</button>
                             :(<div style={{display:"inherit",justifyContent:"flex-end",alignItems:"center"}}><button onClick={()=>addToCart(item,"plus")} className="plus" >+</button>{cart[item.item]?cart[item.item].quantity:0}<button onClick={()=>addToCart(item,"minus")} className="minus">−</button></div>)} 
                              </Card.Text>
          </Card.Body>
        </Card>
      })}
          </div>}
          <div style={{paddingBottom:"2rem"}}>
          <h2>
             Best Sellers 🔥
         </h2>
         
         {bestSellers.length>0&&bestSellers.map((item) => {
       return <Card
          className="mb-2">
          <Card.Header style={{display:'flex',flexDirection:"row",justifyContent:"space-between"}}><span>{item.item}</span><span style={{color:"orangered",fontSize:"12px"}}>{item.count}+ orders</span></Card.Header>
          <Card.Body>
            
            <Card.Text style={{display:'flex',flexDirection:"row",justifyContent:"space-between"}}>
            <Card.Title>{item.price} </Card.Title>
                             {!cart[item.item]?
                             <button onClick={()=>addToCart(item,"plus")} className="button">Try now</button>
                             :(<div style={{display:"inherit",justifyContent:"flex-end",alignItems:"center"}}><button onClick={()=>addToCart(item,"plus")} className="plus" >+</button>{cart[item.item]?cart[item.item].quantity:0}<button onClick={()=>addToCart(item,"minus")} className="minus">−</button></div>)} 
                              </Card.Text>
          </Card.Body>
        </Card>
      })}
          </div>
            </div>
          
        </Col>
                     </Row>  
                     </div>        
                     {showModal&& <div className='c-modal'>
        <div className="c-modal-content">
      <span className="c-close" onClick={()=>setShow(false)}>✕</span>
      <div className='form-modal'>
          <h2>Almost done!</h2>
      <form>
        <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder='Name' required />
        <input name="email" type="email"  value={formData.email} onChange={handleChange} placeholder='Email' required />
        <input name="phone" type="text" value={formData.phone} onChange={handleChange} placeholder='Phone' required />
        <br />
        <button onClick={submitForm} className="button"> Proceed</button>
    </form>
  
      </div>
    </div>
        </div>}
      
    </div>
  )
}

export default Menu