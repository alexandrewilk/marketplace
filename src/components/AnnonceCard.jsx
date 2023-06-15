import React from "react";
import { Box, Center, Image, Flex, Text } from "@chakra-ui/react";
import AnnonceBadge from './AnnonceBadge';

export default function AnnonceCard() {
  return (
    <Center>
      <Box p="5" maxW="320px" borderWidth="1px">
        <Image borderRadius="md" src="https://bit.ly/2k1H1t6" />
        <Flex align="baseline" mt={2}>
          <AnnonceBadge/>
          <Text
            ml={2}
            textTransform="uppercase"
            fontSize="sm"
            fontWeight="bold"
            color="pink.800"
          >
            Vérifié &bull; Lyon
          </Text>
        </Flex>
        <Text mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">
          Appartement lyon spacieux
        </Text>
        <Text mt={2}>550€/mois</Text>
      </Box>
    </Center>
  );
}
