import React, { useState } from 'react'
import '../styles/home.css'
import { Box, Heading, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';



export default function Home() {
  const [ville, setVille] = useState('');
  const navigate = useNavigate();

  function handleKeyDown(e){
    if(e.key=='Enter'){
      navigate(`/recherche/${ville}`)
    }
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
          onChange={(e)=>{e.preventDefault();setVille(e.target.value)}}
        />
      </InputGroup>
    </Box>
    </div>
  )
}