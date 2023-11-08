import React from 'react'
import GuestHeader from '../../layouts/GuestHeader'
import GuestContent from './GuestContent'

const GuestHome = () => {
  return (
    <div className='guest-page-wrapper'>
        <GuestHeader />
        <GuestContent />
    </div>
  )
}

export default GuestHome