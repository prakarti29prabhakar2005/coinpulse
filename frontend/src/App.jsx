import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Header from "./components/Common/Header"
import Footer from "./components/Common/Footer"
import MainComponent from './components/LandingPage/MainComponent'
import HomePage from './pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/Dashboard'



function App() {
  return <div className='App'>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path='/dashboard' element={<DashboardPage/>}></Route>
        {/* <Route path='/coin/:id' element={<CoinPage/>}></Route>
        <Route path='/compare' element={ComparePage}></Route>
        <Route path='/watchlist' element={<WatchlistPage/>}></Route> */}
      </Routes>
    </BrowserRouter>
  </div>
}

export default App