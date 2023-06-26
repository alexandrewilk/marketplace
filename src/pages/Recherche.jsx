import React, { useState, useEffect } from 'react';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { Dots } from 'react-activity';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Box, Stack, Select, Button, Grid, Center, Flex, VStack, GridItem, Spinner, Text, Switch, Spacer, Heading, Input, InputGroup, InputLeftElement, List, ListItem } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useJsApiLoader, InfoWindowF, GoogleMap, MarkerF } from '@react-google-maps/api';
import AnnonceCard from '../components/AnnonceCard';
import { db } from '../firebase';
import villes from '../assets/data/villes2.json';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const containerStyle = {
  height: 'calc(100vh - 180px)'
};

const Searchvilles = require('../assets/data/villes2.json').map((v) => v.city);

function search(input) {
  return Searchvilles.filter((v) => v.slice(0, input.length) === input);
}

const availableFilters = ['type', 'nbPieces', 'prixMax'];

export default function Recherche() {
  const [ville, setVille] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

  function handleKeyDown(e) {
    switch (e.key) {
      case 'Enter': // naviguer quand l'utilisateur presse entré
        navigate(`/recherche/${suggestions[activeSuggestionIndex]}`);
        setSuggestions([]); 
        break;
      case 'ArrowUp': // sélectionner la suggestion précédente
        if (activeSuggestionIndex > 0) {
          setActiveSuggestionIndex(activeSuggestionIndex - 1);
        }
        break;
      case 'ArrowDown': // sélectionner la suggestion suivante
        if (activeSuggestionIndex < suggestions.length - 1) {
          setActiveSuggestionIndex(activeSuggestionIndex + 1);
        }
        break;
    }
  }

  function handleInput(e) {
    e.preventDefault();
    if (e.target.value === '') {
      setSuggestions([]);
      setActiveSuggestionIndex(0);
      return;
    }
    setVille(e.target.value);
    setSuggestions([...search(e.target.value)]);
  }

  const libraries = ['places'];
  const [isMapVisible, setMapVisible] = useState(true);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    libraries: libraries
  });
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
        console.log(filterAnnonces(annonces));
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
      <div
        key={a.id}
        onClick={(e) => {
          e.preventDefault();
          navigate(`/listings/${a.id}`);
        }}
      >
        <AnnonceCard key={a.id} data={a.data} />
      </div>
    ));
  }

  return (
    <Box>
      <Box>
        <Box border="1px" borderColor="gray.100" boxShadow="sm" p={3}>
          <Flex justifyContent="space-between">
            <Box position="relative" width="45%">
              <InputGroup>
                <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray" />} />
                <Input
                  type="search"
                  borderColor="gray"
                  placeholder="Entrez le nom d'une autre ville..."
                  onKeyDown={handleKeyDown}
                  onChange={handleInput}
                />
              </InputGroup>
              {suggestions.length > 0 && (
                <VStack
                  align="start"
                  spacing={2}
                  width="100%"
                  maxHeight="200px"
                  overflowY="auto"
                  boxShadow="md"
                  borderRadius="md"
                  p={2}
                  backgroundColor="white"
                  position="absolute"
                  mt={2}
                  zIndex={1}
                >
                  <List w="100%">
                    {suggestions.map((s, index) => (
                      <ListItem
                        key={s}
                        p={2}
                        bg={index === activeSuggestionIndex ? 'gray.200' : 'white'}
                        borderRadius="md"
                        width="100%"
                        align="start"
                        _hover={{ bg: 'gray.200' }}
                      >
                        {s}
                      </ListItem>
                    ))}
                  </List>
                </VStack>
              )}
            </Box>

            <Stack direction={['column', 'row']} spacing={4} w="45%">
              <Select
                placeholder="Type de logement"
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
            </Stack>
          </Flex>
        </Box>
      </Box>


      <Flex direction="column" alignItems="center">
        <Grid templateColumns={isMapVisible ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)'} w="100vw">
          <GridItem mx={isMapVisible ? '0px' : '10%'} maxW={isMapVisible ? 'auto' : '1200px'} overflowY="scroll" h="calc(100vh - 68px)">
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
            <Box width="95%" marginX="2.5%">
              {renderContent()}
            </Box>
          </GridItem>

          {isMapVisible && (
            <GridItem h="calc(100vh - 68px)">
              <MapContainer center={center} zoom={13}  style={{height : "calc(100vh - 68px)"}}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'"
    />
   

  </MapContainer>
            </GridItem>
          )}
        </Grid>
      </Flex>
    </Box>
  );
}
