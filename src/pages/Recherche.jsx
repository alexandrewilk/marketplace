import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';
import { Dots } from 'react-activity';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
    Box, Select, Grid, Flex, GridItem,
    Switch, Spacer, Heading, useColorModeValue, useMediaQuery
} from '@chakra-ui/react';
import AnnonceCard from '../components/AnnonceCard';
import { db } from '../firebase';
import villes from '../assets/data/villes2.json';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import '../styles/home.css'
import { useAuthStatus } from '../hooks/useAuthStatus';
import { auth } from '../firebase';
import { LikesContext } from '../context/LikesContext';


function createPriceMarker(price) {
  let svgMarkup = `
    <svg width="53" height="36" viewBox="0 0 53 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 3C0 1.34315 1.34315 0 3 0H50C51.6569 0 53 1.34315 53 3V26.4563C53 28.1132 51.6569 29.4563 50 29.4563H33.8041C32.908 29.4563 32.0588 29.8569 31.4889 30.5485L27.6772 35.1744C26.8902 36.1294 25.4337 36.1478 24.6228 35.213L20.5268 30.4906C19.9569 29.8337 19.1301 29.4563 18.2605 29.4563H3C1.34314 29.4563 0 28.1132 0 26.4563V3Z" fill="#172ACE"/>
    <text x="50%" y="50%" dy=".1em" font-size="14px" text-anchor="middle" fill="#fff">${String(price)}€</text>
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

const availableFilters = ['type', 'nbPieces', 'prixMax'];

export default function Recherche() {
    const [isLargerThan750] = useMediaQuery("(min-width: 750px)");
    const {loggedIn, loadingAuth} = useAuthStatus();
    const [userLikes, setUserLikes] = useState([])
    const [isMapVisible, setMapVisible] = useState(true);
 
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

    const center = villeInfo ? [villeInfo.lat, villeInfo.lng] : [0, 0];


    useEffect(() => {
        async function fetchData() {
            if (!villeInfo) {
                setLoading(false);
                return;
            }
            try {
                const q = query(collection(db, 'Listings'), where('ville', '==', villeInfo.city), limit(100));
                const querySnap = await getDocs(q);
                const annonces = querySnap.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
                setAnnonces(annonces);
                setFilteredAnnonces(filterAnnonces(annonces));
            } catch (error) {
                alert(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [params.ville]);

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
    
    function filterAnnonces(annonces) {
        return annonces.filter((a) => {
            for (let key in currentFilters) {
                if (currentFilters[key] !== 'null' && currentFilters[key]) {
                    if (key === 'prixMax') return a.data.loyer <= currentFilters[key];
                    if (key === 'type') return a.data.type === currentFilters[key];
                    if (key === 'nbPieces') return Number(a.data.nbPieces) >= Number(currentFilters[key]);
                }
            }
            return true;
        });
    }

 function renderContent() {
  if (loading) return <Dots />;
  if (!villeInfo) return <h1>VILLE CLOCHARDE DSL PAS SUPPORTÉ</h1>;
  if (filteredAnnonces.length === 0) return <h1>PAS DANNONCES DANS CETTE VILLE</h1>;

  return (
    <Grid templateColumns={isLargerThan750 && !isMapVisible ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)'} gap={!isMapVisible ? '8' : '0'}>
      {filteredAnnonces.map((a) => (
        <AnnonceCard key={a.id} data={a.data} id={a.id} />
      ))}
    </Grid>
  );
}
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
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
            gap={6}
            css={{
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
          >
            <Select
                placeholder="Coloc et coliving"
                minInlineSize="200px"
                onChange={(e) =>
                  setCurrentFilters((prev) => {
                    let filter = { ...prev, type: e.target.value };
                    return filter;
                  })
                }
              >
                <option value="maison">Maison</option>
                <option value="Appart">Appartement</option>
                <option value="studio">Villa</option>
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
              >
                <option value="maison">Maison</option>
                <option value="Appart">Appartement</option>
                <option value="studio">Villa</option>
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
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
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
              >
                <option value="500">500€</option>
                <option value="1000">1000€</option>
                <option value="1500">1500€</option>
              </Select>

              <Select placeholder="Source" minInlineSize="200px">
                <option value="500">500€</option>
                <option value="1000">1000€</option>
                <option value="1500">1500€</option>
              </Select>

              <Select placeholder="Equipement" minInlineSize="200px">
                <option value="500">500€</option>
                <option value="1000">1000€</option>
                <option value="1500">1500€</option>
              </Select>

              <Select placeholder="Régles spèciales" minInlineSize="200px">
                <option value="500">500€</option>
                <option value="1000">1000€</option>
                <option value="1500">1500€</option>
              </Select>

              <Select placeholder="Surface" minInlineSize="200px">
                <option value="500">500€</option>
                <option value="1000">1000€</option>
                <option value="1500">1500€</option>
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
            maxW={isMapVisible ? 'auto' : '1200px'} 
            overflowY="scroll" 
            maxHeight="calc(100vh - 134px)"
            css={{
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '10px',
                height: '8', // Changer la hauteur ici
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
              },
            }}
            
          >
            {isLargerThan750 && (
              <Flex align="center" w="95%" marginX="2.5%" marginY="12px">
                <Heading as="h4" size="md">
                  193 annonces à
                </Heading>
                <Spacer />
                <Heading as="h4" size="md" mr="12px">
                  Carte
                </Heading>
                <Switch size="md" isChecked={isMapVisible} onChange={(e) => setMapVisible(e.target.checked)} />
              </Flex>
            )}
            <Box width="95%" marginX="2.5%">
              <LikesContext.Provider value={[userLikes, setUserLikes]}>
                {renderContent()}
              </LikesContext.Provider>
            </Box>
          </GridItem>


          {isLargerThan750 && isMapVisible && (
            <GridItem h="calc(100vh - 134px)">
              <MapContainer center={center} zoom={13}  style={{height : "calc(100vh - 134px)"}}>
                <ChangeView center={center} zoom={13}/>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'"
                />
                  {filteredAnnonces.map((a) => {
                    let priceMarker = createPriceMarker(a.data.loyer);
                    return (
                      <Marker 
                        key={a.id}
                        position={[a.data.geolocation.lat, a.data.geolocation.lng]}
                        icon={priceMarker}
                      />
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
