import { collection, getDocs, limit, query, where } from 'firebase/firestore'
import React, {useState, useEffect} from 'react'
import { Dots } from 'react-activity'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../firebase'
import AnnonceCard from '../components/AnnonceCard'
import { useJsApiLoader, InfoWindowF, GoogleMap, MarkerF } from '@react-google-maps/api'
import { Box, Stack, Select, Button, Grid, Center, Flex, VStack, GridItem, Spinner, Text, Switch, Spacer, Heading } from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom'
const villes = require('../assets/data/villes2.json')
const containerStyle = {
    height: 'calc(100vh - 180px)'
  };

  const availableFilters = ['type', 'nbPieces', 'prixMax']
  
export default function Recherche() {
    const libraries = ['places']
    const [isMapVisible, setMapVisible] = useState(true);
    const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    libraries: libraries
    })
  
    const params = useParams() //params est la ville
    const [searchParams, setSearchParams] = useSearchParams(); //les searchparams sont les filtres
    const [currentFilters, setCurrentFilters] = useState(()=>{ //on récupères les searchparams 'localement', que l'on pourra éditer dans un forme
        var rObj = {}
        for (let filter of availableFilters){
            rObj[filter] = searchParams.get(filter)
        }
        return rObj
    })
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [annonces, setAnnonces] = useState([])
    const [filteredAnnonces, setFilteredAnnonces] = useState([])
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
                console.log(filterAnnonces(annonces)) 
                setAnnonces(annonces) //on récupère toutes les annonces
                setFilteredAnnonces(filterAnnonces(annonces))//ça c'est les annonces qui s'afficheront, celles filtrées selon searchparams
            } catch (error) {
                alert(error.message)
            }finally{
                setLoading(false)
            }

        }
        fetchData();
    }, [])

    useEffect(()=>{
        var searchParamObj = {} //dès qu'on update (localement) les filtres, on set les searchParams dans l'url puis on filtre les annonces selon ces nouveaux params
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
            if (currentFilters[key]!="null" && currentFilters[key]){
            if(key == 'prixMax'){
                annonces = annonces.filter((a) => {return(a.data.loyer <= currentFilters[key])})
            }
            if(key == 'type'){
                annonces = annonces.filter((a) => {return(a.data.type == currentFilters[key])})
            }
            if (key == 'nbPieces'){
                annonces = annonces.filter((a) => {return(Number(a.data.nbPieces) >= Number(currentFilters[key]))}) 
            }
        }}
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
        <Flex direction="column" alignItems="center">
          <Grid templateColumns={isMapVisible ? "repeat(2, 1fr)" : "repeat(1, 1fr)"} w="100vw">
            <GridItem mx={isMapVisible ? "0px": "10%"} maxW={isMapVisible ? "auto": "1200px"}>
              <Box p={4}>
              <Stack
                    direction={['column', 'row']}
                    spacing={4}
                >
                    <Select placeholder="Type de logement" onChange={(e)=>{setCurrentFilters((prev)=>{let filter = {...prev, ['type'] : e.target.value};return filter})}}>
                    <option value="maison">Maison</option>
                    <option value="Appart">Appartement</option>
                    <option value="studio">Villa</option>
                    </Select>

                    <Select placeholder="Nombre de pièces" onChange={(e)=>{setCurrentFilters((prev)=>{let filter = {...prev, ['nbPieces'] : e.target.value};return filter})}}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    </Select>

                    <Select placeholder="Loyer Max" onChange={(e)=>{setCurrentFilters((prev)=>{let filter = {...prev, ['prixMax'] : e.target.value};return filter})}}>
                    <option value="500">500€</option>
                    <option value="1000">1000€</option>
                    <option value="1500">1500€</option>
                    </Select>
                </Stack>

              </Box>
              <Flex align="center" m="12px">
                <Heading as='h4' size='md'>193 annonces à Paris</Heading>
                <Spacer />
                <Heading as='h4' size='md' mr="12px">Carte</Heading>
                <Switch size='md' isChecked={isMapVisible} onChange={(e) => setMapVisible(e.target.checked)}/>
            </Flex>
              {renderContent()}
            </GridItem>
            {isMapVisible && 
            <GridItem h="calc(100vh - 68px)">
                {isLoaded ?
                    <GoogleMap
                    center={center}
                    zoom={13}
                    mapContainerStyle={{ height: '100%' }}
                    options={{
                        zoomControl: true,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}>
                        <MarkerF position={center} onClick={(e) => { console.log('clicked') }} />
                    </GoogleMap>
                    :
                    <Flex justify="center" align="center" height="100%">
                    <Spinner size="xl" />
                    </Flex>
                }
                </GridItem>
            }   
          </Grid>
        </Flex>
      );
}
