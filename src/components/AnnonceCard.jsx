import React from "react";
import { Box, Image, Flex, Text, Spacer } from "@chakra-ui/react";
import CustomBadge from './CustomBadge';
import IconBadge from './IconBadge';
import { FaStar } from "react-icons/fa";

export default function AnnonceCard() {
  return (
    <Box 
      maxW="800px" 
      borderWidth="1px" 
      borderRadius="16px" 
      overflow="hidden" 
      boxShadow="base" 
      height="200px"
      transition="box-shadow 0.2s ease-in-out"
      _hover={{ boxShadow: "lg" }}
      mb={4}
    >
      <Flex direction={["column", "row"]} height="100%">
        <Box flex="1" height="100%">
          <Image src="https://bit.ly/2k1H1t6" alt="Appartement" objectFit="cover" height="100%"/>
        </Box>
        <Box flex="2" p="5" display="flex" flexDirection="column" justifyContent="space-between" height="100%">
          <Box>
            <Flex align="baseline" mb={2}>
              <CustomBadge text="Seloger" />
              <Spacer />
            </Flex>
            <Text fontSize="xl" fontWeight="semibold" lineHeight="short">
              Appartement lyon spacieux
            </Text>
            <Flex align="baseline" mt={2}>
              <IconBadge icon={FaStar} text="5 chambres" marginRight={2} />
              <IconBadge icon={FaStar} text="300m²" marginRight={2} />
              <IconBadge icon={FaStar} text="2 salle de bain" />
            </Flex>
          </Box>
          <Box alignSelf="flex-end" textAlign="right">
            <Text fontSize="xl" color="blue.500" mt={2}>
              550€/mois
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
