import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Header from "./components/Common/Header"
import Footer from "./components/Common/Footer"
import MainComponent from './components/LandingPage/MainComponent'


function App() {
  return <div className='App'>
    <Header />
    <MainComponent/>
    {/* <Footer /> */}
  </div>
}

export default App