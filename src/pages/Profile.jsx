import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import { updateProfile } from 'firebase/auth';
import { doc, getDocs, orderBy, updateDoc, collection, query, where } from 'firebase/firestore';
import { 
  Flex, Spacer, Text, Box, Container, Breadcrumb, BreadcrumbItem, 
  BreadcrumbLink, Accordion, AccordionItem, AccordionButton, 
  AccordionPanel, AccordionIcon,Button, FormControl, FormLabel, Input, Spinner 
} 
from '@chakra-ui/react';
import {auth, db} from '../firebase';

export default function Profile() {
  const [listings, setListings] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const {name, email} = formData;

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

  useEffect(() => {
    getUserListing();
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    auth.signOut();
    navigate('/');
  };

  const onChange = (e) => {
    e.preventDefault();
    setNewName(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if(auth.currentUser.displayName !== newName) {
        await updateProfile(auth.currentUser, {displayName: newName});
        const docRef = doc(db, 'Users', auth.currentUser.uid);
        await updateDoc(docRef, {name: newName});
        window.location.reload(true);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box height="calc(100vh - 64px)">
    <Container maxWidth="1200px" pt={70}>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href='/Settings'>Paramètres</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href='/MesLikes'>Mes informations personnelles</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Text fontSize="4xl" as="b">Mes informations personnelles</Text>


  <Accordion allowToggle mt="32px">
  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box as="span" flex='1' textAlign='left'>
          Nom : {name}
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
    <form onSubmit={onSubmit}>
    <FormLabel>Nouveau nom</FormLabel>
      <Flex alignItems="center">
        <FormControl id="newName" flex="1">
          <Input 
            type="text" 
            value={newName} 
            onChange={(e) => onChange(e)} 
            placeholder="Nouveau nom" 
          />
        </FormControl>
        <Spacer />
        {loading ? <Spinner /> : <Button type="submit" colorScheme="blue">Changer le nom</Button>}
      </Flex>
    </form>
    </AccordionPanel>
  </AccordionItem>

  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box as="span" flex='1' textAlign='left'>
          Adresse Email : {email}
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </AccordionPanel>
  </AccordionItem>
</Accordion>
    </Container>
    </Box>
  )
}
