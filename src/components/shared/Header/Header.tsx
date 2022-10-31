import React, { useState } from 'react'
import classes from './Header.module.css'
import { NavLink } from 'react-router-dom'
import { Burger, Drawer, Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

const Header = (): JSX.Element => {

  const [open, setOpen] = useState(false)
  const maxWidth700 = useMediaQuery('(max-width: 700px)')

  return (
    <div className={classes.container}>
      {maxWidth700 && <Burger color={'white'} opened={open} onClick={() => setOpen(true)}/>}
        <Title className={classes.header} order={1}>Heron Waterbodies API</Title>
        {maxWidth700 ?
          <Drawer opened={open} onClose={() => setOpen(false)} styles={{ drawer: { backgroundColor: '#2b4162'}}}>
            <NavLink to='/' className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>
              <Title order={3} style={{ margin: 16 }}>Demo</Title>
            </NavLink>
            <NavLink to='/explore' className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>
              <Title order={3} style={{ margin: 16 }}>Explore</Title>
            </NavLink>
          </Drawer> :
          <div className={classes.links}>
            <NavLink to='/' className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>
              <Title order={3}>Demo</Title>
            </NavLink>
            <NavLink to='/explore' className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>
              <Title order={3}>Explore</Title>
            </NavLink>
          </div>
        }
    </div>
  )
}



export default Header