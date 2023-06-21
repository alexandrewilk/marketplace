import React from 'react';
import { Text, Box, Container, Grid } from '@chakra-ui/react';
import SettingsCard from '../components/SettingsCard';
import { AiOutlineUser } from 'react-icons/ai';

export default function Settings() {
  return (
    <Container maxWidth="1200px" mt={70}>
      <Box mb={12}>
      <Text fontSize="4xl" as="b">
        Paramètres
      </Text>
      <Text fontSize="lg">Paul Mazeau, mazeau.paul@gmail.com</Text>
      </Box>
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        gap={6}
      >
    <SettingsCard icon={AiOutlineUser} title="Informations personnelles" text="Fournissez des renseignements personnels et indiquez comment nous pouvons vous joindre" href="/"/>
    <SettingsCard icon={AiOutlineUser} title="Informations personnelles" text="Fournissez des renseignements personnels et indiquez comment nous pouvons vous joindre" href="/"/>
    <SettingsCard icon={AiOutlineUser} title="Informations personnelles" text="Fournissez des renseignements personnels et indiquez comment nous pouvons vous joindre" href="/"/>
    <SettingsCard icon={AiOutlineUser} title="Informations personnelles" text="Fournissez des renseignements personnels et indiquez comment nous pouvons vous joindre" href="/"/>
    <SettingsCard icon={AiOutlineUser} title="Informations personnelles" text="Fournissez des renseignements personnels et indiquez comment nous pouvons vous joindre" href="/"/>
    <SettingsCard icon={AiOutlineUser} title="Informations personnelles" text="Fournissez des renseignements personnels et indiquez comment nous pouvons vous joindre" href="/"/>
      </Grid>
    </Container>
  );
}
