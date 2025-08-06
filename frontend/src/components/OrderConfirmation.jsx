import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './common/Layout';
import { apiUrl } from './common/http';


const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/order/${id}`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}`
      }
    })
      .then(res => res.json())
      .then(data => setOrder(data.order))  // You should return { order: {...} } from backend
      .catch(() => console.log('Error fetching order.'));
  }, [id]);

  if (!order) return <p className='text-center py-5'>Loading...</p>;

  return (
    <Layout>
      <div className="container py-5">
        <h2 className='text-success text-center'>Thank You!</h2>
        <p className='text-center'>You have successfully placed your order.</p>

        <div className="card p-4 mt-4">
          <h4>Order Summary</h4>
          <div className="row py-3">
            <div className="col-md-6">
              <p><strong>Order ID:</strong> #{order.id}</p>
              <p><strong>Order Date:</strong> {new Date(order.created_at).toDateString()}</p>
              <p><strong>Status:</strong> <span className="badge bg-warning text-dark">{order.status}</span></p>
              <p><strong>Payment:</strong> {order.payment_method}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Customer:</strong> {order.name}</p>
              <p><strong>Address:</strong> {order.address}, {order.city}, {order.state}, {order.zip}</p>
              <p><strong>Contact:</strong> {order.mobile}</p>
            </div>
          </div>

          <h5 className="pt-4">Items</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>${item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-end">
            <table className="table w-auto">
              <tbody>
                <tr><th>Subtotal</th><td>${order.sub_total.toFixed(2)}</td></tr>
                <tr><th>Shipping</th><td>${order.shipping.toFixed(2)}</td></tr>
                <tr><th>Grand Total</th><td><strong>${order.grand_total.toFixed(2)}</strong></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
