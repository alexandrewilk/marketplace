import React from "react";
import { Box, Text, Heading, Flex } from "@chakra-ui/react";

const Card = ({ title, content }) => (
  <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={6} mb={6} flexBasis={["100%", "100%", "30%"]}>
    <Heading fontSize="xl">{title}</Heading>
    <Text mt={4}>{content}</Text>
  </Box>
);

export default function HowItWorks() {
  return (
    <Box maxWidth="1400px" margin="auto" backgroundColor="blue.100" borderRadius="12px" p="12" mb="10">
    <Heading mb="4" size='lg'>Comment Coloc.fr fonctionne?</Heading>
    <Flex direction={["column", "column", "row"]} justify="space-between">
      <Card
        title="Etape 1: Trouve la coloc de vos rêves"
        content="Recherchez parmi les milliers de produits proposés par nos vendeurs. Filtrez et triez les résultats selon vos préférences pour trouver exactement ce que vous cherchez."
      />

      <Card
        title="Etape 2: Contacte le propriétaire"
        content="Une fois que vous avez trouvé ce que vous cherchez, vous pouvez l'ajouter à votre panier et procéder au paiement. Vous pouvez choisir parmi plusieurs options de paiement sécurisées."
      />

      <Card
        title="Etape 3: Installe MyColoc et kiffez 100"
        content="Après avoir fait un achat, vous pouvez suivre le statut de votre commande à tout moment. Vous serez également informé lorsque votre commande sera expédiée et livrée."
      />
    </Flex>
    </Box>
  );
}
