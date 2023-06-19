import React from 'react'
import AnnonceCard from '../components/AnnonceCard'
import '../styles/home.css'
import Filtres from '../components/Filtres'
import { Image } from '@chakra-ui/react'
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api'
import { Dots } from 'react-activity'


export default function Home() {
  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    libraries: ['places']
})
  const containerStyle = {
    height: 'calc(100vh - 180px)'
  };
  const center={lat:45.764043, lng:4.835659}
  return (
    <div className="page">
    <Filtres/>
      <div className="main-grid">
        <div className="grid">
          <AnnonceCard/>
          <AnnonceCard/>
          <AnnonceCard/>
          <AnnonceCard/>
          <AnnonceCard/>
          <AnnonceCard/>
          <AnnonceCard/>
          <AnnonceCard/>
        </div>
        <div className="map"> 
        {isLoaded ?
        <GoogleMap center={center} zoom={13} mapContainerStyle={containerStyle}
            options={{
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
            }}>
                <MarkerF position={center}/>
            </GoogleMap> :<div className='flex  justify-center'><Dots/></div>}
        </div>
      </div>
    </div>
  )
}
