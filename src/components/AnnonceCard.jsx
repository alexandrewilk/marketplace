import React from "react";
import { Box, Image, Flex, Text, Spacer, useMediaQuery } from "@chakra-ui/react";
import CustomBadge from './CustomBadge';
import IconBadge from './IconBadge';
import { FaStar } from "react-icons/fa";

export default function AnnonceCard({data}) {
  const { imgUrls, type, loyer, nbPieces } = data;
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const badgeProperties = [
    { icon: FaStar, text: "5 chambres", marginRight: 2 },
    { icon: FaStar, text: "300m²", marginRight: 2 },
    { icon: FaStar, text: "2 salle de bain" }
  ];
  
  return (
    <Box 
      borderWidth="1px"
      bg="white"
      borderRadius="16px"
      overflow="hidden"
      boxShadow="base"
      height={["auto", "200px"]}
      transition="box-shadow 0.2s"
      _hover={isLargerThan768 ? { boxShadow: "md" } : {}}
      mb={4}
    >
      <Flex direction={["column", "row"]} h="100%">
        <Box w={["100%", "35%"]} h={["200px", "100%"]}>
          <Image src={imgUrls ? imgUrls[0] : "https://bit.ly/2k1H1t6"} alt="Appartement" objectFit="contain" w="100%" h="100%"/>
        </Box>
        <Box flex="2" p={["2", "5"]} d="flex" flexDirection="column" justifyContent="space-between" h="100%">
          <Box>
            <Flex align="baseline" mb={2}>
              <CustomBadge text="Seloger" />
              <Spacer />
            </Flex>
            <Text fontSize={["md", "xl"]} fontWeight="semibold" lineHeight="short">
              {type} , loyer de {loyer}€ , {nbPieces} pièces
            </Text>
            <Box overflowX={["auto", "visible"]}>
              <Flex align="baseline" mt={2}>
                {badgeProperties.map((badge, index) => (
                  <IconBadge key={index} icon={badge.icon} text={badge.text} mr={badge.marginRight} />
                ))}
              </Flex>
            </Box>
          </Box>
          <Box alignSelf="flex-end" textAlign="right">
            <Text fontSize={["md", "xl"]} color="blue.500" mt={2}>
              {loyer}€/mois
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
