import React from 'react'
import classes from './Header.module.css'
import { NavLink } from 'react-router-dom'
import { Title } from '@mantine/core'

const Header = () => {
  return (
    <div className={classes.container}>
        <Title className={classes.header} order={1}>Find nearby waters</Title>
        <div className={classes.links}>
            <NavLink to='/' className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}><Title order={3}>Home</Title></NavLink>
            <NavLink to='/api' className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}><Title order={3}>API</Title></NavLink>
            <NavLink to='/about' className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}><Title order={3}>About</Title></NavLink>
        </div>
    </div>
  )
}



export default Header