import React from 'react'
import AnnonceCard from '../components/AnnonceCard'
import '../styles/home.css'
import Filtres from '../components/Filtres'
import { Image } from '@chakra-ui/react'
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api'


export default function Home() {
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
        <LoadScript googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}>
        <GoogleMap
          id="example-map"
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={{ lat: -34.397, lng: 150.644 }}
          zoom={8}
        >
          <Marker position={{ lat: -34.397, lng: 150.644 }}/>
        </GoogleMap>
      </LoadScript>

        </div>
      </div>
    </div>
  )
}
