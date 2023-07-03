import React, {useState} from 'react';
import { Text, Box, Container, Grid } from '@chakra-ui/react';
import SettingsCard from '../components/SettingsCard';
import { AiOutlineMessage, AiOutlineUser, AiOutlineHeart, AiOutlineBell, AiOutlineAppstoreAdd, AiOutlineDashboard } from 'react-icons/ai';
import { auth } from '../firebase';

export default function Settings() {

  const [formData, setFormData] = useState({
    name: auth.currentUser ? auth.currentUser.displayName : '',
    email: auth.currentUser ? auth.currentUser.email : ''
  });
  const {name, email} = formData

  return (
    <Box height="calc(100vh - 64px)">
    <Container maxWidth="1200px" mt={70}>
      <Box mb={12}>
      <Text fontSize="4xl" as="b">
        Paramètres
      </Text>
      <Text fontSize="lg">{auth.currentUser ? auth.currentUser.displayName : ''} </Text>
      </Box>
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        gap={6}
      >
    <SettingsCard icon={AiOutlineUser} title="Informations personnelles" text="Fournissez des renseignements personnels et indiquez comment nous pouvons vous joindre." href="/profile"/>
    <SettingsCard icon={AiOutlineHeart} title="Annonces sauvegardées" text="Retrouvez et gérez toutes vos annonces sauvegardées." href="/MesLikes"/>
    <SettingsCard icon={AiOutlineBell} title="Mes alertes" text="Retrouvez et gérez toutes vos alertes au même endroit." href="/MesAlertes"/>
    <SettingsCard icon={AiOutlineAppstoreAdd} title="Mes Annonces" text="Retrouvez,gérez et ajoutez de nouvelles annonces." href="/MesAnnonces"/>
    <SettingsCard icon={AiOutlineMessage} title="Messages" text="Retrouvez ici tous vos messages échangés sur coloc.fr" href="/Messagerie"/>
    <SettingsCard icon={AiOutlineDashboard} title="Outils pour les professionnels" text="Utilisez des outils professionnels si vous gérez plusieurs annonces sur coloc.fr" href="https://coloc.fr/operateur-immobilier/"/>
      </Grid>
    </Container>
    </Box>
  );
}
