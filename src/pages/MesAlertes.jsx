import React from 'react'
import { Text, Box, Container, Grid, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator,  Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button} from '@chakra-ui/react';


export default function MesAlertes() {
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
      <Tr>
        <Td>Alerte 1</Td>
        <Td>Apartement</Td>
        <Td >4</Td>
        <Td >750€</Td>
        <Td>
            <Button size='xs' colorScheme="red" onClick={() => console.log('prout')}>Supprimer</Button>
        </Td>
      </Tr>
      <Tr>
      <Td>Alerte 2</Td>
        <Td>Maison</Td>
        <Td >10</Td>
        <Td >900€</Td>
        <Td><Button size='xs' colorScheme="red" onClick={() => console.log('prout')}>Supprimer</Button></Td>
      </Tr>
      <Tr>
      <Td>Alerte 3</Td>
        <Td>Villa</Td>
        <Td >14</Td>
        <Td >450€</Td>
        <Td><Button size='xs' colorScheme="red" onClick={() => console.log('prout')}>Supprimer</Button></Td>
      </Tr>
    </Tbody>
  </Table>
</TableContainer>
  </Container>
  )
}
