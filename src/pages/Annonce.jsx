import { Box, Image, Badge, Text, Heading, IconButton, Stack, Divider, Grid } from "@chakra-ui/react";
import { MdStar, MdFavoriteBorder, MdFavorite } from "react-icons/md";
import ContactBouton from "../components/ContactBouton";
import CustomBadge from "../components/CustomBadge";

export default function Annonce() {
  return (
    <Box maxWidth="1280px" margin="auto" marginTop="90px">
    <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]} gap={6}>
      <Image src="https://bit.ly/2k1H1t6" objectFit="cover" borderRadius="md" height="100%" maxHeight="500px" />
      <Box>
        <Grid templateRows="repeat(2, 1fr)" gap={6}>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <Image src="https://bit.ly/2k1H1t6" objectFit="cover" borderRadius="md" height="100%" maxHeight="245px" />
            <Image src="https://bit.ly/2k1H1t6" objectFit="cover" borderRadius="md" height="100%" maxHeight="245px" />
          </Grid>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <Image src="https://bit.ly/2k1H1t6" objectFit="cover" borderRadius="md" height="100%" maxHeight="245px" />
            <Image src="https://bit.ly/2k1H1t6" objectFit="cover" borderRadius="md" height="100%" maxHeight="245px" />
          </Grid>
        </Grid>
      </Box>
    </Grid>
    <Grid templateColumns={["repeat(1, 1fr)", "2fr 1fr"]} gap={6} marginTop={'44px'}>
        <Box>
          <Text fontSize="lg" fontWeight="semibold">Description</Text>
          <Stack direction='row'>
            <CustomBadge text="Ranked addict"/>
            <CustomBadge text="Gros baiseur"/>
            <CustomBadge text="8.6 enjoyeur"/>
            <CustomBadge text="Seloger"/>
          </Stack>
          <Text mt={4}>Maison de ville meublée en Coliving de 250 m² avec espaces communs : Une grande cuisine équipée (frigo américain, four, machine à café, lave-vaisselle, plaques de cuisson et hotte), grand salon avec TV, espace extérieur végétalisé (barbecue, table de ping-pong et rack à vélo), une terrasse à l’étage avec mobilier d’extérieur, un espace détente avec fauteuils et baby-foot, espace buanderie avec 2 machines à laver et un sèche-linge, deux grandes salles de bain ainsi que deux toilettes, wifi haut débit. 

        La maison est entièrement meublée et décorée avec goût, bien insonorisée. Chaque chambre dispose d’un dressing et d’un espace de travail pour votre confort, ainsi que de serrures à code pour votre intimité et sécurité.
        </Text>
        </Box>
        <Box border="1px solid" borderColor="black" borderRadius={'md'} p={5} bg="white" position="sticky" top="20px">
            <Heading as="h2" size="md" mb={2}>Détails</Heading>
            <Text mt={2}>Type : Coliving</Text>
            <Text>Localisation : LYON 3ème</Text>
            <Text>Composition : 9 unités</Text>
            <Text>Superficie totale : 250m²</Text>
            <Text>Frais de dossier : Dès 300€</Text>
            <Text>Aides CAF : Jusqu’à -258€</Text>
            <Divider mt={3} mb={3}/>
            <Heading as="h2" size="md" mb={2}>Prix</Heading>
            <Text mt={2} color="green.500" fontSize="2xl">550€/mois</Text>
            <ContactBouton/>
        </Box>
      </Grid>
  </Box>
  );
}
