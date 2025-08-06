import React from 'react';
import Layout from '../common/Layout';
import Sidebar from '../common/Sidebar';

const Dashboard = () => {
  return (
    <Layout>
      <div className='container py-4'>
        <div className='row'>
          <div className='col-md-3'>
            <Sidebar />
          </div>

          <div className='col-md-9 d-flex flex-column justify-content-start align-items-center' style={{ minHeight: '75vh' }}>
            <div className="text-center p-5 shadow rounded bg-light mt-4" style={{ width: '100%', maxWidth: '600px' }}>
              <h2 style={{ color: '#8B0000', fontFamily: 'Playfair Display, serif' }}>
                Welcome to Al-Fatima
              </h2>
              <p style={{ fontSize: '16px', color: '#555' }}>
                WE DEAL IN KIDS , MENS  & LADIES ALL VARITY.
              </p>
            </div>

            <div className="text-center mt-4 p-4 bg-white shadow-sm rounded" style={{ maxWidth: '500px' }}>
              <h3 style={{ fontWeight: 'bold', color: '#8B0000' }}>FC</h3>
              <p style={{ fontSize: '16px', color: '#333', margin: '8px 0' }}>
                Contact: <br />
                <strong>+92 318 5008998</strong><br />
                <strong>+92 313 9032404</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
