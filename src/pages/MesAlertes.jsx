import React from 'react'
import { Text, Box, Container, Grid, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, } from '@chakra-ui/react';


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
    
  </Container>
  )
}
