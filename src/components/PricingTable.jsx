import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { VStack, Heading, Flex, Text, List, ListItem, Button, useBreakpointValue, Box, Checkbox, HStack } from '@chakra-ui/react';
import { AiFillCheckCircle } from "react-icons/ai";

export default function PricingTable() {
    const direction = useBreakpointValue({ base: 'column', md: 'row' });
  return (
    <>
    <Heading as="h1" size="xl">Nos Tarifs</Heading>
    <VStack spacing={10} align="center" p={5}>
      <Flex direction={direction} w="full" wrap="wrap">
        
        <VStack flex="1" p={5} borderWidth={2} borderRadius="md" borderColor={'blue'} boxShadow="md" spacing={5} align="stretch" mb={direction === 'column' ? '5' : '0'} marginX={direction === 'row' ? '20px' : '0'}>
          <Flex direction="column" flex="1">
            <Heading as="h2" size="lg">Basique</Heading>
            <Text fontSize="2xl" fontWeight="bold">Gratuit</Text>
            <List spacing={2} flex="1" mt={4}>
              <HStack spacing={2}>
                 <AiFillCheckCircle color="blue"/>
                 <Text>Feature 1</Text>
              </HStack>
              <HStack spacing={2}>
                 <AiFillCheckCircle color="blue"/>
                 <Text>Feature 2</Text>
              </HStack>
              <HStack spacing={2}>
                 <AiFillCheckCircle color="blue"/>
                 <Text>Feature 3</Text>
              </HStack>
            </List>
          </Flex>
          <Button colorScheme="blue">
            <RouterLink to='/Déposer-une-annonce'>Ajouter une annonce</RouterLink>
          </Button>
        </VStack>
        
        <VStack flex="1" p={5} borderWidth={2} borderRadius="md" borderColor={'blue'} boxShadow="md" spacing={5} align="stretch" mb={direction === 'column' ? '5' : '0'} marginX={direction === 'row' ? '20px' : '0'}>
          <Flex direction="column" flex="1">
            <Heading as="h2" size="lg">Premium</Heading>
            <Text fontSize="2xl" fontWeight="bold">39.99€/mois</Text>
            <List spacing={2} flex="1" mt={4}>
              <HStack spacing={2}>
                 <AiFillCheckCircle color="blue"/>
                 <Text>Feature 1</Text>
              </HStack>
              <HStack spacing={2}>
                 <AiFillCheckCircle color="blue"/>
                 <Text>Feature 2</Text>
              </HStack>
              <HStack spacing={2}>
                 <AiFillCheckCircle color="blue"/>
                 <Text>Feature 3</Text>
              </HStack>
              <HStack spacing={2}>
                 <AiFillCheckCircle color="blue"/>
                 <Text>Feature 4</Text>
              </HStack>
            </List>
          </Flex>
          <Button colorScheme="blue" isDisabled>Bientôt disponible</Button>
        </VStack>
        
        <VStack flex="1" p={5} borderWidth={2} borderRadius="md" borderColor={'blue'} boxShadow="md" spacing={5} align="stretch" marginX={direction === 'row' ? '20px' : '0'}>
          <Flex direction="column" flex="1">
            <Heading as="h2" size="lg">Loyer garantie</Heading>
            <Text fontSize="2xl" fontWeight="bold">Contactez nous</Text>
            <List spacing={2} flex="1" mt={4}>
              <HStack spacing={2}>
                 <AiFillCheckCircle color="blue"/>
                 <Text>Feature 1</Text>
              </HStack>
              <HStack spacing={2}>
                 <AiFillCheckCircle color="blue"/>
                 <Text>Feature 2</Text>
              </HStack>
              <HStack spacing={2}>
                 <AiFillCheckCircle color="blue"/>
                 <Text>Feature 3</Text>
              </HStack>
              <HStack spacing={2}>
                 <AiFillCheckCircle color="blue"/>
                 <Text>Feature 4</Text>
              </HStack>
              <HStack spacing={2}>
                 <AiFillCheckCircle color="blue"/>
                 <Text>Feature 5</Text>
              </HStack>
            </List>
          </Flex>
          <Button colorScheme="blue">Contact</Button>
        </VStack>
        
      </Flex>
    </VStack>
    </>
  )
}
