import React, { useEffect, useState } from 'react'
import { Text, Container, Grid, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, } from '@chakra-ui/react';
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
          likesData.push({id: likeData.id, data: likeData.data()})
        }
        setLikes(likesData)
      } catch (error) {
        alert(error.message)
      }finally{setLoading(false)}
    }
    getData();
  }, [])
  return (
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
              likes.map((l)=>{return(
                <AnnonceCard key={l.id} data={l.data} id = {l.id} pageLike/>
              )})}
  </Container>
  )
}
