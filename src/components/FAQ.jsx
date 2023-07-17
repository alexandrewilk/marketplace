import React from 'react';
import { Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Heading } from '@chakra-ui/react';

export default function FAQ() {
    return (
        <Box maxWidth="1400px">
            <Heading as='h3' size='lg' marginY={4}>Encore des questions ?</Heading>
            <Accordion defaultIndex={[0]} allowMultiple>
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box flex="1" textAlign="left">
                                Question 1
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box flex="1" textAlign="left">
                                Question 2
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </AccordionPanel>
                </AccordionItem>
                {/* Ajoutez d'autres question la */}
            </Accordion>
        </Box>
    );
}
