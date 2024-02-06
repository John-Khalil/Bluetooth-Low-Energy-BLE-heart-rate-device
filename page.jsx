'use client'
import React, { useEffect, useReducer, useState } from 'react'
import appLinker,{Base6432bitBinaries, bytesToString, userStorage} from '@/utils/utils';

import { FaHeartbeat } from "react-icons/fa";

export default function page({}) {
    const [beatSize,setBeatSize]=useState(500);
    let [readingSpacing,setReadingSpacing]=useState(``)
    const [heartRate,heartRateDispatcher]=useReducer((state,dispatched)=>{
        if(state===dispatched)
            return dispatched;
        setReadingSpacing(``);
        setBeatSize(480);
        setTimeout(()=>{
            setBeatSize(500);
            setReadingSpacing(``);
        },100);
        return dispatched;
    },'--');
    useEffect(()=>{
        // setInterval(()=>{
        //     heartRateDispatcher(500)
        // },1500);
        
    },[]);
    return (
        <>  
            <div className='grid grid-rows-3 grid-flow-row gap-4 h-[700px]'>
                <div className='row-span-2'>
                    <div className='inline-block align-middle mt-12' onClick={()=>{
                        navigator.bluetooth.requestDevice({
                            // acceptAllDevices:true
                            filters: [{
                                services: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b']
                            }]
                        })
                        .then(device => device.gatt.connect())
                        .then(server => server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b'))
                        .then(service => service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8'))
                        .then(characteristic => characteristic.startNotifications())
                        .then(characteristic => {
                            characteristic.addEventListener('characteristicvaluechanged',(event)=>{
                                const value =bytesToString(Array.from(new Uint8Array(event.target.value.buffer)));
                                heartRateDispatcher((JSON.parse(value)?.heartRate<200)?JSON.parse(value)?.heartRate:'--')
                                console.log(value)
                              });
                            console.log('Notifications have been started.');
                        })
                        .catch(error => { console.error(error); });
                    }}>
                        <FaHeartbeat size={`${beatSize}px`} color='#ff1eff'/>
                    </div>
                </div>
                <div className='row-span-1'>
                    <div className={`text-8xl ${readingSpacing} mt-32 select-none`}>
                        {heartRate}
                    </div>
                </div>
            </div>
            {/* <div className='inline-block align-middle mt-12'>
                <FaHeartbeat size={`${beatSize}px`} color='#ff1eff'/>
            </div> */}

            {/* <div className={`text-8xl ${readingSpacing}`}>
                {heartRate}
            </div> */}
        </>
    )
}

