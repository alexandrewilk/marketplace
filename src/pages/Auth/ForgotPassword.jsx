import React, { useState } from 'react';
import { VStack, Heading, FormControl, Input, Button, Text, Box, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Regarde tes mails !');
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <VStack spacing={4} align="center" p={6}>
      <Heading as="h1" size="lg">Récupérer son mot de passe</Heading>
      <Box w="100%" maxW="md">
        <form onSubmit={onSubmit}>
          <FormControl id="email" isRequired>
            <Input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="Email" />
          </FormControl>
          <Button colorScheme="blue" mt={4} type="submit">Envoyer mail</Button>
        </form>
        <VStack spacing={2} align="start" mt={4}>
          <Text>
            <Link as={RouterLink} to="/sign-in" color="blue.500">Se Connecter</Link>
          </Text>
          <Text>
            Pas de compte ? <Link as={RouterLink} to="/sign-up" color="blue.500">S'inscrire</Link>
          </Text>
        </VStack>
      </Box>
    </VStack>
  );
}
