import React from 'react'
import './styles.css'
import AnchorTemporaryDrawer from './drawer.jsx'
import Button from '../Button/index.jsx'

const Header = () => {
  return (
    <div className='navbar'>
      <h1 className='logo'>Coinpulse<span style={{color: "var(--blue)"}}>.</span></h1>
      <div className='links'>
        <a href="/">
        <p className='link'>Home</p>
        </a>
        <a href="/">
        <p className='link'>Compare</p>
        </a>
        <a href="/">
        <p className='link'>Watchlist</p>
        </a>
        <a href="#">
        <Button text={"Dashboard"}
        outlined={true}
        onClick={() => console.log("Dashboard clicked")}
        />
        </a>
        
      </div>
      
      <div className='mobile-drawer'>
        <AnchorTemporaryDrawer/>
      </div>

    </div>
  )
}

export default Header
