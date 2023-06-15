import { Box, Link, Stack, Text } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box bg="blue.500" color="white" py={6}>
      <Stack
        direction={['column', 'row']}
        maxW={['90%', '80%']}
        mx="auto"
        justifyContent="space-between"
        alignItems="center"
        spacing={4}
      >
        <Text>&copy; {new Date().getFullYear()} Coloc.fr</Text>
        <Stack direction="row" spacing={4}>
          <Link href="#">À propos</Link>
          <Link href="#">Services</Link>
          <Link href="#">Contactez-nous</Link>
        </Stack>
      </Stack>
    </Box>
  );
}
