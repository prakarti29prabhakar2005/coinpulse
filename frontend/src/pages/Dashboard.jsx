import React,{useState, useEffect} from 'react'
import axios from 'axios'
import Header from '../components/Common/Header'
import TabsComponents from '../components/Dashboard/Tabs'

const DashboardPage = () => {

  const[coins,setCoins]= useState([]);
  useEffect(()=>{
    axios
      .get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
      .then((response)=>{
         console.log(response.data);
         setCoins(response.data);
    })
      .catch((error)=>{
        console.log(error);
    })
  },[])
  return (
    <div>
      <Header/>
      <TabsComponents coins={coins}/>
    </div>
  )
}

export default DashboardPage
