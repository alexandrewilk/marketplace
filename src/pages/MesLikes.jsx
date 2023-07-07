import React, { useEffect, useState } from 'react'
import { Text, Container, Grid, Breadcrumb, Box, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, } from '@chakra-ui/react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Dots } from 'react-activity';
import AnnonceCard from '../components/AnnonceCardPageMesLikes';


export default function MesLikes() {
  const [loading, setLoading] = useState(true)
  const [likes, setLikes] = useState([])
  useEffect(()=>{
    async function getData(){
      try {
        const userData = await getDoc(doc(db, 'Users', auth.currentUser.uid))
        const likes = userData.data().likes ? userData.data().likes : []
        let likesData = []
        for (let listingID of likes){
          const likeData = await getDoc(doc(db, 'Listings', listingID))
          if(likeData.exists()){
          likesData.push({id: likeData.id, data: likeData.data()})}
        }
        setLikes(likesData)
        console.log(likesData)
      } catch (error) {
        alert(error.message)
      }finally{setLoading(false)}
    }
    getData();
  }, [])
  return (
    <Box height="calc(100vh - 64px)">
    <Container maxWidth="1200px" mt={70}>
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href='/Settings'>Paramètres</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href='/MesLikes'>Mes annonces sauvegardées</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
    <Text fontSize="4xl" as="b">Mes annonces sauvegardées</Text>
    {loading ? <Dots/> : 
              <Grid templateColumns={{ base: "1fr", md: "repeat(5, 1fr)" }} gap={4} mt={4}>
                {likes.map((l)=>{return(
                  <AnnonceCard key={l.id} data={l.data} id = {l.id}/>
                )})}
              </Grid>
              }
  </Container>
  </Box>
  )
}
