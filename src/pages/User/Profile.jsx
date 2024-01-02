import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import {
  Flex, Spacer, Text, Box, Container, Breadcrumb, BreadcrumbItem,
  BreadcrumbLink, Accordion, AccordionItem, AccordionButton,
  AccordionPanel, AccordionIcon, Button, FormControl, FormLabel, Input, Spinner, useMediaQuery
} from '@chakra-ui/react';
import { auth, db } from '../../firebase';

export default function Profile() {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [isLargerThan400] = useMediaQuery("(min-width: 400px)");
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  // Simplifiez l'accès aux données de l'utilisateur sans utiliser formData
  const name = auth.currentUser.displayName;
  const email = auth.currentUser.email;

  const onChange = (e) => {
    e.preventDefault();
    setNewName(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (auth.currentUser.displayName !== newName) {
        await updateProfile(auth.currentUser, { displayName: newName });
        const docRef = doc(db, 'Users', auth.currentUser.uid);
        await updateDoc(docRef, { name: newName });
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
