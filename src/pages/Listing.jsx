import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { Dots } from 'react-activity';
import { Box, Grid, Image, Heading, useBreakpointValue, Divider, Text, Button, Flex, Icon, VStack} from "@chakra-ui/react";
import SignInImage from '../assets/images/SignIn.jpg';
import {AiOutlineShareAlt, AiOutlineHeart, AiFillHeart} from 'react-icons/ai';
import {HiOutlineMapPin} from 'react-icons/hi2';
import CustomBadge from '../components/CustomBadge';
import SendMessagePopup from '../components/SendMessagePopup';
import {useAuthStatus} from '../hooks/useAuthStatus'

export default function Listing() {
  const gridTemplateColumnsThree = useBreakpointValue({ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" });
  const gridTemplateRow = useBreakpointValue({ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" });
  const gridTemplateColumnsSecondary = useBreakpointValue({ base: "1fr", md: "2fr 1fr" });
  const gridTemplateColumns = useBreakpointValue({ base: "2fr 1fr", md: "repeat(2, 1fr)" });
  const imageMaxHeight = useBreakpointValue({ base: "300px", md: "auto" });
  const displayImageFour = useBreakpointValue({ base: "none", md: "block" });
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
    const containerStyle = {
        width: '400px',
        height: '400px'
      };
   
    return (
      <Box maxW="1200px" marginX="auto" mt={6} paddingX="2.5%">
        <Grid templateColumns={gridTemplateColumns} gap={3} >
          <Box w="100%" h="auto">
            <Image src={SignInImage} alt="Description de l'image 1" boxSize="100%" maxH={imageMaxHeight} objectFit="cover" borderRadius="12px"/> 
          </Box>
          <Box w="100%" h="auto">
            <Grid templateColumns={gridTemplateColumnsThree} templateRows={gridTemplateRow} gap={3}>
              <Image src={SignInImage} alt="Description de l'image 2" boxSize="100%" maxH={imageMaxHeight} objectFit="cover" borderRadius="12px"/>
              <Image src={SignInImage} alt="Description de l'image 3" boxSize="100%" maxH={imageMaxHeight} objectFit="cover" borderRadius="12px"/>
              <Image src={SignInImage} alt="Description de l'image 4" boxSize="100%" maxH={imageMaxHeight} objectFit="cover" borderRadius="12px"/>
              <Image src={SignInImage} alt="Description de l'image 5" boxSize="100%" maxH={imageMaxHeight} objectFit="cover" borderRadius="12px" display={displayImageFour}/>
            </Grid>
          </Box>
        </Grid>

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
            <Heading as="h2" size="md" marginY={3}>Visites 3D</Heading>
            <Divider/>
          </Box>
          <Box w="100%" h="auto" borderWidth="1px" boxShadow='base' borderColor="gray.200" borderRadius="12px" padding={4}>
            <Heading as="h2" size="md" marginY={3}>Equipement de la colocation</Heading>
            <Divider/>
          </Box>
          <Box w="100%" h="auto" borderWidth="1px" boxShadow='base' borderColor="gray.200" borderRadius="12px" padding={4}>
            <Heading as="h2" size="md" marginY={3}>Règles spéciales</Heading>
            <Divider/>
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
              </Box>
              <SendMessagePopup listing={listing}/>
            </Flex>
          </Box>

          
        </Grid>
        <Box backgroundColor="red" h="100vh"/>
      </Box>
    );
    
}
