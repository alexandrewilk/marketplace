import React, { useState } from 'react'
import '../styles/home.css'
import { Box, Heading, Input, InputGroup, InputLeftElement, VStack, ListItem, List, Image, Text } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import HowItWorks from '../components/HowItWorks';
import FAQ from '../components/FAQ';
import VilleCarroussel from '../components/VilleCarroussel';
import Entourement from '../assets/images/Entourement.svg';

const villes = require('../assets/data/villes2.json').map((v)=>{return v.city})

function search(input){
  return villes.filter((v)=>{return(v.slice(0, input.length) == input)})
}

export default function Home() {
  const [ville, setVille] = useState('');
  const [suggestions, setSuggestions] = useState([])
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  function handleKeyDown(e){ 
    switch(e.key) {
      case 'Enter': // naviguer quand l'utilisateur presse entré
        navigate(`/recherche/${suggestions[activeSuggestionIndex]}`);
        break;
      case 'ArrowUp': // sélectionner la suggestion précédente
        if (activeSuggestionIndex > 0) {
          setActiveSuggestionIndex(activeSuggestionIndex - 1);
        }
        break;
      case 'ArrowDown': // sélectionner la suggestion suivante
        if (activeSuggestionIndex < suggestions.length - 1) {
          setActiveSuggestionIndex(activeSuggestionIndex + 1);
        }
        break;
    }
  }

  function handleInput(e){
    e.preventDefault();
    if(e.target.value==''){
      setSuggestions([]);
      setActiveSuggestionIndex(0);
      return;
    }
    setVille(e.target.value);
    setSuggestions([...search(e.target.value)])
  }

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        margin="auto"
        flexDirection="column"
        textAlign="center"
        borderRadius="12px"
        height="86vh"
        maxWidth="1400px"
        maxHeight="676px"
        background="linear-gradient(white, deepskyblue)"
      >
        
        <Box position="relative" width="500px" height="100px">
          <Heading as="h1" size="2xl" color="white" position="absolute" top="50%" left="0" transform="translateY(-60%)" m={0} whiteSpace="nowrap">
              Trouve la colocation 
              <Box position="relative" display="inline">
                  <Text as="span" position="relative">  idéale</Text>
                  <Image src={Entourement} alt="Description of SVG" position="absolute" top={0} left={0} width="100%" height="100%"/>
              </Box>
          </Heading>
        </Box>

        <Box position="relative" maxWidth="400px" marginBottom="2rem">
          <InputGroup>
            <InputLeftElement
              height="50"
              pointerEvents="none"
              children={<SearchIcon color="gray" />}
            />
            <Input
              height="50"
              width="500px"
              type="search"
              backgroundColor="white"
              borderColor="white"
              placeholder="Entrez le nom de la ville..."
              onKeyDown={handleKeyDown}
              onChange={handleInput}
            />
          </InputGroup>
          {suggestions.length > 0 && (
              <VStack 
                align="start" 
                spacing={2} 
                width="100%" 
                maxHeight="200px" 
                overflowY="auto" 
                boxShadow="md" 
                borderRadius="md" 
                p={2} 
                backgroundColor="white" 
                position="absolute"
                mt={2} 
                zIndex={1}
              >
                <List w="100%">
                  {suggestions.map((s, index) => (
                    <ListItem 
                      key={s} 
                      p={2} 
                      bg={index === activeSuggestionIndex ? "gray.200" : "white"} 
                      borderRadius="md" 
                      width="100%"
                      align="start"
                      _hover={{ bg: "gray.200" }}
                    >
                      {s}
                    </ListItem>
                  ))}
                </List>
              </VStack>
            )}

        </Box>
      </Box>
      
      <VStack spacing={10} marginBottom="20px">
            <VilleCarroussel/>
            <HowItWorks/>
            <FAQ/>
        </VStack>
    </Box>
  )
}
