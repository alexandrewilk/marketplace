import React, { useState } from 'react'
import { Text, Box, Container, Grid, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator,  Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button, Input} from '@chakra-ui/react';
import { useEffect } from 'react';
import { FieldValue, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Dots } from 'react-activity';

export default function MesAlertes() {
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
    <Container maxWidth="1200px" mt={70}>
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href='/Settings'>Paramètres</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href='/MesAlertes'>Mes alertes</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
    <Text fontSize="4xl" as="b">Mes alertes</Text>

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
      <Tr>
          <Td><Input onChange={(e)=>{e.preventDefault(); setNom(e.target.value)}} placeholder='Nom'/></Td>
          <Td><Input onChange={(e)=>{e.preventDefault(); setLogement(e.target.value)}} placeholder='Type de Logement'/></Td>
          <Td><Input onChange={(e)=>{e.preventDefault(); setNbPieces(e.target.value)}} placeholder='Nombre de Pièces min.'/></Td>
          <Td><Input onChange={(e)=>{e.preventDefault(); setPrixMax(e.target.value)}} placeholder='Loyer max.'/></Td>
          <Td>{loading ? <Dots/> : <Button size='xs' colorScheme="green" onClick={(e)=>{e.preventDefault(); handleAddAlertes()}}>Creer une nouvelle alerte</Button>}</Td>
        </Tr>
    </Tbody>
  </Table>
</TableContainer>
  </Container>
  )
}
