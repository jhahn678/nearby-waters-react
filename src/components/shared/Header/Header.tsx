import React from 'react'
import classes from './Header.module.css'
import { NavLink } from 'react-router-dom'
import { Title } from '@mantine/core'

const Header = (): JSX.Element => {

  return (
    <div className={classes.container}>
        <Title className={classes.header} order={1}>Heron Waterbodies API</Title>
        <div className={classes.links}>
          <NavLink to='/' className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>
            <Title order={3}>Demo</Title>
          </NavLink>
          <NavLink to='/explore' className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}>
            <Title order={3}>Explore</Title>
          </NavLink>
        </div>
    </div>
  )
}



export default Header