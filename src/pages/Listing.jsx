import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { Dots } from 'react-activity';
import { Box, Container, Grid, Image, Heading, useBreakpointValue, Flex} from "@chakra-ui/react";
import SignInImage from '../assets/images/SignIn.jpg';

export default function Listing() {
  const gridTemplateColumnsThree = useBreakpointValue({ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" });
  const gridTemplateRow = useBreakpointValue({ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" });
  const gridTemplateColumnsSecondary = useBreakpointValue({ base: "1fr", md: "2fr 1fr" });
  const gridTemplateColumns = useBreakpointValue({ base: "2fr 1fr", md: "repeat(2, 1fr)" });
  const imageMaxHeight = useBreakpointValue({ base: "300px", md: "auto" });
  const displayImageFour = useBreakpointValue({ base: "none", md: "block" });

    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        async function fetchListing(){
            try{
            const docRef=doc(db, 'Listings', params.listingID)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists){
                setListing(docSnap.data())
            }
            }catch(error){
                alert(error.message)
            }finally{
                setLoading(false)
            }
        }
        fetchListing();
    }, [params.listingID])
    const containerStyle = {
        width: '400px',
        height: '400px'
      };
    function renderContent(){
        if(loading){return <Dots/>}
        if(!listing){return <h1>CETTE ANNONCE NEXISTE PLUS</h1>}
        const center = listing.geolocation
        return(
            <div className='h-1/2 w-1/2'>
            <h1>{listing.adresse}</h1>
            </div>
        )
    }
    return (
      <Box maxW="1200px" marginX="auto" mt={6}>
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
        <Grid templateColumns={gridTemplateColumnsSecondary} gap={6} marginTop={6}>
          <Box w="100%" h="100vh" borderWidth="1px" boxShadow='base' borderColor="gray.200" borderRadius="12px">
            <Heading as='h1' size='xl' noOfLines={1}> Appartement teh les brid</Heading> 
          </Box>
          <Box w="100%" h="300" bg="white" borderWidth="1px" borderColor="gray.200" boxShadow='md' borderRadius="12px" position="sticky" top="0"/>
        </Grid>
        <Box backgroundColor="red" h="100vh">
        </Box>
      </Box>
    );
    
}
