import { Box, Image, Flex, Text } from "@chakra-ui/react";
import CustomBadge from './CustomBadge';
import IconBadge from './IconBadge';
import { FaHouseUser, FaBed } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const AnnonceCardMap = ({ data, id}) => {
  const { imgUrls, type, loyer, nbPieces } = data;
  const navigate = useNavigate();
  const badgeProperties = [
    { icon: FaBed, text: "5 chambres" },
    { icon: FaHouseUser, text: "300m²" },
  ];

  return (
    <Box
      maxW="240px"
      minH="280px"
    >
      <Flex direction={{ base: "column", md: "column" }} h="100%">
        <Box position="relative" w="100%" onClick={(e)=>{e.preventDefault();navigate(`/listings/${id}`)}}>
          <Image src={imgUrls ? imgUrls[0] : "https://bit.ly/2k1t6"} alt="Appartement" objectFit="cover"  borderRadius="8px"/>
        </Box>

        <Flex direction="column" h="100%">
          <Flex flexDirection="column" justifyContent="space-around" h="100%" onClick={(e)=>{e.preventDefault();navigate(`/listings/${id}`)}}>
            <CustomBadge text="SeLoger"/>
            <Text fontSize="lg" color="#172ACE" as='b'>
              {loyer}€
            </Text>
            <Text fontSize="md" fontWeight="semibold" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
              {type}, loyer de {loyer}€, {nbPieces} pièces
            </Text>
            <Flex>
              {badgeProperties.map((badge, index) => (
                <IconBadge key={index} icon={badge.icon} text={badge.text} marginRight="4px" />
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
  
};

export default AnnonceCardMap;