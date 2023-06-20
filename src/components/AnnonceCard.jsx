import React from "react";
import { Box, Image, Flex, Text, Spacer, useMediaQuery } from "@chakra-ui/react";
import CustomBadge from './CustomBadge';
import IconBadge from './IconBadge';
import { FaStar } from "react-icons/fa";

export default function AnnonceCard() {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  return (
    <Box 
      maxW={["80%", "95%"]}
      marginLeft={["10%", "5%"]}
      marginRight={["10%", "5%"]}  
      borderWidth="1px"
      backgroundColor={"white"} 
      borderRadius="16px" 
      overflow="hidden" 
      boxShadow="base" 
      height={["auto", "200px"]} 
      transition="box-shadow 0.2s ease-in-out"
      _hover={isLargerThan768 ? { boxShadow: "lg" } : {}}
      mb={4}
    >
      <Flex direction={["column", "row"]} height="100%">
        <Box width={["100%", "35%"]} height={["200px", "100%"]}>
          <Image src="https://bit.ly/2k1H1t6" alt="Appartement" objectFit="cover" width="100%" height="100%"/>
        </Box>
        <Box flex="2" p={["2", "5"]} display="flex" flexDirection="column" justifyContent="space-between" height="100%">
          <Box>
            <Flex align="baseline" mb={2}>
              <CustomBadge text="Seloger" />
              <Spacer />
            </Flex>
            <Text fontSize={["md", "xl"]} fontWeight="semibold" lineHeight="short">
              Appartement lyon spacieux
            </Text>
            <Box overflowX={["auto", "visible"]}>
              <Flex align="baseline" mt={2}>
                <IconBadge icon={FaStar} text="5 chambres" marginRight={2} />
                <IconBadge icon={FaStar} text="300m²" marginRight={2} />
                <IconBadge icon={FaStar} text="2 salle de bain" />
              </Flex>
            </Box>
          </Box>
          <Box alignSelf="flex-end" textAlign="right">
            <Text fontSize={["md", "xl"]} color="blue.500" mt={2}>
              550€/mois
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
