import React from 'react'
import favicon from '../../assets/favicon.png'

function Logo({width}) {
  return (
    <div>
      <img
      className='h-14 w-18'
      src={favicon}
      alt="logo"
      style={{width: width}}
      />
    </div>
  )
}

export default Logo