import React from 'react'
import { Box, Heading, Grid } from '@chakra-ui/react';
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
    {
      name: 'Rennes',
      imageUrl: 'https://coloc.fr/wp-content/uploads/2023/04/Lyon.webp',
      link: '/recherche/Paris'
    },
    {
      name: 'Montpellier',
      imageUrl: 'https://coloc.fr/wp-content/uploads/2023/04/Lyon.webp',
      link: '/recherche/Lyon'
    },
    {
      name: 'Nantes',
      imageUrl: 'https://coloc.fr/wp-content/uploads/2023/04/Lyon.webp',
      link: '/recherche/Lyon'
    },
    {
      name: 'Grenoble',
      imageUrl: 'https://coloc.fr/wp-content/uploads/2023/04/Lyon.webp',
      link: '/recherche/Marseille'
    },
    {
      name: 'Angers',
      imageUrl: 'https://coloc.fr/wp-content/uploads/2023/04/Lyon.webp',
      link: '/recherche/Bordeaux'
    },
  ];

  export default function VilleCarroussel() {
    return (
      <Box backgroundColor={"#0049AC"} padding={"2.5%"}>
          <Heading as='h3' size='xl' marginY={4} color={"#F5F2ED"}>Découvrez nos colocations par ville</Heading>
          <Grid
            templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(5, 1fr)" }}
            gap={4}
          >
            {cities.map((city, index) => (
               <motion.div
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 * index, duration: 1 }}
               >
              <RechercheCard city={city} key={index} />
              </motion.div>
            ))}
          </Grid>
      </Box>
    )
}

