import React, { useState, useEffect, useRef, createRef } from 'react';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { Dots } from 'react-activity';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
    Box, Select, Grid, Flex, GridItem, Button, useDisclosure, 
    Switch, Spacer, Heading, useColorModeValue, useMediaQuery, Text, Center, Slide
} from '@chakra-ui/react';
import AnnonceCard from '../components/AnnonceCard';
import { db } from '../firebase';
import villes from '../assets/data/villes2.json';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import '../styles/home.css'
import { useAuthStatus } from '../hooks/useAuthStatus';
import { auth } from '../firebase';
import { LikesContext } from '../context/LikesContext';
import SaveAlerteButton from '../components/SaveAlerteButton';
import AnnonceCardMap from '../components/AnnnonceCardMap';
import home from "../styles/home.css"
import No_Ville from '../assets/images/No_Ville.png';
import No_Resultat from '../assets/images/No_Resultat.png';
import { motion } from "framer-motion";

function createPriceMarker(price) {
  let svgMarkup = `
    <svg width="53" height="36" viewBox="0 0 53 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 3C0 1.34315 1.34315 0 3 0H50C51.6569 0 53 1.34315 53 3V26.4563C53 28.1132 51.6569 29.4563 50 29.4563H33.8041C32.908 29.4563 32.0588 29.8569 31.4889 30.5485L27.6772 35.1744C26.8902 36.1294 25.4337 36.1478 24.6228 35.213L20.5268 30.4906C19.9569 29.8337 19.1301 29.4563 18.2605 29.4563H3C1.34314 29.4563 0 28.1132 0 26.4563V3Z" fill="#172ACE"/>
    <text x="50%" y="50%" dy=".1em" font-size="14px" text-anchor="middle" fill="#fff">${Math.round(price)}€</text>
    </svg>
  `;

  return L.divIcon({
    className: 'my-div-icon',
    html: svgMarkup,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50]
  });
}

function createHoveredPriceMarker(price) {

  let svgMarkup = `
    <svg width="53" height="36" viewBox="0 0 53 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 3C0 1.34315 1.34315 0 3 0H50C51.6569 0 53 1.34315 53 3V26.4563C53 28.1132 51.6569 29.4563 50 29.4563H33.8041C32.908 29.4563 32.0588 29.8569 31.4889 30.5485L27.6772 35.1744C26.8902 36.1294 25.4337 36.1478 24.6228 35.213L20.5268 30.4906C19.9569 29.8337 19.1301 29.4563 18.2605 29.4563H3C1.34314 29.4563 0 28.1132 0 26.4563V3Z" fill="red"/>
    <text x="50%" y="50%" dy=".1em" font-size="14px" text-anchor="middle" fill="#fff">${Math.round(price)}€</text>
    </svg>
  `;

  return L.divIcon({
    className: 'my-div-icon',
    html: svgMarkup,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50]
  });
}


let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const availableFilters = ['type', 'nbPieces', 'prixMax', 'co', 'regles', 'meuble', 'surface'];

export default function Recherche() {
    const [isLargerThan750] = useMediaQuery("(min-width: 750px)");
    const [isLargerThan450] = useMediaQuery("(min-width: 450px)");
    const [lastFlyToVille, setLastFlyToVille] = useState("");
    const {loggedIn, loadingAuth} = useAuthStatus();
    const [loadingAlerte, setLoadingAlerte] = useState(false)
    const [userLikes, setUserLikes] = useState([])
    const [isMapVisible, setMapVisible] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [nextPostsLoading, setNextPostsLoading] = useState(false);
    const [lastKey, setLastKey] = useState("")
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentFilters, setCurrentFilters] = useState(() => {
        const filterObj = {};
        for (let filter of availableFilters) {
            filterObj[filter] = searchParams.get(filter);
        }
        return filterObj;
    });

    
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [annonces, setAnnonces] = useState([]);
    const [filteredAnnonces, setFilteredAnnonces] = useState([]);
    const villeInfo = villes.find((v) => v.city === params.ville);
    const [sorter, setSorter] = useState('timestamp')
    const center = villeInfo ? [villeInfo.lat, villeInfo.lng] : [0, 0];

    console.log(params.ville)

    const annonceRefs = useRef([]);
    annonceRefs.current = annonces.map((a, i) => annonceRefs.current[i] ?? createRef());

    const [hoveredAnnonce, setHoveredAnnonce] = React.useState(null);

    function handleMarkerHover(id) {
      setHoveredAnnonce(id);
      if (id !== null) {
        const index = filteredAnnonces.findIndex(annonce => annonce.id === id);
        if (annonceRefs.current[index]) {
          annonceRefs.current[index].current.scrollIntoView({
            behavior: "instant",
            block: "center",
          });
        }
      }
      
    }

    const handleAnnonceHover = (id) => {
      setHoveredAnnonce(id);
    };

    useEffect(() => {
        async function fetchData() {
            if (!villeInfo) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true)
                const q = query(collection(db, 'Listings'), where('ville', '==', villeInfo.city), limit(50), orderBy(sorter));
                const querySnap = await getDocs(q);
                const annonces = querySnap.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
                setAnnonces(annonces);
                setFilteredAnnonces(filterAnnonces(annonces));
                setLastKey(annonces[annonces.length-1].data[sorter])
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [params.ville, sorter]);

    useEffect(() => {
        const searchParamObj = {};
        for (let filter of availableFilters) {
            if (searchParams.get(filter)) {
                searchParamObj[filter] = searchParams.get(filter);
            }
        }
        if (searchParamObj !== currentFilters) {
            setSearchParams(currentFilters);
        }
        setFilteredAnnonces(filterAnnonces(annonces));
    }, [currentFilters]);

    useEffect(()=>{
      async function getUserLikes(){
        if(loggedIn){
          const data = await getDoc(doc(db, 'Users', auth.currentUser.uid))
          if(data.data().likes){
            setUserLikes(data.data().likes)
          }
        }
      }
      getUserLikes();
    }, [loggedIn])
    
    async function getMorePosts(){
      try {
        setNextPostsLoading(true)
        const q = query(collection(db, 'Listings'), where('ville', '==', villeInfo.city), limit(100), orderBy(sorter), startAfter(lastKey));
        const querySnap = await getDocs(q);
        const res = querySnap.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
        setLastKey(res[res.length -1].data[sorter]);
        let annoncesSetter = annonces.concat(res)
        setAnnonces(annoncesSetter)
        setFilteredAnnonces(filterAnnonces(annoncesSetter))
      } catch (error) {
        alert('Toutes les annonces ont été chargées !')
      }finally{setNextPostsLoading(false)}
    }
    function filterAnnonces(annonces) {
      let res = annonces
      for (let key in currentFilters){
        if (currentFilters[key] !== 'null' && currentFilters[key]){
          if (key === 'prixMax') res = res.filter((a)=> a.data.loyer <= currentFilters[key])
          if (key === 'type') res = res.filter((a)=> a.data.type === currentFilters[key])
          if (key === 'nbPieces') res = res.filter((a)=> Number(a.data.nbPieces) >= Number(currentFilters[key]))
          if (key == 'co') res = res.filter((a)=> a.data.co == currentFilters[key])
          if (key == 'regles') res = res.filter((a)=> a.data.regles.includes(currentFilters[key]))
          if (key == 'meuble') res = res.filter((a)=> a.data.meuble == currentFilters[key])
          if (key == 'surface') res = res.filter((a) => Number(a.data.surface) >= Number(currentFilters[key]))
          if (key == 'equipement') res = res.filter((a)=> a.data.equipements.includes(currentFilters[key]))
        }
      }
      return res
    }

    const ChangeView = ({ center }) => {
      const map = useMap();
      useEffect(() => {
        if (map && params.ville !== lastFlyToVille) {
          map.flyTo(center, 13, { duration: 2 });
          setLastFlyToVille(params.ville);
        }
      }, [params.ville, map]);
      
      return null;
  }

 function renderContent() {
  if (loading) return <Dots />;
  if (!villeInfo) {
    return (
      <Flex justifyContent="center">
        <Center flexDirection="column" mt="80px">
            <img src={No_Ville} alt="maison"/>
            <Text fontSize="xl" fontWeight="bold" marginBottom="1rem">Ta ville n'est pas encore disponible sur coloc.fr</Text>
        </Center>
      </Flex>
    );
}
if (filteredAnnonces.length === 0) {
  return (
    <Flex justifyContent="center">
      <Center flexDirection="column" mt="80px">
          <img src={No_Resultat} alt="Image"/>
          <Text fontSize="xl" fontWeight="bold" marginBottom="1rem" marginTop="20px">Il n'y pas encore d'annonce à {params.ville}</Text>
          <Button colorScheme="blue" onClick={() => navigate('/Déposer-une-annonce')}>Dépose en une!</Button>
      </Center>
    </Flex>
  );
}
  return (
      <Grid templateColumns={isLargerThan450 ? 'repeat(auto-fill, minmax(200px, 1fr))' : 'repeat(auto-fill, minmax(170px, 1fr))'} gap={isLargerThan450 ? '3' : '0'}> 
       {filteredAnnonces.map((a, index) => (
        <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 * index, duration: 1 }}
        >
       <AnnonceCard 
          key={a.id} 
          data={a.data} 
          id={a.id} 
          ref={annonceRefs.current[index]}
          hovered={hoveredAnnonce === a.id}
          handleAnnonceHover={handleAnnonceHover}
        />
        </motion.div>
      ))}
    </Grid>
  );
}  

  return (
   
    <Box>
      <Box>
        <Box 
         border="1px"
         borderColor="gray.100"
         boxShadow="sm"
         p={3}
         position="relative"
         overflow="hidden"
        >
        <Flex 
            direction="row"
            overflowX="auto"
            gap={3}
            css={{
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
          >
          <SaveAlerteButton ville={params.ville} currentFilters={currentFilters}/>

            <Select
                placeholder="Coloc et coliving"
                minInlineSize="200px"
                onChange={(e) =>
                  setCurrentFilters((prev) => {
                    let filter = { ...prev, co: e.target.value };
                    return filter;
                  })
                }
                value={(currentFilters['co']=='null' || !currentFilters['co']) ? '' : currentFilters['co']}>
                <option value="coliving">Coliving</option>
                <option value="colocation">Colocation</option>
              </Select>

              <Select
                placeholder="Type de logement"
                minInlineSize="200px"
                onChange={(e) =>
                  setCurrentFilters((prev) => {
                    let filter = { ...prev, type: e.target.value };
                    return filter;
                  })
                }
                value={(currentFilters['type']=='null' || !currentFilters['type']) ? '' : currentFilters['type']}>
                <option value="Maison">Maison</option>
                <option value="Appartement">Appartement</option>
                <option value="Villa">Villa</option>
                <option value="Studio">Studio</option>
              </Select>

              <Select
                placeholder="Nombre de pièces"
                minInlineSize="200px"
                onChange={(e) =>
                  setCurrentFilters((prev) => {
                    let filter = { ...prev, nbPieces: e.target.value };
                    return filter;
                  })
                }
                value={(currentFilters['nbPieces']=='null' || !currentFilters['nbPieces']) ? '' : currentFilters['nbPieces']}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value= "4">4</option>
                <option value= "5">5</option>
                <option value= "6">6</option>
                <option value= "7">7</option>
                <option value= "8">8</option>
                <option value= "9">9</option>
                <option value= "10">10+</option>
              </Select>

              <Select
                placeholder="Loyer Max"
                minInlineSize="200px"
                onChange={(e) =>
                  setCurrentFilters((prev) => {
                    let filter = { ...prev, prixMax: e.target.value };
                    return filter;
                  })
                }
                value={(currentFilters['prixMax']=='null' || !currentFilters['prixMax']) ? '' : currentFilters['prixMax']}>
                <option value="500">500€</option>
                <option value="1000">1000€</option>
                <option value="1500">1500€</option>
                <option value="2000">2000€</option>
              </Select>

              <Select placeholder="Meublé" minInlineSize="200px"
              onChange={(e) =>
                setCurrentFilters((prev) => {
                  let filter = { ...prev, meuble: e.target.value };
                  return filter;
                })}
                value={currentFilters['meuble']=='null' || !currentFilters['meuble'] ? '' : currentFilters['meuble']}>
                <option value="true">Oui</option>
                <option value="false">Non</option>
              </Select>

              <Select placeholder="Equipements" minInlineSize="200px"
              onChange={(e) =>
                setCurrentFilters((prev) => {
                  let filter = { ...prev, equipements: e.target.value };
                  return filter;
                })
              }
              value={(currentFilters['equipements']=='null' || !currentFilters['equipements']) ? '' : currentFilters['equipements']}>
                <option value="wifi">Wi-Fi</option>
                <option value="machine-a-laver">Machine à laver</option>
                <option value="lave-vaisselle">Lave vaisselle</option>
                <option value="tv">TV</option>
              </Select>

              <Select placeholder="Régles spèciales" minInlineSize="200px"
              onChange={(e) =>
                setCurrentFilters((prev) => {
                  let filter = { ...prev, regles: e.target.value };
                  return filter;
                })
              }
              value={(currentFilters['regles']=='null' || !currentFilters['regles']) ? '' : currentFilters['regles']}>
                <option value="ok-animaux">Animaux bienvenus</option>
                <option value="only-homme">Homme seulement</option>
                <option value="only-femme">Femme seulement</option>
                <option value="non-fumeur">Non fumeur</option>
              </Select>

              <Select placeholder="Surface minimale" minInlineSize="200px"
              onChange={(e) =>
                setCurrentFilters((prev) => {
                  let filter = { ...prev, surface: e.target.value };
                  return filter;
                })
              }
              value={(currentFilters['surface']=='null' || !currentFilters['surface']) ? '' : currentFilters['surface']}>
                <option value="20">20m2</option>
                <option value="30">30m2</option>
                <option value="40">40m2</option>
                <option value="50">50m2</option>
                <option value="60">60m2</option>
                <option value="70">70m2</option>
                <option value="80">80m2</option>
                <option value="90">90m2+</option>
              </Select>
            </Flex>
            <Box
              position="absolute"
              right="0"
              top="0"
              bottom="0"
              width="50px"
              backgroundImage={`linear-gradient(to left, ${
                useColorModeValue('white', 'gray.800')
              }, transparent)`}
            />
        </Box>
      </Box>


      <Flex direction="column" alignItems="center">
        <Grid templateColumns={isLargerThan750 && isMapVisible ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)'} w="100vw">
            <GridItem 
              mx={isMapVisible ? '0px' : '10%'} 
              overflowY="scroll" 
              maxHeight="calc(100vh - 134px)"
              css={{
                ...(isMapVisible
                  ? {}
                  : {
                      '&::-webkit-scrollbar': {
                        width: '4px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#888',
                        borderRadius: '10px',
                        height: '8',
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                        background: '#555',
                      },
                    }),
              }}
            >

            
              <Flex align="center" w="95%" marginX="2.5%" marginY="12px">
                <Heading as="h4" size="md">
                  {filteredAnnonces.length}{`+ annonce${filteredAnnonces.length ==1 ? '' : 's'}`} à {params.ville}
                </Heading>
                <Spacer />
                <Select placeholder='Trier par' maxW="150px" size='sm' mr={4} onChange={(e)=>{setSorter(e.target.value)}} value={sorter}>
                  <option value='timestamp'>Trier par Date (par défaut)</option>
                  <option value='loyer'>Trier par Loyer</option>
                </Select>
                {isLargerThan450 && (
                  <Flex alignItems="center">
                    <Heading as="h4" size="md" mr="12px">
                      Carte
                    </Heading>
                      <Switch size="md" isChecked={isMapVisible} onChange={(e) => setMapVisible(e.target.checked)} />
                  </Flex>
                  )}
              </Flex>
           
            <Box width="95%" marginX="2.5%">
              <LikesContext.Provider value={[userLikes, setUserLikes]}>
                {renderContent()}
              </LikesContext.Provider>
              {nextPostsLoading 
                ? <Dots/> 
                : (filteredAnnonces.length > 0 && <Button onClick={(e) => {e.preventDefault(); getMorePosts()}}>Voir Plus...</Button>)
              }            </Box>
          </GridItem>

            {/* Partie pour gérer la map */}
          {isLargerThan750 && isMapVisible && (
            <GridItem h="calc(100vh - 134px)">
              <MapContainer center={center} zoom={13}  style={{height : "calc(100vh - 134px)"}}>
              <ChangeView center={center} /> 
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'"
                />
                  {filteredAnnonces.map((a) => {
                    let priceMarker = hoveredAnnonce === a.id ? createHoveredPriceMarker(a.data.loyer) : createPriceMarker(a.data.loyer);
                    return (
                      <Marker
                        key={a.id}
                        position={[a.data.geolocation.lat, a.data.geolocation.lng]}
                        icon={priceMarker}
                        eventHandlers={{
                          mouseover: () => handleMarkerHover(a.id),
                          mouseout: () => handleMarkerHover(null)
                        }}
                      >
                        <Popup>
                          <AnnonceCardMap
                           key={a.id} 
                           data={a.data} 
                           id={a.id} 
                          />
                        </Popup>
                      </Marker>
                    );
                  })}
              </MapContainer>
            </GridItem>
          )}
        </Grid>
      </Flex>
    </Box>

  );
}
