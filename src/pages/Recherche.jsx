import { collection, getDocs, limit, query, where } from 'firebase/firestore'
import React, {useState, useEffect} from 'react'
import { Dots } from 'react-activity'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../firebase'
import AnnonceCard from '../components/AnnonceCard'
import '../styles/home.css'
import { useJsApiLoader, MarkerF, GoogleMap } from '@react-google-maps/api'
import { Box, Stack, Select, Input, Button } from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom'
const villes = require('../assets/data/villes2.json')
const containerStyle = {
    height: 'calc(100vh - 180px)'
  };

  const availableFilters = ['type', 'nbPieces', 'prixMax']

export default function Recherche() {
    const params = useParams()
    const [searchParams, setSearchParams] = useSearchParams();
 
    const [currentFilters, setCurrentFilters] = useState(()=>{
        var rObj = {}
        for (let filter of availableFilters){
            if(searchParams.get(filter)){
            rObj[filter] = searchParams.get(filter)}
        }
        return rObj
    })
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [annonces, setAnnonces] = useState([])
    const [filteredAnnonces, setFilteredAnnonces] = useState([])
    const libraries = ['places']
    const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    libraries: libraries
    })
    const villeInfo = villes.find((v)=>{return(v.city == params.ville)})
    const center = villeInfo ? {lat: villeInfo.lat, lng: villeInfo.lng} : {lat:0, lng:0}
    useEffect(()=>{
        async function fetchData(){
            if(!villeInfo){setLoading(false);return}
            try {
                const q = query(collection(db, 'Listings'), where('ville', '==', villeInfo.city), limit(100))
                const querySnap = await getDocs(q)
                let annonces = []
                querySnap.forEach((doc)=>{return(annonces.push({
                    id: doc.id,
                    data : doc.data()
                }))})
                console.log(annonces)
                setAnnonces(annonces)
                setFilteredAnnonces(filterAnnonces(annonces))
            } catch (error) {
                alert(error.message)
            }finally{
                setLoading(false)
            }

        }
        fetchData();
    }, [])

    useEffect(()=>{
        var searchParamObj = {}
        for (let filter of availableFilters){
            if(searchParams.get(filter)){
            searchParamObj[filter] = searchParams.get(filter)}
        }
        if(searchParamObj != currentFilters){
            setSearchParams(currentFilters)
        }
        setFilteredAnnonces(filterAnnonces(annonces))
    }, [currentFilters])

    function filterAnnonces(annonces){
        for (let key in currentFilters){
            if(key == 'prixMax'){
                let annoncesSetter = annonces.filter((a) => {return(a.data.loyer <= currentFilters[key])})
                return annoncesSetter
            }
            if(key == 'type'){
                let annoncesSetter = annonces.filter((a) => {return(a.data.type == currentFilters[key])})
                return annoncesSetter
            }
            if (key == 'nbPieces'){
                let annoncesSetter = annonces.filter((a) => {return(Number(a.data.nbPieces) <= currentFilters[key])})
                return annoncesSetter
            }
        }
        return annonces
    }
   
    function renderContent(){

        if(loading){return (<Dots/>)}
        if(!villeInfo){return(<h1>VILLE CLOCHARDE DSL PAS SUPPORTÉ</h1>)}
        if(filteredAnnonces.length == 0){return(<h1>PAS DANNONCES DANS CETTE VILLE</h1>)}
        return(filteredAnnonces.map((a)=>{
            return(
                <div key = {a.id} onClick={(e)=>{e.preventDefault();navigate(`/listings/${a.id}`)}}>
                <AnnonceCard key={a.id} data = {a.data}/>
                </div>
            )
        }))
    }
  return (
    <div>
       <div className="page">
    
    <div className="main-grid">
      <div className="grid">
      <Box bg="gray.100" p={4}>
      <Stack
        direction={['column', 'row']}
        spacing={4}
      >
        <Select placeholder="Type de logement" onChange={(e)=>{setCurrentFilters((prev)=>{let filter = {...prev, ['type'] : e.target.value};return filter})}}>
          <option value="maison">Maison</option>
          <option value="Appart">Appartement</option>
          <option value="studio">Villa</option>
        </Select>

        <Select placeholder="Nombre de pièces">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </Select>

        <Select placeholder="Prix max">
          <option value="500">500€</option>
          <option value="1000">1000€</option>
          <option value="1500">1500€</option>
        </Select>
        
        <Button colorScheme="blue" width={"300px"}>Filtrer</Button>
      </Stack>
    </Box>
       {renderContent()}
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
              
          </GoogleMap> :<div className='flex  justify-center'><Dots/></div>}
      </div>
    </div>
  </div>
       
        
    </div>
    
  )
}
