import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import { updateProfile } from 'firebase/auth';
import { doc, getDocs, orderBy, updateDoc, collection, query, where } from 'firebase/firestore';
import { 
  Flex, Spacer, Text, Box, Container, Breadcrumb, BreadcrumbItem, 
  BreadcrumbLink, Accordion, AccordionItem, AccordionButton, 
  AccordionPanel, AccordionIcon,Button, FormControl, FormLabel, Input, Spinner, useMediaQuery
} 
from '@chakra-ui/react';
import {auth, db} from '../../firebase';

export default function Profile() {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [isLargerThan400] = useMediaQuery("(min-width: 400px)");
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
          <BreadcrumbLink href='/Settings'>
            <Box maxWidth={isLargerThan400 ? 'auto' : '100px'} isTruncated={isLargerThan400 ? false : true}>Paramètres</Box>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href='/MesLikes'>
            <Box maxWidth={isLargerThan400 ? 'auto' : '100px'} isTruncated={isLargerThan400 ? false : true}>Mes informations personnelles</Box>
          </BreadcrumbLink>
        </BreadcrumbItem> 
      </Breadcrumb>
      <Text fontSize={isLargerThan768 ? "4xl" : "2xl"} as="b">Mes informations personnelles</Text>


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
    </AccordionPanel>
  </AccordionItem>
</Accordion>
    </Container>
    </Box>
  )
}
