import React from 'react'
import { Table } from 'react-bootstrap';
function Restaurant() {
  return (
    <div><div className='table-wrap'>
    <Table striped bordered hover>
      <thead>
        <tr className='table-header'>
          <th>#</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Phone number</th>
          <th>Shipping address</th>
        </tr>
      </thead>
      <tbody>
        {/* {
          tableData.map((row,i)=>{
    return <tr>
          <td>{i+1}</td>      
          <td>{row.firstName}</td>
          <td>{row.lastName}</td>
          <td>{row.email}</td>
          <td>{row.phoneNumber}</td>
          <td>Address line 1: {row.streetAddress1}<br />Address line 2: {row.streetAddress2}<br />
          City: {row.city}<br />
          State / Province: {row.stateOrprovince}<br />
          Country : {row.country}<br />
          Postal Code: {row.postalCode}
          </td>
        </tr>
          })
        } */}
      </tbody>
    </Table>
    </div></div>
  )
}

export default Restaurant