import React from 'react';
import { Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Heading, Container,  Text, Center } from '@chakra-ui/react';

export default function FAQ() {
    return (
        <Box maxWidth="1200px" width="100%">
        <Heading size='xl' mb="10" >Questions fréquentes</Heading>
        <Box  borderWidth="1px" borderColor="gray.200" boxShadow="md"  borderRadius="12">
          <Accordion allowToggle>
            <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left" p={4}>
                    Coloc.fr c'est quoi ?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              <AccordionPanel pb={4} pl={8}>
                Pour utiliser cette application, vous devez ...
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left" p={4}>
                    Comment trouver une application ?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              <AccordionPanel pb={4} pl={8}>
                Les fonctionnalités disponibles sont ...
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left" p={4}>
                    Quel type de contrat en colocation ?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              <AccordionPanel pb={4} pl={8}>
                Les fonctionnalités disponibles sont ...
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left" p={4}>
                    Comment fonctionne la marketplace ?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              <AccordionPanel pb={4} pl={8}>
                Les fonctionnalités disponibles sont ...
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left" p={4}>
                    Comment puis-je vous contacter en cas de problème sur l'application ou la marketplace ?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              <AccordionPanel pb={4} pl={8}>
                Les fonctionnalités disponibles sont ...
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
        </Box>
    );
}
