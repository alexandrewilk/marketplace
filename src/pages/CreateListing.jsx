import React, { useState, useRef }from 'react'
import { storage, auth, db } from '../firebase'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuid } from 'uuid'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import { 
    SkeletonText, Container, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text, Box, Button, Flex, Heading,
    Input, Grid, useMediaQuery, Stack, FormControl, FormLabel, Select, Textarea
  } from '@chakra-ui/react' 
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useBreakpointValue, useColorModeValue } from "@chakra-ui/react"
import MultiSelect from 'react-select';
import HelpForm from '../components/HelpForm';

const logements = ['Villa', 'Appartement', 'Maison', 'Studio'];
const rooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const libraries = ['places']

const steps = [
  { label: "Etape 1"},
  { label: "Etape 2"},
  { label: "Etape 3"},
];



export default function CreateListing() {
    
    // tout les hooks
    const [openSection, setOpenSection] = useState(null);
    const [logement, setLogement] = useState('');
    const [nbRooms, setNbRooms] = useState(null);
    const [loyer, setLoyer] = useState('');
    const [images, setImages] = useState(null);
    const [loading, setLoading] = useState(false);
    const [desc, setDesc] = useState('');
    const [co, setCo] = useState(null);
    const [source, setSource] = useState(null);
    const [regles, setRegles] = useState([]);
    const [meuble, setMeuble] = useState(null);
    const [equipement, setEquipement] = useState([]);
    const [dateDispo, setDateDispo] = useState(null);
    const [surface, setSurface] = useState('');
    
    // Constante pour faire fonctionner les steps
    const { nextStep, prevStep, reset, activeStep, setStep } = useSteps({
      initialStep: 0,
    });
    const isLastStep = activeStep === steps.length - 1;
    const hasCompletedAllSteps = activeStep === steps.length;

    //useRef
    const adresseRef = useRef();

    // const pour l'UI
    const bg = useColorModeValue("gray.200", "gray.700");
    const formColumnWidth = useBreakpointValue({ base: "100%", md: "50%" });
    const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

    // Initialisation des autres librairies
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
      libraries: libraries,
    });
    const navigate = useNavigate();

    // Ouverture et fermeture des card d'help
    const handleFocus = (section) => {
      setOpenSection(section);
    };

    // Fonction pour upload l'image
    async function storeImage(image) {
      return new Promise((resolve, reject) => {
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
            reject(error);
          }, 
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }
    
    // Fonction pour upload l'annonce
    async function handleAddListing(e) {
      e.preventDefault();
      if(!isLastStep){return}
      if(logement == ''){
        alert('type de log');
        return;
      }
      if(!nbRooms){
        alert('nb de rooms');
        return;
      }
      if(adresseRef == ''){
        alert('adresse?');
        return;
      }
      if(isNaN(loyer)){
        alert('loyer?');
        return;
      }
      if(!images){
        alert('uploaduneimage');
        return;
      }
      if(images.length > 6){
        alert('max 6 img');
        return;
      }

      try{
        //adresseRef est ladresse autocomplete par google, on appelle ici google pr check ladresse existe et recup la data
        setLoading(true)
        const adresse = adresseRef.current.value
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${adresse}&key=${process.env.REACT_APP_MAPS_API_KEY}`);
        const data = await response.json();
        
        if(data.status !== 'OK'){
          alert(`ton adresse n'a pas été trouvée!`);
          console.log(data.status);
          setLoading(false);
          return;
        }
        const ville = data.results[0].address_components.find(elt => elt.types.includes('locality')).long_name;
        const geolocation = {};
        geolocation.lat = data.results[0].geometry.location.lat;
        geolocation.lng = data.results[0].geometry.location.lng;
        const imgUrls = await Promise.all([...images].map((image) => storeImage(image)));
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
          desc: desc,
          co : co ? co : '',
          regles : regles ? regles : [],
          meuble : meuble ? meuble : null,
          surface: surface ? surface : '',
        };
        const collectionRef = collection(db, 'Listings');
        const docRef = await addDoc(collectionRef, entry);
        alert('bien créé !');

        navigate(`/listings/${docRef.id}`);
      }catch(error){
        alert(error.message);
      }finally{
        setLoading(false);
      }
    }

    // Rendu de composant
    if (!isLoaded) {
      return (
        <SkeletonText />
      );
    }

    return (
        <Container maxWidth="1200px" mt={70} mb={70}>
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

          <Flex flexDir="column" width="100%">
            <Flex alignItems="center" justifyContent="center" mb={8}>
              {steps.map((step, index) => (
                <Box 
                  key={index}
                  height="4px"
                  width="33%"
                  bg={index <= activeStep ? "blue.400" : "gray.300"}
                  mx={2}
                  mt={4}
                  rounded="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                />
              ))}
            </Flex>

          {steps.map(({ label }, index) => (
            <Box key={label} sx={{ p: 4, rounded: "md", display: activeStep === index ? 'block' : 'none' }}>
              <Heading fontSize="xl" textAlign="left" mb={4}>{label}</Heading>
              
              {/* Première page du form */}
              {index === 0 && 
                  <form>
                  <Flex direction={{ base: 'column', md: 'row' }} gap='10'>
                    <Stack spacing={4} width={{ base: '100%', md: '50%' }} height="300px">
                      <Flex direction={{ base: 'column', md: 'row' }} gap='2'>
                        <FormControl id="logement" isRequired onFocus={() => handleFocus("section1")} onBlur={() => handleFocus(null)}>
                          <FormLabel>Type de Logement</FormLabel>
                            <Select placeholder="Type de logement" onChange={(e) => setLogement(e.target.value)}>
                              {logements.map((option) => (
                                <option value={option} key={option}>{option}</option>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl id="room" isRequired onFocus={() => handleFocus("section2")} onBlur={() => handleFocus(null)}>
                            <FormLabel>Nombre de Pièces</FormLabel>
                            <Select placeholder="Nombre de pièces" onChange={(e) => setNbRooms(e.target.value)}>
                              {rooms.map((option, index) => (
                                <option value={option} key={option}>{index === 9 ? option + '+' : option}</option>
                              ))}
                            </Select>
                          </FormControl>
                        </Flex>

                        <FormControl id="adresse" isRequired onFocus={() => handleFocus("section3")} onBlur={() => handleFocus(null)}>
                          <FormLabel>Adresse</FormLabel>
                          <Autocomplete>
                            <Input ref={adresseRef} placeholder="Adresse"/>
                          </Autocomplete>
                        </FormControl>
                      </Stack>

                      {isLargerThan768 && (
                        <Stack spacing={4} width={{ base: '100%', md: '50%' }} height="300px" mt={8}>
                          <HelpForm openSection={openSection} section="section1" emoji="🏘️" title="Type du logement" helpText="Voici l'aide pour le type de logement"/>
                          <HelpForm openSection={openSection} section="section2" emoji="🛌" title="Nombre de pièce" helpText="Voici l'aide pour le nombre de pièce"/>
                          <HelpForm openSection={openSection} section="section3" emoji="📍" title="Adresse" helpText="Voici l'aide pour l'adresse"/>
                        </Stack>
                      )}
                    </Flex>
                  </form>
              }

              {/* Deuxieme page du form */}
              {index === 1 && 
                <form>
                  <Flex direction={{ base: 'column', md: 'row' }} gap='10'>
                    <Stack spacing={4} width={{ base: '100%', md: '50%' }} height="300px">
                      <Flex direction={{ base: 'column', md: 'row' }} gap='2'>
                        <FormControl id="loyer" isRequired onFocus={() => handleFocus("section4")} onBlur={() => handleFocus(null)}>
                          <FormLabel>Loyer</FormLabel>
                          <Input type="number" placeholder="Loyer" onChange={(e) => setLoyer(e.target.value)}/>
                        </FormControl>

                        <FormControl id="m2" isRequired onFocus={() => handleFocus("section5")} onBlur={() => handleFocus(null)}>
                          <FormLabel>Surface en m2</FormLabel>
                          <Input type="number" placeholder="Surface" onChange={(e) => setSurface(e.target.value)}/>
                        </FormControl>
                      </Flex>

                      <FormControl id="description" isRequired onFocus={() => handleFocus("section6")} onBlur={() => handleFocus(null)}>
                        <FormLabel>Description</FormLabel>
                        <Textarea placeholder="Description" onChange={(e) => setDesc(e.target.value)}/>
                      </FormControl>

                      <FormControl id="images" isRequired onFocus={() => handleFocus("section7")} onBlur={() => handleFocus(null)}>
                        <FormLabel>Image</FormLabel>
                        <Box position="relative" textAlign="center" width="100%" backgroundColor="gray.100" borderRadius="6px">
                          <Button as="label" htmlFor="file">Choisir les fichiers</Button>
                          <Input 
                            id="file"
                            type='file' 
                            accept='.jpg, .png, .jpeg' 
                            multiple 
                            onChange={(e) => setImages(e.target.files)}
                            position="absolute"
                            left="0"
                            top="0"
                            opacity="0"
                            zIndex="2"
                            height="100%"
                            width="100%"
                            cursor="pointer"
                          />
                        </Box>
                      </FormControl>
                    </Stack>

                    {isLargerThan768 && (
                        <Stack spacing={4} width={{ base: '100%', md: '50%' }} height="300px" mt={8}>
                          <HelpForm openSection={openSection} section="section4" emoji="💶" title="Loyer" helpText="Voici l'aide pour le loyer"/>
                          <HelpForm openSection={openSection} section="section5" emoji="📐" title="Surface" helpText="Voici l'aide pour la surface"/>
                          <HelpForm openSection={openSection} section="section6" emoji="💬" title="Description" helpText="Voici l'aide pour la description"/>
                          <HelpForm openSection={openSection} section="section7" emoji="🌆" title="Image" helpText="Voici l'aide pour l'image"/>
                        </Stack>
                      )}
                  </Flex>
                </form>
              }

              {/* Troisième page du form */}
              {index === 2 && 
                <form>
                  <Flex direction={{ base: 'column', md: 'row' }} gap='10'>
                    <Stack spacing={4} width={{ base: '100%', md: '50%' }} height="300px">
                      <Flex direction={{ base: 'column', md: 'row' }} gap='2'>
                        <FormControl id="co" onFocus={() => handleFocus("section8")} onBlur={() => handleFocus(null)}>
                          <FormLabel>Colocation ou Coliving ?</FormLabel>
                          <Select placeholder="Type de location" onChange={(e) => setCo(e.target.value)}>
                            <option value={'colocation'}>colocation</option>
                            <option value={'coliving'}>coliving</option>
                          </Select>
                        </FormControl>

                        <FormControl id="meuble" onFocus={() => handleFocus("section9")} onBlur={() => handleFocus(null)}>
                          <FormLabel>Meublé ?</FormLabel>
                          <Select placeholder="Type de location" onChange={(e) => setMeuble(e.target.value)}>
                            <option value={true}>Oui</option>
                            <option value={false}>Non</option>
                          </Select>
                        </FormControl>
                      </Flex>

                      <FormControl id="regles" onFocus={() => handleFocus("section10")} onBlur={() => handleFocus(null)}>
                        <FormLabel>Règles particulières de la colocation</FormLabel>
                          <MultiSelect
                            isMulti
                            isSearchable={false}
                            placeholder='Règles'
                            onChange={(e)=>setRegles(e.map(elt=>elt.value))}
                            options={[
                                {value: 'non-fumeur', label:'Non Fumeur'}, 
                                {value:'only-femme', label:'Femme seulement'}, 
                                {value:'only-homme', label:'Homme seulement'}, 
                                {value:'ok-animaux', label:'Animaux bienvenus'}
                              ]}
                          />
                        </FormControl>
                      </Stack> 

                      {isLargerThan768 && (
                        <Stack spacing={4} width={{ base: '100%', md: '50%' }} height="300px" mt={8}>
                          <HelpForm openSection={openSection} section="section8" emoji="🏠" title="Colocation ou coliving" helpText="Voici l'aide pour la colocation ou coliving"/>
                          <HelpForm openSection={openSection} section="section9" emoji="🛋️" title="Meublé" helpText="Voici l'aide pour le meublé"/>
                          <HelpForm openSection={openSection} section="section10" emoji="📕" title="Régles spéciales" helpText="Voici l'aide pour les régles spéciales"/>
                        </Stack>
                      )}
                    </Flex> 
                  </form>
                  }
                </Box>  
              ))}

                    {hasCompletedAllSteps && (
                      <Box sx={{ my: 8, p: 8, rounded: "md" }}>
                        <Heading fontSize="xl" textAlign={"center"}>
                          Woohoo! Ton annonce est en ligne! 🎉
                        </Heading>
                      </Box>
                    )}

                    <Flex width="100%" justify="flex-end" gap={4}>
                      {hasCompletedAllSteps ? (
                        <Button size="sm" onClick={reset}>
                          Déposer une autre annonce
                        </Button>
                      ) : (
                        <>
                          <Button
                            isDisabled={activeStep === 0}
                            onClick={prevStep}
                            size="sm"
                            variant="ghost"
                          >
                            Précédent
                          </Button>
                          <Button size="sm" colorScheme="blue" onClick={(e) => {handleAddListing(e);nextStep()}} isLoading={loading}>
                            {isLastStep ? "Lister mon Annonce" : "Suivant"}
                          </Button>
                        </>
                      )}
                    </Flex>
                  </Flex>
                </Container>
  );
}
