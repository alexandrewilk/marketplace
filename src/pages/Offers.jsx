import React, {useEffect, useState} from 'react'
import AnnonceCard from '../components/AnnonceCard'
import '../styles/home.css'
import Filtres from '../components/Filtres'
import { Image } from '@chakra-ui/react'
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api'
import { Dots } from 'react-activity'
import { collection, limit, orderBy, query, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useSearchParams } from 'react-router-dom'


export default function Home() {
  const libraries = ['places']
  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    libraries: libraries
})
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = []
  for (let entries of searchParams.entries()){
    filters.push(entries)
  }
  const [annonces, setAnnonces] = useState([]);
  useEffect(()=>{
    if(!filters){
    async function getData(){
      try {
        const q = query(collection(db, 'Listings'), orderBy('timestamp', 'desc'), limit(10))
        const querySnap = await getDocs(q);
        let annonces = []
        querySnap.forEach((doc)=>{return(annonces.push({
          id: doc.id,
          data: doc.data()
        }))})
        setAnnonces(annonces)
      } catch (error) {
        console.log(error.message)
      }
    }}
  }, [])
  const containerStyle = {
    height: 'calc(100vh - 180px)'
  };
  const center={lat:45.764043, lng:4.835659}
  return (
    <div className="page">
    
      <div className="main-grid">
        <div className="grid">
        <Filtres/>
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
