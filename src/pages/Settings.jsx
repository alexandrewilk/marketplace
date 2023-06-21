import React, {useState} from 'react';
import { Text, Box, Container, Grid } from '@chakra-ui/react';
import SettingsCard from '../components/SettingsCard';
import { AiOutlineUser } from 'react-icons/ai';
import { auth } from '../firebase';

export default function Settings() {

  const [formData, setFormData] = useState({
    name: auth.currentUser ? auth.currentUser.displayName : '',
    email: auth.currentUser ? auth.currentUser.email : ''
  });
  const {name, email} = formData

  return (
    <Container maxWidth="1200px" mt={70}>
      <Box mb={12}>
      <Text fontSize="4xl" as="b">
        Paramètres
      </Text>
      <Text fontSize="lg">{auth.currentUser ? auth.currentUser.displayName : 'tg'}, {auth.currentUser ? auth.currentUser.email : 'tg'}</Text>
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
