import React from 'react';
import { Grid, Box, Heading, Text, VStack, Button, HStack } from '@chakra-ui/react';
import FAQItemConversion from './FAQItemsConversion';

export default function FAQConversion() {
  return (
    <>
    <Heading as="h1" size="xl">Questions fréquentes</Heading>
    <VStack spacing={10} align="center" p={5} maxW={'1200px'} marginX={'auto'}>
      
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }} gap={10}>
        <FAQItemConversion question="Comment s'inscrire ?" answer="Cliquez sur le bouton 'Inscription' et suivez les instructions." />
        <FAQItemConversion question="Comment se connecter ?" answer="Utilisez votre e-mail et votre mot de passe pour vous connecter." />
        <FAQItemConversion question="Comment réinitialiser mon mot de passe ?" answer="Cliquez sur 'Mot de passe oublié' et suivez les instructions." />
        <FAQItemConversion question="Comment changer mon e-mail ?" answer="Allez dans les paramètres de votre compte pour changer votre e-mail." />
        <FAQItemConversion question="Puis-je annuler mon abonnement ?" answer="Oui, vous pouvez annuler votre abonnement à tout moment." />
        <FAQItemConversion question="Comment puis-je obtenir de l'aide ?" answer="Contactez notre support via la page de contact." />
      </Grid>

      <Box backgroundColor={'gray.100'} w={'100%'} borderRadius={6}>
        <HStack spacing={4} p={4} justifyContent={'space-between'}>
          <Box>
          <Heading as={'h3'} size={'md'} mb={2}>Vous avez toujours des questions?</Heading>
          <Text>Vous nous de trouvez pas de réponse à vos questions? Veuillez contacter nos équipes.</Text>
          </Box>
          <Button colorScheme='blue'>Contactez-nous</Button>
        </HStack>
      </Box>
    </VStack>
    </>
  );
}
