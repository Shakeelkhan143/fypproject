import React, { useEffect, useState } from 'react';
import Layout from '../../common/Layout';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../../common/Sidebar';
import { adminToken, apiUrl } from '../../common/http';

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loader, setLoader] = useState(false);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const params = useParams();

  const fetchOrders = async () => {
    setLoader(true);
    const res = await fetch(`${apiUrl}/details/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${adminToken()}`
      }
    });
    const result = await res.json();
    setLoader(false);
    if (result.status === 200) {
      setOrder(result.data);
      setStatus(result.data.status);
      setPaymentStatus(result.data.payment_status);
    } else {
      console.log("Something went wrong");
    }
  };

  const updateOrder = async () => {
    const res = await fetch(`${apiUrl}/orders/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${adminToken()}`
      },
      body: JSON.stringify({
        status,
        payment_status: paymentStatus
      })
    });
    const result = await res.json();
    if (result.status === 200) {
      alert("Order updated successfully!");
      fetchOrders();
    } else {
      alert("Update failed");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (!order) return <div className="text-center py-5">Loading...</div>;

  return (
    <Layout>
      <div className='container'>
        <div className='row'>
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4 className='h4 pb-0 mb-0'>Orders</h4>
            <Link to="/admin/orders" className="btn btn-primary">Back</Link>
          </div>

          <div className='col-md-3'>
            <Sidebar />
          </div>

          <div className='col-md-9'>
            <div className='row'>
              {/* Order Info Card */}
              <div className='col-md-9'>
                <div className='card shadow'>
                  <div className="card-body py-4">
                    <div className='row'>
                      <div className='col-md-4'>
                        <h5>Order: #{order.id}</h5>
                        {
                          order.status === 'shipped' && <span className='badge bg-warning'>Shipped</span>
                        }
                        {
                          order.status === 'delivered' && <span className='badge bg-success'>Delivered</span>
                        }
                        {
                          order.status === 'pending' && <span className='badge bg-secondary'>Pending</span>
                        }
                        {
                          order.status === 'cancelled' && <span className='badge bg-danger'>Cancelled</span>
                        }
                      </div>
                      <div className='col-md-4'>
                        <strong>Date:</strong>
                        <div>{order.date}</div>
                      </div>
                      <div className='col-md-4'>
                        <strong>Payment Status:</strong>
                        {
                          order.payment_status === 'paid'
                            ? <span className='badge bg-success'>Paid</span>
                            : <span className='badge bg-warning'>Not Paid</span>
                        }
                      </div>
                    </div>

                    <hr />

                    <div>
                      <h6>{order.name}</h6>
                      <p className='mb-0'>{order.address}</p>
                      <p>{order.phone}</p>
                      <p><strong>Payment Method:</strong> {order.payment_method}</p>
                    </div>

                    <hr />
                    <h5>Items</h5>
                    {
                      order.items && order.items.map((item, index) => (
                        <div className='d-flex border-bottom pb-2 mb-2' key={index}>
                          <img src={item.image_url} width={80} alt={item.name} />
                          <div className='ps-3'>
                            <h6 className='mb-1'>{item.name}</h6>
                            <p className='mb-0'>Size: {item.size}</p>
                            <p className='mb-0'>Qty: {item.qty} x ${item.price}</p>
                          </div>
                        </div>
                      ))
                    }

                    <hr />
                    <div className='d-flex justify-content-between'>
                      <div>Subtotal</div>
                      <div>${order.subtotal}</div>
                    </div>
                    <div className='d-flex justify-content-between'>
                      <div>Shipping</div>
                      <div>${order.shipping}</div>
                    </div>
                    <div className='d-flex justify-content-between fw-bold'>
                      <div>Grand Total</div>
                      <div>${order.grand_total}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update Card */}
              <div className='col-md-3'>
                <div className='card shadow'>
                  <div className="card-body">
                    <div className='mb-3'>
                      <label>Status</label>
                      <select className='form-select' value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className='mb-3'>
                      <label>Payment Status</label>
                      <select className='form-select' value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                        <option value="paid">Paid</option>
                        <option value="not_paid">Not Paid</option>
                      </select>
                    </div>
                    <button className='btn btn-success w-100' onClick={updateOrder}>Update</button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail;
