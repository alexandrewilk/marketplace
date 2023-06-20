import React, { useState } from 'react'
import '../styles/home.css'
import { Box, Heading, Input, InputGroup, InputLeftElement, UnorderedList, ListItem } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const villes = require('../assets/data/villes2.json').map((v)=>{return v.city})

function search(input){
  return villes.filter((v)=>{return(v.slice(0, input.length) == input)})
}
export default function Home() {
  const [ville, setVille] = useState('');
  const [suggestions, setSuggestions] = useState([])
  const navigate = useNavigate();
  function handleKeyDown(e){ //naviguer quand lutilisateur presse entré
    if(e.key=='Enter'){
      navigate(`/recherche/${ville}`)
    }
  }
  function handleInput(e){
    e.preventDefault();
    if(e.target.value==''){setSuggestions([]);return}
    setVille(e.target.value);
    setSuggestions([...search(e.target.value)])
  }
  return (
    <div className="page">
    <Box
      bgImage="url('https://coloc.fr/wp-content/uploads/2023/04/HeroImage.webp')"
      bgSize="cover"
      bgPosition="center"
      minHeight="70vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      textAlign="center"
      padding="4rem"
      margin="20px"
      borderRadius="12px"
    >
      <Heading as="h1" size="2xl" marginBottom="1rem">
        Trouve ta colocation <Box as="span" display="inline-block" borderBottom="2px solid">idéale</Box>
      </Heading>
      <InputGroup maxWidth="400px" marginBottom="2rem">
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.300" />}
        />
        <Input
          type="search"
          placeholder="Entrez le nom de la ville..."
          onKeyDown={handleKeyDown}
          onChange={handleInput}
        />
        <UnorderedList>
        {suggestions.map((s)=>{return(
          <ListItem>{s}</ListItem>
        )})}
        </UnorderedList>
      </InputGroup>
     
    </Box>
    </div>
  )
}