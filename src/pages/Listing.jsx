import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { Box, Grid, Image, Heading, useBreakpointValue, Divider, Text, Flex, Icon, VStack, Modal, ModalOverlay, ModalContent, ModalBody,  Button, IconButton, useDisclosure, HStack} from "@chakra-ui/react";
import SignInImage from '../assets/images/SignIn.jpg';
import NoPP from '../assets/images/NoPP.webp'
import {AiOutlineShareAlt, AiOutlineHeart} from 'react-icons/ai';
import {HiOutlineMapPin} from 'react-icons/hi2';
import CustomBadge from '../components/CustomBadge';
import SendMessagePopup from '../components/SendMessagePopup';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import { BiImages } from "react-icons/bi";

export default function Listing() {
  const gridTemplateColumnsThree = useBreakpointValue({ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" });
  const gridTemplateRow = useBreakpointValue({ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" });
  const gridTemplateColumnsSecondary = useBreakpointValue({ base: "1fr", md: "2fr 1fr" });
  const gridTemplateColumns = useBreakpointValue({ base: "2fr 1fr", md: "repeat(2, 1fr)" });
  const MainImageMaxHeight = useBreakpointValue({ base: "300px", md: "376px" });
  const OtherImageMaxHeight = useBreakpointValue({ base: "300px", md: "182px" });
  const MainImageMaxWidth = useBreakpointValue({ base: "auto", md: "558px" });
  const OtherImageMaxWidth = useBreakpointValue({ base: "auto", md: "273px" });
  const displayImageFour = useBreakpointValue({ base: "none", md: "block" });

  const images = [SignInImage, SignInImage, SignInImage, SignInImage, NoPP];
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

   
    return (
      <Box maxW="1200px" marginX="auto" mt={6} paddingX="2.5%">
       <Grid templateColumns={gridTemplateColumns} gap={3} >
       <Box w="100%" h="auto" position="relative">
        <Image src={SignInImage} alt="Description de l'image 1" boxSize="100%" maxH={MainImageMaxHeight} maxW={MainImageMaxWidth} objectFit="cover" borderRadius="12px" onClick={onOpen}/>
        <Box position="absolute" bottom="2" right="2" bg="white" px={2} py={1} borderWidth="1px" borderColor="black" borderRadius="6px" onClick={e => {e.stopPropagation(); onOpen();}}>
          <HStack spacing={1}>
            <Icon as={BiImages} boxSize="20px"/>
            <Text fontSize="sm" color="black">Afficher toutes les photos</Text>
          </HStack>
        </Box>
      </Box>
        <Box w="100%" h="auto">
          <Grid templateColumns={gridTemplateColumnsThree} templateRows={gridTemplateRow} gap={3}>
            {images.slice(1).map((image, index) => (
              <Image key={index} src={image} alt={`Description de l'image ${index + 2}`} boxSize="100%" maxH={OtherImageMaxHeight} maxW={OtherImageMaxWidth} objectFit="cover" borderRadius="12px" display={index === 3 ? displayImageFour : "block"} onClick={() => {onOpen(); setSelectedImageIndex(index + 1);}}/>
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
            <CustomBadge text="SeLoger"/>
            <Flex direction="row" justify="space-between">
              <Box onClick={() => console.log('Partager')} cursor="pointer" display="flex" alignItems="center">
                <Icon as={AiOutlineShareAlt} boxSize={6}/>
                <Text ml={1}>Partager</Text> 
              </Box>
              <Box onClick={() => console.log('Enregistrer')} cursor="pointer" display="flex" alignItems="center">
                <Icon as={AiOutlineHeart} boxSize={6} ml={4}/>
                <Text ml={1}>Enregistrer</Text>
              </Box>
            </Flex>

          </Flex>
            <Heading as='h1' size='xl' noOfLines={1}> Appartement teh les brid</Heading>

            <Flex flexDirection="row" alignItems="center">
              <Icon as={HiOutlineMapPin} boxSize={6}/>
              <Heading as="h3" size="md" marginY={3}> 13ème arrondissement de Paris</Heading>
            </Flex>
            
            <Divider/>
            <Text marginY={3}>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
            </Text>
          </Box>
         
          <Box w="100%" h="auto" borderWidth="1px" boxShadow='base' borderColor="gray.200" borderRadius="12px" padding={4}>
            <Heading as="h2" size="md" marginTop={3}>Equipement de la colocation</Heading>
            <Divider marginY={3}/>

            <Grid templateColumns="repeat(2, 1fr)" gap={3} >
              <Box display="flex" alignItems="center">
                <Icon as={CheckCircleIcon} w={6} h={6} />
                <Text ml={2}>Texte pour l'icône 1</Text>
              </Box>
              <Box display="flex" alignItems="center">
                <Icon as={CheckCircleIcon} w={6} h={6} />
                <Text ml={2}>Texte pour l'icône 2</Text>
              </Box>
              <Box display="flex" alignItems="center">
                <Icon as={CheckCircleIcon} w={6} h={6} />
                <Text ml={2}>Texte pour l'icône 3</Text>
              </Box>
              <Box display="flex" alignItems="center">
                <Icon as={CheckCircleIcon} w={6} h={6} />
                <Text ml={2}>Texte pour l'icône 4</Text>
              </Box>
            </Grid>
          </Box>
          
          <Box w="100%" h="auto" borderWidth="1px" boxShadow='base' borderColor="gray.200" borderRadius="12px" padding={4}>
            <Heading as="h2" size="md" marginTop={3}>Règles spéciales</Heading>
            <Divider marginY={3}/>
          </Box>

          <Box w="100%" h="auto" borderWidth="1px" boxShadow='base' borderColor="gray.200" borderRadius="12px" padding={4}>
            <Heading as="h2" size="md" marginTop={3}>Visites 3D</Heading>
            <Divider marginY={3}/>
            <iframe width='100%' height='480' src='https://my.matterport.com/show/?m=MovEKusCHsf' frameborder='0' allowfullscreen allow='xr-spatial-tracking' borderRadius='6px'></iframe>
          </Box>

          </VStack>

          <Box w="100%" h="300" bg="white" borderWidth="1px" borderColor="gray.200" boxShadow='md' borderRadius="12px" position="sticky" top="0" padding="2.5%">
            <Flex flexDirection="column" justifyContent="space-between" height="100%">
              <Box>
                <Flex flexDirection="row" alignItems="end">
                  <Heading as="h3" size="lg">876€</Heading>
                  <Text fontSize='xl'>/mois</Text>
                </Flex>
                <Divider marginY={4}/>

                <Flex flexDir="column" gap={4}>
                  <Flex flexDirection="row" justifyContent="space-between">
                    <Text>Charge</Text>
                    <Text>Charge</Text>
                  </Flex>

                  <Flex flexDirection="row" justifyContent="space-between">
                    <Text>Charge</Text>
                    <Text>Charge</Text>
                  </Flex>

                  <Flex flexDirection="row" justifyContent="space-between">
                    <Text>Charge</Text>
                    <Text>Charge</Text>
                  </Flex>
                </Flex>
              </Box>
              <SendMessagePopup listing={listing}/>
            </Flex>
          </Box>
        </Grid>

        <Box w="100%" h="auto" borderWidth="1px" boxShadow='base' borderColor="gray.200" borderRadius="12px" padding={4} marginTop={3}>
            <Heading as="h2" size="md" marginTop={3}>Où se situe la colocation</Heading>
            <Divider marginY={3}/>
            <Text>LA tu fou la map avec lat et long en props.</Text>
          </Box>
      </Box>
    );
    
}
