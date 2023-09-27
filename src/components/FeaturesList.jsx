import React from 'react';
import { Grid, VStack, Heading, Text, Button, Icon} from '@chakra-ui/react';
import { FaRocket, FaLightbulb, FaCog, FaHeart, FaStar, FaLeaf } from 'react-icons/fa';
import FeatureCard from './FeatureComponent';

export default function FeaturesList() {
  return (
    <>
    <Heading as="h1" size="xl">Nos Features</Heading>
    <VStack spacing={10} align="center" p={10} maxW={'1200px'} marginX={'auto'}>
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }} gap={10}>
        <FeatureCard icon={FaRocket} title="Rapide" text="Des performances incroyablement rapides et efficaces." />
        <FeatureCard icon={FaLightbulb} title="Intelligent" text="Des solutions intelligentes pour vos besoins." />
        <FeatureCard icon={FaCog} title="Flexible" text="Adaptez-le à vos besoins uniques pour une précision de fou." />
        <FeatureCard icon={FaHeart} title="Aimable" text="Nous aimons nos utilisateurs et ils nous aiment!" />
        <FeatureCard icon={FaStar} title="Premium" text="Des fonctionnalités de qualité premium incluses." />
        <FeatureCard icon={FaLeaf} title="Eco-friendly" text="Conçu pour être respectueux de l'environnement." />
      </Grid>
    </VStack>
    </>
  );
}