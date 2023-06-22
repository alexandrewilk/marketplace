import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Dots } from 'react-activity';
import 'react-activity/dist/library.css';
import { HiHome } from 'react-icons/hi';
import { Text, Container, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Icon, Box } from '@chakra-ui/react';

export default function MesAnnonces() {
  const [listings, setListings] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

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
      <Box>
        <Button colorScheme='red' maxW='xs' leftIcon={<Icon as={HiHome} />}>
          <RouterLink to='/create-listing'>Mettre une annonce de colocation</RouterLink>
        </Button>
      </Box>
    </Container>
  );
}
