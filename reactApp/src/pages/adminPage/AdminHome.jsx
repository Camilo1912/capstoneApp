import React from 'react';
import JvListAdmin from "./JvListAdmin";
import JvContent from './JvContent';

const AdminHome = () => {
  return (
    <div className='admin-home-container'>
      <JvListAdmin />
      <JvContent />
    </div>
  )
}

export default AdminHome