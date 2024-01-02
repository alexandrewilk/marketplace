import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { Box, Grid, Image, Heading, useBreakpointValue, Divider, Text, Flex, Icon, VStack, Modal, ModalOverlay, ModalContent, ModalBody,  IconButton, useDisclosure, HStack} from "@chakra-ui/react";
import {AiOutlineShareAlt, AiOutlineHeart} from 'react-icons/ai';
import {HiOutlineMapPin} from 'react-icons/hi2';
import CustomBadge from '../../components/Annonce/CustomBadge';
import SendMessagePopup from '../../components/Annonce/SendMessagePopup';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import { BiImages } from "react-icons/bi";
import { toast } from 'react-toastify';
import { Dots } from 'react-activity';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const svgMarkup = `<svg width="86" height="86" viewBox="0 0 86 86" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="43" cy="43" r="43" fill="#172ACE"/>
<path d="M42.5 25L22 40.375H27.125V60.875H37.375V50.625H47.625V60.875H57.875V40.2213L63 40.375L42.5 25Z" fill="white"/>
</svg>
`;
const url = "data:image/svg+xml," + encodeURIComponent(svgMarkup);

const customIcon = new L.Icon({
  iconUrl: url,
  iconSize: [32, 32],
});


export default function Listing() {
  const gridTemplateColumnsThree = useBreakpointValue({ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" });
  const gridTemplateRow = useBreakpointValue({ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" });
  const gridTemplateColumnsSecondary = useBreakpointValue({ base: "1fr", md: "2fr 1fr" });
  const gridTemplateColumns = useBreakpointValue({ base: "2fr 1fr", md: "repeat(2, 1fr)" });
  const MainImageMaxHeight = useBreakpointValue({ base: "300px", md: "376px" });
  const OtherImageMaxHeight = useBreakpointValue({ base: "300px", md: "182px" });
  const MainImageMaxWidth = useBreakpointValue({ base: "auto", md: "558px" });
  const OtherImageMaxWidth = useBreakpointValue({ base: "auto", md: "273px" });
  const rulesMapping = {
    // "valeur-dans-BDD": "Affichage sur le navigateur"
    "only-homme": "Homme seulement",
    "only-femme": "Femme seulement",
    "non-fumeur": "Non fumeur",
    "ok-animaux": "Les animaux sont autorisés",
  };

  // const images = [SignInImage, SignInImage, SignInImage, SignInImage, NoPP];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const nextImage = () => {
    setSelectedImageIndex((selectedImageIndex + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
  };


    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    useEffect(()=>{
        async function fetchListing(){
            try{
            const docRef=doc(db, 'Listings', params.listingID)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
                console.log('here')
                setListing({id: docSnap.id, data: docSnap.data()})
            }
            }catch(error){
                alert(error.message)
            }finally{
                setLoadingData(false)
            }
        } 
        fetchListing();
    }, [params.listingID])

   
    async function handlePartager(){
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(()=>{toast.success("Le lien de l'annonce a été copié dans le presse papier !")})
      console.log("Valeur de regles:", listing.data.regles);
    }

    if(loadingData){
      return <Dots/>
    }

    if(!listing){
      return <Flex>Cette annonce n'existe pas ou plus !</Flex>
    }
    const images = listing.data.imgUrls
    return (
      
      <Box maxW="1200px" marginX="auto" mt={6} paddingX="2.5%">
       <Grid templateColumns={gridTemplateColumns} gap={3} >
       <Box w="100%" h="auto" position="relative">
       <Image src={images[0]} alt="Description de l'image 1" boxSize="100%" maxH={MainImageMaxHeight} maxW={MainImageMaxWidth} objectFit="cover" borderRadius="12px" onClick={onOpen}/>
        <Box position="absolute" bottom="2" right="2" bg="white" px={2} py={1} borderWidth="1px" borderColor="black" borderRadius="6px" onClick={e => {e.stopPropagation(); onOpen();}}>
          <HStack spacing={1}>
            <Icon as={BiImages} boxSize="20px"/>
            <Text fontSize="sm" color="black">Afficher toutes les photos</Text>
          </HStack>
        </Box>
      </Box>
        <Box w="100%" h="auto">
          <Grid templateColumns={gridTemplateColumnsThree} templateRows={gridTemplateRow} gap={3}>
          {images.slice(1, 5).map((imgUrl, index) => (
              <Image 
                  key={index} 
                  src={imgUrl} 
                  alt={`L'image n'a pas pu être chargée !`} 
                  boxSize="100%" 
                  maxH={OtherImageMaxHeight} 
                  maxW={OtherImageMaxWidth} 
                  objectFit="cover" 
                  borderRadius="12px" 
                  onClick={() => {onOpen(); setSelectedImageIndex(index + 1);}}
              />
          ))}

          </Grid>
        </Box>
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true} size="xl">
        <ModalOverlay />
        <ModalContent mx="auto" my="auto" w="auto" h="auto" maxH="90vh" maxW="90vw" bg="transparent" boxShadow="none">
          <ModalBody p={0}>
            <Flex justify="space-between" align="center">
              <IconButton icon={<ChevronLeftIcon boxSize="30px"/>} boxSize="50px" color="black" variant="ghost" onClick={prevImage} borderRadius="12px" right="5px" />
              <Image src={images[selectedImageIndex]} alt={`Description de l'image ${selectedImageIndex + 1}`} objectFit="contain" maxH="80vh" maxW="80vw" />
              <IconButton icon={<ChevronRightIcon boxSize="30px"/>} boxSize="50px" color="black" variant="ghost" onClick={nextImage} borderRadius="12px" left="5px" />
            </Flex>
            <IconButton icon={<CloseIcon />} colorScheme="red" variant="ghost" position="absolute" top="0" right="5px" onClick={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>

        <Grid templateColumns={gridTemplateColumnsSecondary} gap={3} marginTop={6}>
        <VStack w="100%" spacing={3}>
          <Box w="100%" h="auto" borderWidth="1px" boxShadow='base' borderColor="gray.200" borderRadius="12px" padding={4}>
          <Flex justifyContent="space-between" alignItems="center" marginBottom={4}>
            <CustomBadge text={listing.data.userRef == 'cartecoloc' ? 'La carte des colocs' : 'Coloc.fr'}/>
            <Flex direction="row" justify="space-between">
              <Box onClick={(e) => {e.preventDefault(); handlePartager()}} cursor="pointer" display="flex" alignItems="center">
                <Icon as={AiOutlineShareAlt} boxSize={6}/>
                <Text ml={1}>Partager</Text> 
              </Box>
              <Box onClick={() => console.log('Enregistrer')} cursor="pointer" display="flex" alignItems="center">
                <Icon as={AiOutlineHeart} boxSize={6} ml={4}/>
                <Text ml={1}>Enregistrer</Text>
              </Box>
            </Flex>

          </Flex>
            <Heading as='h1' size='xl' noOfLines={1}> {listing.data.type} {listing.data.nbPieces ? listing.data.nbPieces+' Pièces': ""} de {listing.data.surface} m2</Heading>

            <Flex flexDirection="row" alignItems="center">
              <Icon as={HiOutlineMapPin} boxSize={6}/>
              <Heading as="h3" size="md" marginY={3}>{listing.data.ville}</Heading>
            </Flex>
            
            <Divider/>
            <Text marginY={3}>
              {listing.data.desc}
            </Text>
          </Box>
         
          <Box w="100%" h="auto" borderWidth="1px" boxShadow='base' borderColor="gray.200" borderRadius="12px" padding={4}>
            <Heading as="h2" size="md" marginTop={3}>Equipement de la colocation</Heading>
            <Divider marginY={3}/>
            <Grid templateColumns="repeat(2, 1fr)" gap={3}>
              {listing.data.equipements.map((equipement, index) => (
                <Box key={index} display="flex" alignItems="center">
                  <Icon as={CheckCircleIcon} w={6} h={6} />
                  <Text ml={2}>{equipement}</Text>
                </Box>
              ))}
            </Grid>
          </Box>
          
          <Box w="100%" h="auto" borderWidth="1px" boxShadow='base' borderColor="gray.200" borderRadius="12px" padding={4}>
            <Heading as="h2" size="md" marginTop={3}>Règles spéciales</Heading>
            <Divider marginY={3}/>
            <Text marginY={3}>
                {listing.data.regles.map(regle => rulesMapping[regle] || `Valeur non mappée : ${regle}`).join(', ')}
            </Text>
          </Box>

          <Box w="100%" h="auto" borderWidth="1px" boxShadow='base' borderColor="gray.200" borderRadius="12px" padding={4}>
            <Heading as="h2" size="md" marginTop={3}>Visites 3D</Heading>
            <Divider marginY={3}/>
            <iframe width='100%' height='480' src={listing.data.matterportLink} frameborder='0' allowfullscreen allow='xr-spatial-tracking' borderRadius='6px'></iframe>
          </Box>

          </VStack>

          <Box w="100%" h="300" bg="white" borderWidth="1px" borderColor="gray.200" boxShadow='md' borderRadius="12px" position="sticky" top="0" padding="2.5%">
            <Flex flexDirection="column" justifyContent="space-between" height="100%">
              <Box>
                <Flex flexDirection="row" alignItems="end">
                  <Heading as="h3" size="lg">{listing.data.loyer}€</Heading>
                  <Text fontSize='xl'>/mois</Text>
                </Flex>
                <Divider marginY={4}/>
              </Box>
              <SendMessagePopup listing={listing}/>
            </Flex>
          </Box>
        </Grid>

        <Box w="100%" h="auto" borderWidth="1px" boxShadow='base' borderColor="gray.200" borderRadius="12px" padding={4} marginTop={3} marginBottom="120px">
            <Heading as="h2" size="md" marginTop={3}>Où se situe la colocation</Heading>
            <Divider marginY={3}/>
            <MapContainer center={[listing.data.geolocation.lat, listing.data.geolocation.lng]} zoom={13} style={{ height: '480px' }} zoomControl={true} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'"
              />
              <Marker position={[listing.data.geolocation.lat, listing.data.geolocation.lng]} icon={customIcon}>
              </Marker>
            </MapContainer>
          </Box>
      </Box>
            
    );
    
}
