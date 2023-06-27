import React, { useState, useEffect, useRef }from 'react'
import { Dots } from "react-activity";
import {storage, auth, db} from '../firebase'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import {v4 as uuid} from 'uuid'
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import {useJsApiLoader, Autocomplete} from '@react-google-maps/api'
import { SkeletonText, Container, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text, Box, VStack, HStack, Heading, FormControl, FormLabel, Select, Input, Textarea, Button, Stack, Flex, Spacer } from '@chakra-ui/react' // New imports here

const logements = ['Villa', 'Appartement', 'Maison'];
const rooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const libraries = ['places']
export default function CreateListing() {
    const {isLoaded} = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
      libraries: libraries
    })
    const navigate = useNavigate();
    const [logement, setLogement] = useState('');
    const [nbRooms, setNbRooms] = useState(null);
    const adresseRef = useRef();
    const [loyer, setLoyer] = useState('');
    const [images, setImages] = useState(null);
    const [loading, setLoading] = useState(false);
    const [desc, setDesc] = useState('');

    async function storeImage(image){
        return new Promise((resolve, reject)=>{
            const filename = `${auth.currentUser.uid}-${image.name}-${uuid()}`;
            const storageRef = ref(storage, filename);
            const uploadTask = uploadBytesResumable(storageRef, image);
            uploadTask.on('state_changed',
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    reject(error)
  }, 
  () => {
    // Upload completed successfully, now we can get the download URL
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      resolve(downloadURL);
    });
  }
);
        })
    }
    async function handleAddListing(e){
        e.preventDefault();
        if(logement==''){
            alert('type de log')
            return
        }
        if(!nbRooms){
            alert('nb de rooms')
            return
        }
        if(adresseRef==''){
            alert('adresse?')
            return
        }
        if(isNaN(loyer)){
            alert('loyer')
            return
        }
        if(!images){
            alert('uploaduneimage')
            return
        }
        if(images.length > 6){
            alert('max 6 img')
            return
        }
        try{
            //getting lattitude and longitude from adresseRef
            setLoading(true)
            const adresse = adresseRef.current.value
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${adresse}&key=${process.env.REACT_APP_MAPS_API_KEY}`)
            const data = await response.json()

            
            
            if(data.status !== 'OK'){
              alert(`ton adresse n'a pas été trouvée!`)
              console.log(data.status)
              return
            }
            const ville = data.results[0].address_components.find(elt => elt.types.includes('locality')).long_name
            const geolocation = {};
            geolocation.lat = data.results[0].geometry.location.lat;
            geolocation.lng = data.results[0].geometry.location.lng;
            const imgUrls = await Promise.all([...images].map((image) => storeImage(image)))
            const entry = {
                type: logement,
                nbPieces: nbRooms,
                adresse: adresseRef.current.value,
                loyer: Number(loyer),
                imgUrls: imgUrls,
                timestamp: serverTimestamp(),
                userRef: auth.currentUser.uid,
                geolocation: geolocation,
                ville: ville,
                desc: desc
            }
            const collectionRef = collection(db, 'Listings');
            const docRef = await addDoc(collectionRef, entry)
            navigate(`/listings/${docRef.id}`)
        }catch(error){
            alert(error.message)
        }finally{
            setLoading(false);
          
        }
        


    }
    if(!isLoaded){
      return(
        <SkeletonText/>
      )
    }
    return (
        <Container maxWidth="1200px" mt={70}>
            <Breadcrumb>
            <BreadcrumbItem>
                <BreadcrumbLink href='/Settings'>Paramètres</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <BreadcrumbLink href='/MesAnnonces'>Mes annonces</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <BreadcrumbLink href='/create-listing'>Ajouter une annonce</BreadcrumbLink>
            </BreadcrumbItem>
            </Breadcrumb>
    <Text fontSize="4xl" as="b">Ajouter une annonce</Text>
      <Flex direction="column" align="center" mt="20px">
          <form>
              <Stack spacing={4} width="500px">
                  <FormControl id="logement">
                      <FormLabel>Type de Logement</FormLabel>
                      <Select placeholder="Type de logement" onChange={(e) => {setLogement(e.target.value)}}>
                          {logements.map((option) => (
                              <option value={option} key={option}>{option}</option>
                          ))}
                      </Select>
                  </FormControl>
                  <FormControl id="room">
                      <FormLabel>Nombre de Pièces</FormLabel>
                      <Select placeholder="Nombre de pièces" onChange={(e) => {setNbRooms(e.target.value)}}>
                          {rooms.map((option, index) => (
                              <option value={option} key={option}>{index === 9 ? option + '+' : option}</option>
                          ))}
                      </Select>
                  </FormControl>
                  <FormControl id="adresse">
                      <FormLabel>Adresse</FormLabel>
                      <Autocomplete>
                      <Input ref={adresseRef} placeholder="Adresse"/>
                      </Autocomplete>
                  </FormControl>
                  <FormControl id="loyer">
                      <FormLabel>Loyer</FormLabel>
                      <Input type="number" placeholder="Loyer" onChange={(e) => {setLoyer(e.target.value)}}/>
                  </FormControl>
                  <FormControl id="description">
                      <FormLabel>Description</FormLabel>
                      <Textarea placeholder="Description" onChange={(e) => {setDesc(e.target.value)}}/>
                  </FormControl>
                  <FormControl id="images">
                      <FormLabel>Image</FormLabel>
                      <Input type='file' accept='.jpg, .png, .jpeg' multiple onChange={(e) => {setImages(e.target.files)}}/>
                  </FormControl>
                  <Button colorScheme="blue" onClick={handleAddListing} isLoading={loading}>Lister mon Annonce</Button>
              </Stack>
          </form>
      </Flex>
      </Container>
  );
}
