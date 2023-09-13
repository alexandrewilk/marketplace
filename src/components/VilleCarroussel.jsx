import React from 'react'
import { Box, Heading, Flex } from '@chakra-ui/react';
import RechercheCard from './RechercheCard';
import { motion } from "framer-motion";

const cities = [
    {
      name: 'Paris',
      imageUrl: 'https://coloc.fr/wp-content/uploads/2023/04/Lyon.webp',
      link: '/recherche/Paris'
    },
    {
      name: 'Lyon',
      imageUrl: 'https://coloc.fr/wp-content/uploads/2023/04/Lyon.webp',
      link: '/recherche/Lyon'
    },
    {
      name: 'Toulouse',
      imageUrl: 'https://coloc.fr/wp-content/uploads/2023/04/Lyon.webp',
      link: '/recherche/Lyon'
    },
    {
      name: 'Marseille',
      imageUrl: 'https://coloc.fr/wp-content/uploads/2023/04/Lyon.webp',
      link: '/recherche/Marseille'
    },
    {
      name: 'Bordeaux',
      imageUrl: 'https://coloc.fr/wp-content/uploads/2023/04/Lyon.webp',
      link: '/recherche/Bordeaux'
    },
  ];

  export default function VilleCarroussel() {
    return (
      <Box maxWidth="1400px" margin="auto" w="100%">
          <Heading as='h3' size='lg' marginY={4}>Découvrez nos colocations par ville</Heading>
          <Flex 
              width="100%"  // Ajoutez cette ligne pour que Flex prenne toute la largeur du conteneur.
              flexDirection={{ base: "column", md: "row" }} 
              flexWrap="nowrap" 
              overflowX="auto" 
              justifyContent="space-between"
          >
              {cities.map((city, index) => (
                  <RechercheCard city={city} key={index} />
              ))}
          </Flex>
      </Box>
    )
}

