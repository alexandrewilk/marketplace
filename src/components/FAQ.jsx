import React from 'react';
import { Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Heading, Container,  Text } from '@chakra-ui/react';

export default function FAQ() {
    return (
        <Box maxWidth="1400px" padding="12" bg="blue.100" width="100%" borderRadius="12">
          <Heading size='lg' mb="4">Foire aux questions</Heading>
          <Accordion allowToggle>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Comment utiliser cette application ?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                Pour utiliser cette application, vous devez ...
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Quelles sont les fonctionnalités disponibles ?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                Les fonctionnalités disponibles sont ...
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
    );
}
