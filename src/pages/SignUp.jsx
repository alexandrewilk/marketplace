import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Box, Text, Stack, Input, Button, FormControl, FormLabel, Link, useColorModeValue, Flex, Image, Spinner, Center } from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/react'
import { FcGoogle } from 'react-icons/fc';

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { name, email, password } = formData;

  function onChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      updateProfile(auth.currentUser, { displayName: name });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, 'Users', userCredential.user.uid), formDataCopy);
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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
    S'inscrire
  </Text>
  <form onSubmit={onSubmit}>
    <Stack spacing="1rem" mb="1rem" maxW="600px" w="100%">
      <FormControl id="name">
        <FormLabel>Nom</FormLabel>
        <Input
           width={{ base: '100%', md: '400px' }}
          type="text"
          value={name}
          onChange={onChange}
          placeholder="Entrez votre nom"
          bg="white"
          borderColor={useColorModeValue('gray.300', 'gray.700')}
          borderRadius="lg"
        />
      </FormControl>
      <FormControl id="email">
        <FormLabel>Email</FormLabel>
        <Input
           width={{ base: '100%', md: '400px' }}
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
           width={{ base: '100%', md: '400px' }}
          type="password"
          value={password}
          onChange={onChange}
          placeholder="Entrez votre mot de passe"
          bg="white"
          borderColor={useColorModeValue('gray.300', 'gray.700')}
          borderRadius="lg"
        />
      </FormControl>
      {loading ? (
        <Spinner />
      ) : (
        <Button
           width={{ base: '100%', md: '400px' }}
          type="submit"
          colorScheme="blue"
          size="lg"
          fontSize="md"
        >
          S'inscrire
        </Button>
      )}
      <Button
         width={{ base: '100%', md: '400px' }}
        maxW={'md'}
        variant={'outline'}
        leftIcon={<FcGoogle />}>
        <Center>
            <Text>S'inscrire avec Google</Text>
        </Center>
      </Button>
    </Stack>
  </form>
  <Text fontSize="sm" textAlign="center">
    Déjà membre ?{' '}
    <Link as={RouterLink} to="/sign-in" color="blue.500">
      Se connecter
    </Link>
  </Text>
</Box>
    </Flex>
  );
}
