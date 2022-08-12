import React from 'react'
import Header from '../shared/Header/Header'

interface Props {
  className: string,
  children: React.ReactNode
}

const Page = React.forwardRef<HTMLDivElement, Props>(({ className, children }: Props, ref) => {
  return (
      <div className='page' ref={ref}>
          <Header/>
          <div style={{ width: '100%', position: 'relative', marginTop: '10vh' }} className={className}>
            {children}
          </div>
      </div>
  )
})

export default Page;