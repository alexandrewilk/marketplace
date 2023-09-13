import React from "react";
import { Box, Text, Heading, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const Card = ({ title, content, delay = 0 }) => (
  <MotionBox
    borderWidth="1px" 
    borderRadius="lg" 
    overflow="hidden" 
    p={6} mb={6} 
    flexBasis={["100%", "100%", "30%"]}         
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.5, delay: delay }}
  >
    <Heading fontSize="xl">{title}</Heading>
    <Text 
        mt={4}
    >
      {content}
    </Text>
  </MotionBox>
);

export default function HowItWorks() {
  return (
    <Box maxWidth="1400px" margin="auto" borderWidth="1px" borderColor="gray.200" boxShadow="md" borderRadius="12px" p="12" mb="10">
    <Heading mb="4" size='lg'>Comment Coloc.fr fonctionne?</Heading>
    <Flex direction={["column", "column", "row"]} justify="space-between">
      <Card
        title="Etape 1: Trouvez la coloc parfaite"
        content="Recherchez parmi les milliers de colocations proposés sur coloc.fr. Filtrez et triez les résultats selon vos préférences pour trouver exactement ce que vous cherchez."
        delay={0}
      />

      <Card
        title="Etape 2: Contacte le propriétaire"
        content="Une fois que vous avez trouvé la coloc de vos rêve, vous pouvez contacter le propriétaire directement sur le site."
        delay={0.33}
      />

      <Card
        title="Etape 3: C'est partie pour le kiff"
        content="Après avoir posé vos bagages dans votre nouvelle coloc, vous pouvez installer MyColoc pour kiffez à 100% votre vie en coloc"
        delay={0.66}
      />
    </Flex>
    </Box>
  );
}
