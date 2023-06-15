import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { Dots } from 'react-activity';
import {useJsApiLoader, GoogleMap, MarkerF} from '@react-google-maps/api'

export default function Listing() {
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY
    })
    useEffect(()=>{
        async function fetchListing(){
            try{
            const docRef=doc(db, 'Listings', params.listingID)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists){
                setListing(docSnap.data())
            }
            }catch(error){
                alert(error.message)
            }finally{
                setLoading(false)
            }
        }
        fetchListing();
    }, [params.listingID])
    const containerStyle = {
        width: '400px',
        height: '400px'
      };
    function renderContent(){
        if(loading){return <Dots/>}
        if(!listing){return <h1>CETTE ANNONCE NEXISTE PLUS</h1>}
        if(!isLoaded){return <Dots/>}
        const center = listing.geolocation
        return(
            <div className='h-1/2 w-1/2'>
            <h1>{listing.adresse}</h1>
            <GoogleMap center={center} zoom={15} mapContainerStyle={containerStyle}
            options={{
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false
            }}>
                <MarkerF position={center}/>
            </GoogleMap>
            </div>
        )
    }
  return (
    <div className='flex flex-col'>
      <h1 className='text-3xl'> OFFRE</h1>
      <h1>TEST</h1>
      <h1>TEST</h1>
      <h1>TEST</h1>
      {renderContent()}
    </div>
  )
}
