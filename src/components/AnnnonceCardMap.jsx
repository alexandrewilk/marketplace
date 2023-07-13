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
      <Flex direction="column">
        <Box position="relative" w="100%" onClick={(e) => { e.preventDefault(); navigate(`/listings/${id}`) }}>
          <Image src={imgUrls ? imgUrls[0] : "https://bit.ly/2k1t6"} alt="Appartement" objectFit="cover" borderTopRadius="8px" width="100%" />
        </Box>

        <Flex direction="column" gap={2} onClick={(e) => { e.preventDefault(); navigate(`/listings/${id}`) }} padding={2}>
          <CustomBadge text="SeLoger" />
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
  );
  
};

export default AnnonceCardMap;