import React, {useState} from 'react';
import { Text, Box, Container, Grid, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, } from '@chakra-ui/react';


export default function MesAnnonces() {

  return (
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
      
    </Container>
  );
}
