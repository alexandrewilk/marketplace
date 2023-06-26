import { Box, Image, Flex, Text, IconButton } from "@chakra-ui/react";
import CustomBadge from './CustomBadge';
import IconBadge from './IconBadge';
import { FaHouseUser, FaRegHeart, FaBed, FaBath } from "react-icons/fa";

export default function AnnonceCard({ data }) {
  const { imgUrls, type, loyer, nbPieces } = data;
  const badgeProperties = [
    { icon: FaBed, text: "5 chambres" },
    { icon: FaHouseUser, text: "300m²" },
    { icon: FaBath, text: "2 salle de bain" }
  ];

  return (
    <Box
      borderWidth="1px"
      bg="white"
      borderRadius="16px"
      overflow="hidden"
      boxShadow="base"
      height="200px"
      transition="box-shadow 0.2s"
      _hover={{ boxShadow: "md" }}
      mb={4}
    >
      <Flex h="100%">
        <Box w="35%">
          <Image src={imgUrls ? imgUrls[0] : "https://bit.ly/2k1H1t6"} alt="Appartement" objectFit="cover" w="100%" h="100%" />
        </Box>
        <Flex width="65%" flexDirection="column" justifyContent="space-between" padding={4} h="100%">
          <Flex justifyContent="flex-end">
            <IconButton icon={<FaRegHeart />} isRound />
          </Flex>
          <Flex flexDirection="column" justifyContent="space-between" h="100%" spacing={2}>
            <Text fontSize="xl" fontWeight="semibold">
              {type}, loyer de {loyer}€, {nbPieces} pièces
            </Text>
            <Flex>
              {badgeProperties.map((badge, index) => (
                <IconBadge key={index} icon={badge.icon} text={badge.text} marginRight="4px" />
              ))}
            </Flex>
            <Flex justifyContent="space-between" alignItems="flex-end">
              <CustomBadge text="SeLoger" />
              <Text fontSize="xl" color="blue.500">
                {loyer}€/mois
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
