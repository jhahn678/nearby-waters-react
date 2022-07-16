import React from 'react'
// import BackgroundImage from './BackgroundImage';
import Header from './Header.tsx'

const Page = ({ children, className}) => {
  return (
      <div className='page'>
          <Header/>
          <div style={{ width: '100%', position: 'relative', marginTop: '10vh' }} className={className}>
            {children}
          </div>
      </div>
  )
}

export default Page;