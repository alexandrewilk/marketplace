import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Dots } from 'react-activity';
import 'react-activity/dist/library.css';
import { HiHome } from 'react-icons/hi';
import { Text, Container, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Icon, Box } from '@chakra-ui/react';
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
    <Box height="calc(100vh - 64px)">
    <Container maxWidth="1200px" mt={70}>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href='/Settings'>Paramètres</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href='/MesAnnonces'>Mes annonces</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Text fontSize="4xl" as="b">Mes annonces</Text>
      {listings.map((l)=>{return(
        <AnnonceCard key = {l.id} data={l.data}/>
      )})}
      <Box>
        <Button colorScheme='red' maxW='xs' leftIcon={<Icon as={HiHome} />}>
          <RouterLink to='/create-listing'>Mettre une annonce de colocation</RouterLink>
        </Button>
      </Box>
    </Container>
    </Box>
  );
}
