import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Dots } from 'react-activity';
import 'react-activity/dist/library.css';
import { MdAdd } from 'react-icons/md';
import { Text, Container, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Icon, Box, Flex, Center, useMediaQuery } from '@chakra-ui/react';
import { query, getDocs, where, orderBy, collection } from 'firebase/firestore';
import { auth, db } from '../firebase';
import AnnonceCard from '../components/AnnonceCardPageMesLikes'
import No_Ville from '../assets/images/No_Ville.png';


export default function MesAnnonces() {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [isLargerThan400] = useMediaQuery("(min-width: 400px)");
  const [listings, setListings] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const getUserListing = async () => {
    try {
      setLoadingList(true);
      const q = query(collection(db, 'Listings'), where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'));
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data()
        });
      });
      setListings(listings);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoadingList(false);
    }
  }
  useEffect(()=>{getUserListing()}, [])

  return (
    
    <Container maxWidth="1200px" mt={70} mb={70} h="calc(100vh - 64px)">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href='/Settings'>
            <Box maxWidth={isLargerThan400 ? 'auto' : '100px'} isTruncated={isLargerThan400 ? false : true}>Paramètres</Box>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href='/MesAnnonces'>
            <Box maxWidth={isLargerThan400 ? 'auto' : '100px'} isTruncated={isLargerThan400 ? false : true}>Mes annonces</Box>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Flex flexDirection={isLargerThan768 ? "row" : "column"} justifyContent="space-between" alignItems={isLargerThan768 ? "flex-end" : "flex-start"}>
        <Text fontSize={isLargerThan768 ? "4xl" : "2xl"} as="b">Mes annonces</Text>
        <Button colorScheme='blue' size='sm' leftIcon={<Icon as={MdAdd} />}>
          <RouterLink to='/Déposer-une-annonce'>Ajouter une annonce</RouterLink>
        </Button>
      </Flex>
      
      {loadingList 
        ? <Dots/> 
        : listings.length > 0 
          ? listings.map((l) => <AnnonceCard key={l.id} data={l.data} id={l.id}/>) 
          : 
          <Flex justifyContent="center">
          <Center flexDirection="column" mt="80px">
              <img src={No_Ville} alt="maison"/>
              <Text fontSize="xl" fontWeight="bold" marginBottom="1rem">Tu n'as aucune annonce publiées</Text>
          </Center>
        </Flex>
      }
    </Container>
    
  );
}
