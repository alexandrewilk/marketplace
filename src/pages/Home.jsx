import React, { useState } from 'react'
import '../styles/home.css'
import { Box, Heading, Input, InputGroup, InputLeftElement, VStack, ListItem, Container, List, ListProps } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const villes = require('../assets/data/villes2.json').map((v)=>{return v.city})

function search(input){
  return villes.filter((v)=>{return(v.slice(0, input.length) == input)})
}

export default function Home() {
  const [ville, setVille] = useState('');
  const [suggestions, setSuggestions] = useState([])
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const navigate = useNavigate();
  
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
    <Box
      bgImage="url('https://coloc.fr/wp-content/uploads/2023/04/HeroImage.webp')"
      bgSize="cover"
      bgPosition="center"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      textAlign="center"
      margin="20px"
      borderRadius="12px"
      height="86vh"
      maxWidth="1400px"
      maxHeight="676px"

    >
      <Heading as="h1" size="2xl" marginBottom="1rem">
        Trouve ta colocation <Box as="span" display="inline-block" borderBottom="2px solid">idéale</Box>
      </Heading>
      <Box position="relative" maxWidth="400px" marginBottom="2rem">
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="white" />}
          />
          <Input
            width="500px"
            type="search"
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
  )
}
