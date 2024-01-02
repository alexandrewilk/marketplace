import { Box, Stack, Select, Input, Button } from '@chakra-ui/react';

export default function Filtres() {
  return (
    <Box bg="gray.100" p={4}>
      <Stack
        direction={['column', 'row']}
        spacing={4}
      >
        <Select placeholder="Type de logement">
          <option value="maison">Maison</option>
          <option value="appartement">Appartement</option>
          <option value="studio">Villa</option>
        </Select>

        <Select placeholder="Nombre de pièces">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </Select>

        <Select placeholder="Prix max">
          <option value="500">500€</option>
          <option value="1000">1000€</option>
          <option value="1500">1500€</option>
        </Select>
        
        <Button colorScheme="blue" width={"300px"}>Filtrer</Button>
      </Stack>
    </Box>
  );
}
