import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { Box, Button, Flex, Image, Input, Link, Spinner, Stack, Text, useBreakpointValue } from '@chakra-ui/react';

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
      <Box flex="1" display="flex" flexDirection="column" alignItems="center" justifyContent="center" p="1rem">
        <Text fontSize="2rem" textAlign="center" color="#333333" mb="2rem">S'inscrire</Text>
        <form onSubmit={onSubmit}>
          <Stack spacing="1rem" mb="1rem" maxW="400px" w="100%">
            <Input type="text" id="name" value={name} onChange={onChange} placeholder="Nom" bg="white" borderColor="#cccccc" borderRadius="4px" p="1rem" />
            <Input type="email" id="email" value={email} onChange={onChange} placeholder="Email" bg="white" borderColor="#cccccc" borderRadius="4px" p="1rem" />
            <Input type="password" id="password" value={password} onChange={onChange} placeholder="Mot de passe" bg="white" borderColor="#cccccc" borderRadius="4px" p="1rem" />
            {loading ? <Spinner /> : <Button type="submit" colorScheme="blue" borderRadius="4px" p="1rem" fontSize="1rem">S'inscrire</Button>}
          </Stack>
        </form>
        <Text textAlign="center">Déjà membre ? <Link as={RouterLink} to="/sign-in" color="blue.500">Se Connecter</Link></Text>
      </Box>
    </Flex>
  );
}
