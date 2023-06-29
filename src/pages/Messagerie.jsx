import React from 'react';
import { Box, Flex, VStack, Text, Input, Button } from '@chakra-ui/react';

export default function Messaging() {
  return (
    <Flex h="calc(100vh - 64px)" overflow="hidden">
      
      <Box
        w="20%"
        borderRightWidth={1}
        borderRightColor="gray.300"
        overflowY="auto"
      >
        <VStack align="stretch" spacing={4} p={4}>
            <Box bg="gray.100" p={2} borderRadius="md" _hover={{ bg: "blue.500", color: "white" }}>
                Conversation 1
            </Box>
            <Box bg="gray.100" p={2} borderRadius="md" _hover={{ bg: "blue.500", color: "white" }}>
                Conversation 2
            </Box>
            <Box bg="gray.100" p={2} borderRadius="md" _hover={{ bg: "blue.500", color: "white" }}>
                Conversation 3
            </Box>
        </VStack>

      </Box>


      <Flex direction="column" justifyContent="space-between" w="80%" p={4} overflowY="auto">
        <VStack align="stretch" spacing={4} flex="1" overflowY="auto">
          <Text bg="gray.100" p={2} borderRadius="md">Message 1</Text>
          <Text bg="gray.100" p={2} borderRadius="md">Message 2</Text>
          <Text bg="gray.100" p={2} borderRadius="md">Message 3</Text>
        </VStack>

        {/* Zone de saisie de message */}
        <Flex mt={4} align="center">
          <Input placeholder="Écrivez votre message..." />
          <Button ml={2} colorScheme="blue">Envoyer</Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
