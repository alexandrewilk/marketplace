import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';
import { Dots } from 'react-activity';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
    Box, Stack, Select, Button, Grid, Center, Flex, VStack, GridItem,
    Spinner, Text, Switch, Spacer, Heading, Input, InputGroup,
    InputLeftElement, List, ListItem, useColorModeValue, useMediaQuery
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import AnnonceCard from '../components/AnnonceCard';
import { db } from '../firebase';
import villes from '../assets/data/villes2.json';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import '../styles/home.css'
import { useAuthStatus } from '../hooks/useAuthStatus';
import { auth } from '../firebase';
import { LikesContext } from '../context/LikesContext';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const availableFilters = ['type', 'nbPieces', 'prixMax'];

export default function Recherche() {
    const [isLargerThan750] = useMediaQuery("(min-width: 750px)");
    const [ville, setVille] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
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

        return filteredAnnonces.map((a) => (
                <AnnonceCard key={a.id} data={a.data} id={a.id}/>
        ));
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
          <GridItem mx={isMapVisible ? '0px' : '10%'} maxW={isMapVisible ? 'auto' : '1200px'} overflowY="scroll" h="calc(100vh - 68px)">
          {isLargerThan750 && (
            <Flex align="center" m="12px">
              <Heading as="h4" size="md">
                193 annonces à {ville}
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
            <GridItem h="calc(100vh - 68px)">
              <MapContainer center={center} zoom={13}  style={{height : "calc(100vh - 68px)"}}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'"
                />
              {filteredAnnonces.map((a)=>{return <Marker key={a.id}position={[a.data.geolocation.lat, a.data.geolocation.lng]}></Marker>})}

              </MapContainer>
            </GridItem>
          )}
        </Grid>
      </Flex>
    </Box>
  );
}
