import React from 'react';
import { Box, Flex, Icon, Text } from '@chakra-ui/react';

export default function SettingsCard({ icon: IconComponent, title, text }) {
  return (
    <Box
      bg="white"
      p={4}
      borderRadius="md"
      border='1px' 
      borderColor='gray.200'
      boxShadow="sm"
      _hover={{ boxShadow: 'lg' }}
      transition="all 0.2s"
    >
        <Icon as={IconComponent} w={8} h={8} mr={2} />
      <Flex alignItems="center">
        
        <Text fontSize="lg" fontWeight="bold" mt={4}>
          {title}
        </Text>
      </Flex>
      <Text color="gray.600">
        {text}
      </Text>
    </Box>
  );
}
