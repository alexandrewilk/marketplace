import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Box, Button, FormControl, FormLabel, Input, Link, Stack, Text, useColorModeValue, Flex, Image, Center } from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/react'
import { FcGoogle } from 'react-icons/fc';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;
  const navigate = useNavigate();

  function onChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        navigate('/');
      }
    } catch (error) {
      toast.error('Mauvaise combinaison user.pwd');
    }
  }

  const flexDirection = useBreakpointValue({ base: "column-reverse", md: "row-reverse" })
  const displayValue = useBreakpointValue({ base: "none", md: "flex" })

  return (
    <Flex direction={flexDirection} w="100vw" h="91vh">
      <Box flex={{ base: "1", md: "2"}} display={displayValue} alignItems="center" justifyContent="center" p="20px">
        <Image src={require('../assets/images/SignIn.jpg')} alt="Image description" objectFit="cover" borderRadius="10px" h="100%" />
      </Box>
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p="1rem"
      >
        <Text
          fontSize="2xl"
          fontWeight="bold"
          textAlign="center"
          color={useColorModeValue('gray.700', 'gray.50')}
          mb="2rem"
        >
          Se connecter
        </Text>
        <form onSubmit={onSubmit}>
          <Stack spacing="1rem" mb="1rem" maxW="600px" w="100%">
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                width="400px"
                type="email"
                value={email}
                onChange={onChange}
                placeholder="Entrez votre Email"
                bg="white"
                borderColor={useColorModeValue('gray.300', 'gray.700')}
                borderRadius="lg"
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Mot de passe</FormLabel>
              <Input
                width="400px"
                type="password"
                value={password}
                onChange={onChange}
                placeholder="Entrez votre mot de passe"
                bg="white"
                borderColor={useColorModeValue('gray.300', 'gray.700')}
                borderRadius="lg"
              />
            </FormControl>
            <Button
              width="400px"
              type="submit"
              colorScheme="blue"
              size="lg"
              fontSize="md"
              isLoading={false}
            >
              Se connecter
            </Button>
            <Button
              w={'full'}
              maxW={'md'}
              variant={'outline'}
              leftIcon={<FcGoogle />}>
              <Center>
                <Text>Sign in with Google</Text>
              </Center>
            </Button>
          </Stack>
        </form>
        <Stack spacing={2} textAlign="center">
          <Text fontSize="sm">
            Pas de compte ?{' '}
            <Link as={RouterLink} to="/sign-up" color="blue.500">
              Creer un compte
            </Link>
          </Text>
          <Text fontSize="sm">
            <Link as={RouterLink} to="/forgot-password" color="blue.500">
              Mot de passe oublié ?
            </Link>
          </Text>
        </Stack>
      </Box>

    </Flex>
  );
}
