import React, { useState } from 'react'
import { Text, Box, Container, Flex, Center, Grid, Breadcrumb, BreadcrumbItem, BreadcrumbLink, useMediaQuery,  Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button, Input} from '@chakra-ui/react';
import { useEffect } from 'react';
import { FieldValue, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Dots } from 'react-activity';
import No_Alerte from '../assets/images/No_Alerte.png';

export default function MesAlertes() {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [isLargerThan400] = useMediaQuery("(min-width: 400px)");
  const [alertes, setAlertes ] = useState([])
  const [loading, setLoading] = useState(false)
  const [nom, setNom] = useState('')
  const [logement, setLogement] = useState('')
  const [nbPieces, setNbPieces] = useState('')
  const [prixMax, setPrixMax] = useState('')
  useEffect(()=>{
    async function getAlerts(){
      const data = await getDoc(doc(db, 'Users', auth.currentUser.uid))
      let alertes = []
      if(data.data().alertes){
        data.data().alertes.forEach((a)=>alertes.push(a))
      }
      setAlertes(alertes)
    }
    getAlerts();
  }, [])

  async function handleDelete(alert){
    try {
      setLoading(true)
      let alertesUpdated = alertes.filter(a=>a!==alert)
      await updateDoc(doc(db, 'Users', auth.currentUser.uid), {alertes: alertesUpdated})
      window.location.reload(true);
    } catch (error) {
      alert(error.message)
    }finally{
      setLoading(false)
    }
  }

  async function handleAddAlertes(){
    try {
      setLoading(true);
      let alertesUpdated = [...alertes, {nom: nom, type: logement, nbPieces: nbPieces, prixMax: prixMax}];
      await updateDoc(doc(db, 'Users', auth.currentUser.uid), {alertes: alertesUpdated});
      window.location.reload(true)
    } catch (error) {
      alert(error.message)
    }finally{
      setLoading(false)
    }
  }
  return (
    <Box height="calc(100vh - 64px)">
    <Container maxWidth="1200px" mt={70}>
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href='/Settings'>
          <Box maxWidth={isLargerThan400 ? 'auto' : '100px'} isTruncated={isLargerThan400 ? false : true}>Paramètres</Box>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href='/MesAlertes'>
          <Box maxWidth={isLargerThan400 ? 'auto' : '100px'} isTruncated={isLargerThan400 ? false : true}>Mes alertes</Box>
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
    <Text fontSize={isLargerThan768 ? "4xl" : "2xl"} as="b">Mes alertes</Text>
      {alertes.length > 0 ? (
        <TableContainer mt="20px">
        <Table size='md'>
          <Thead>
            <Tr>
              <Th>Nom</Th>
              <Th>Logement</Th>
              <Th >Nombre de pièces</Th>
              <Th >Prix max.</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {alertes.map((a)=>{return(
              <Tr key={a}>
                <Td>{a.nom}</Td>
                <Td>{a.type}</Td>
                <Td>{a.nbPieces}</Td>
                <Td>{a.prixMax}€</Td>
                <Td>{loading ? <Dots/> : <Button size='xs' colorScheme="red" onClick={(e) => {e.preventDefault();handleDelete(a)}}>Supprimer</Button>}</Td>
              </Tr>
            )})}
            {/*<Tr>
                <Td><Input onChange={(e)=>{e.preventDefault(); setNom(e.target.value)}} placeholder='Nom'/></Td>
                <Td><Input onChange={(e)=>{e.preventDefault(); setLogement(e.target.value)}} placeholder='Type de Logement'/></Td>
                <Td><Input onChange={(e)=>{e.preventDefault(); setNbPieces(e.target.value)}} placeholder='Nombre de Pièces min.'/></Td>
                <Td><Input onChange={(e)=>{e.preventDefault(); setPrixMax(e.target.value)}} placeholder='Loyer max.'/></Td>
                <Td>{loading ? <Dots/> : <Button size='sm' colorScheme="green" onClick={(e)=>{e.preventDefault(); handleAddAlertes()}}>Creer une nouvelle alerte</Button>}</Td>
            </Tr>*/}
          </Tbody>
        </Table>
      </TableContainer>
      ) : (
        <Flex justifyContent="center">
          <Center flexDirection="column" mt="80px">
              <img src={No_Alerte} alt="maison"/>
              <Text fontSize="xl" fontWeight="bold" marginBottom="1rem">Tu n'as aucune alerte paramétrée</Text>
          </Center>
        </Flex>
      )}
  </Container>
  </Box>
  )
}
