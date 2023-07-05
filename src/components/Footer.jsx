import React from 'react';
import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  VisuallyHidden,
  chakra,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';

const ListHeader = (props) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {props.children}
    </Text>
  );
};

const SocialButton = (props) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={props.href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}>
      <VisuallyHidden>{props.label}</VisuallyHidden>
      {props.children}
    </chakra.button>
  );
};

export default function LargeWithAppLinksAndSocial() {
  return (
    <Box
      marginTop="auto"
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}>
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align={'flex-start'}>
            <ListHeader>Coloc.fr</ListHeader>
            <Link href={'#'}>A propos</Link>
            <Link href={'#'}>Blog</Link>
            <Link href={'#'}>Nous contacter</Link>
          </Stack>

          <Stack align={'flex-start'}>
            <ListHeader>Propriètaire</ListHeader>
            <Link href={'#'}>Nos guideslines</Link>
            <Link href={'#'}>Modération</Link>
          </Stack>

          <Stack align={'flex-start'}>
            <ListHeader>Légal</ListHeader>
            <Link href={'#'}>CGU</Link>
            <Link href={'#'}>Confidentalité</Link>
            <Link href={'#'}>Mentions légales</Link>
          </Stack>

          <Stack align={'flex-start'}>
            <ListHeader>Installe l'app</ListHeader>
 
          </Stack>
        </SimpleGrid>
      </Container>

      <Box
        borderTopWidth={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.700')}>
        <Container
          as={Stack}
          maxW={'6xl'}
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ md: 'space-between' }}
          align={{ md: 'center' }}>
         <Text>© {new Date().getFullYear()} Coloc.fr. Tous droits réservés</Text>
          <Stack direction={'row'} spacing={6}>
            <SocialButton label={'Twitter'} href={'#'}>
              <FaTwitter />
            </SocialButton>
            <SocialButton label={'YouTube'} href={'#'}>
              <FaYoutube />
            </SocialButton>
            <SocialButton label={'Instagram'} href={'#'}>
              <FaInstagram />
            </SocialButton>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
