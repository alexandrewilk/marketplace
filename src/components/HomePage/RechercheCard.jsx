import { Box, Image, Text, LinkBox, LinkOverlay, Flex } from '@chakra-ui/react';

const RechercheCard = ({ city }) => (
  <LinkBox
    maxWidth={{ base: "100%", sm: "260px" }} // Rendre les cartes plus responsives
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    css={{ ':not(:last-child)': { marginRight: 12 } }} 
    boxShadow="md"
    _hover={{ boxShadow: "lg" }}
    backgroundColor={"#F5F2ED"}
  >
    <LinkOverlay href={city.link}>
      <Flex direction={'column'} h="100%">
        <Image src={city.imageUrl} alt={city.name} w="95%" h="95%" marginX="2.5%" mt="2.5%" borderRadius="md" />
        <Box alignItems="baseline" marginY="5%">
          <Text fontWeight="semibold" as="h4" fontSize="lg" lineHeight="tight" textAlign="center" isTruncated>
            {city.name}
          </Text>
        </Box>

      </Flex>
    </LinkOverlay>
  </LinkBox>
);

export default RechercheCard;
