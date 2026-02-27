import React from 'react';
import './styles.css';  
import Button from '../../Common/Button';
import iphone from '../../../assets/iphone.png';
import gradient from '../../../assets/gradient.png';


function MainComponent() {
    return <div className='flex-info'>
        <div className='left-component'>
            <h1 className='track-crypto-heading'> Track Crypto</h1>
            <h1 className='real-time-heading'>Real Time</h1>
            <p className='info-text'>
                Track crypto through a public api in real time. Visit dashboard to do so.
            </p>
            <div className='btn-flex'>
                <Button text={'Dashboard'}/>
                <Button text={'share'} outlined={true}/>
            </div>
        </div>
        <div className='phone-container'>
            <img src={iphone} className="iphone" alt="" />
            <img src={gradient} className='gradient' alt="" />
        </div>
    </div>
}

export default MainComponent;