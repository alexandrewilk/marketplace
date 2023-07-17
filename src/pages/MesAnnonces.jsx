import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Dots } from 'react-activity';
import 'react-activity/dist/library.css';
import { MdAdd } from 'react-icons/md';
import { Text, Container, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Icon, Box, Flex } from '@chakra-ui/react';
import { query, getDocs, where, orderBy, collection } from 'firebase/firestore';
import { auth, db } from '../firebase';
import AnnonceCard from '../components/AnnonceCardPageMesLikes'

export default function MesAnnonces() {
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
            <Box maxWidth={'100px'} isTruncated>Paramètres</Box>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href='/MesAnnonces'>
            <Box maxWidth={'100px'} isTruncated>Mes annonces</Box>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="flex-end">
        <Text fontSize="4xl" as="b">Mes annonces</Text>
        <Button colorScheme='blue' size='sm' leftIcon={<Icon as={MdAdd} />}>
          <RouterLink to='/create-listing'>Ajouter une annonce</RouterLink>
        </Button>
      </Flex>
      
      {listings.map((l)=>{return(
        <AnnonceCard key = {l.id} data={l.data} id={l.id}/>
      )})}
    </Container>
    
  );
}
