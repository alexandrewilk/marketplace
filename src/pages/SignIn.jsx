import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Box, Button, Flex, Image, Input, Link, Stack, Text, useBreakpointValue } from '@chakra-ui/react';

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
      <Box flex="1" display="flex" flexDirection="column" alignItems="center" justifyContent="center" p="1rem">
        <Text fontSize="2rem" textAlign="center" color="#333333" mb="2rem">Se connecter</Text>
        <form onSubmit={onSubmit}>
          <Stack spacing="1rem" mb="1rem" maxW="400px" w="100%">
            <Input type="email" id="email" value={email} onChange={onChange} placeholder="Email" bg="white" borderColor="#cccccc" borderRadius="4px" p="1rem" />
            <Input type="password" id="password" value={password} onChange={onChange} placeholder="Mot de passe" bg="white" borderColor="#cccccc" borderRadius="4px" p="1rem" />
            <Button type="submit" colorScheme="blue" borderRadius="4px" p="1rem" fontSize="1rem">Se connecter</Button>
          </Stack>
        </form>
        <Stack textAlign="center">
          <Text>Pas de compte ? <Link as={RouterLink} to="/sign-up" color="blue.500">Creer un compte</Link></Text>
          <Text><Link as={RouterLink} to="/forgot-password" color="blue.500">Mot de passe oublié ? </Link></Text>
        </Stack>
      </Box>
    </Flex>
  );
}
