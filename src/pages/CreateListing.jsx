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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import fr from 'date-fns/locale/fr'
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import { toast } from 'react-toastify'
import { motion } from "framer-motion";


const MotionFormControl = motion(FormControl);
const MotionHeading = motion(Heading);

registerLocale('fr', fr)
const logements = ['Villa', 'Appartement', 'Maison', 'Studio'];
const rooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const libraries = ['places']

const steps = [
  { label: "Etape 1"},
  { label: "Etape 2"},
  { label: "Etape 3"},
];



export default function CreateListing() {
    const mapsapikey = "AIzaSyBy-Pv6t0C93aMTyaPQsziS9Al6xmLTFQo"
    // tout les hooks
    const [id, setId] = useState('')
    const [openSection, setOpenSection] = useState(null);
    const [logement, setLogement] = useState('');
    const [nbRooms, setNbRooms] = useState(null);
    const [loyer, setLoyer] = useState('');
    const [matterportLink, setMatterportLink] = useState('');
    const [images, setImages] = useState(null);
    const [loading, setLoading] = useState(false);
    const [desc, setDesc] = useState('');
    const [co, setCo] = useState(null);
    const [source, setSource] = useState(null);
    const [regles, setRegles] = useState([]);
    const [meuble, setMeuble] = useState(null);
    const [equipement, setEquipement] = useState([]);
    const [surface, setSurface] = useState('');
    const [nbOccupants, setNbOccupants] = useState(null);
    const [animateSecondPage, setAnimateSecondPage] = useState(false);
    const [dispoDate, setDispoDate] = useState(new Date())
    // Constante pour faire fonctionner les steps
    const { nextStep, prevStep, reset, activeStep, setStep } = useSteps({
      initialStep: 0,
    });
    const isLastStep = activeStep === steps.length - 1;
    const [hasCompletedAllSteps, setHasCompletedAllSteps] = useState(false)

    //useRef
    const adresseRef = useRef();

    // const pour l'UI
    const bg = useColorModeValue("gray.200", "gray.700");
    const formColumnWidth = useBreakpointValue({ base: "100%", md: "50%" });
    const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
    const [isLargerThan400] = useMediaQuery("(min-width: 400px)");

    // Initialisation des autres librairies
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: "AIzaSyBy-Pv6t0C93aMTyaPQsziS9Al6xmLTFQo",
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
        // Vérifiez la taille de l'image avant de l'uploader
        const MAX_SIZE = 2 * 1024 * 1024; // 2 Mo
        if (image.size > MAX_SIZE) {
          reject(new Error("L'image est trop grande. Veuillez télécharger une image de moins de 2 Mo."));
          return;
        }
    
        const filename = `${auth.currentUser.uid}-${image.name}-${uuid()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on('state_changed',
          (snapshot) => {
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
            reject(error);
          },
          () => {
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
      if(!isLastStep){
        nextStep()
        return;
      }
    
      if(logement == ''){
        toast.error("Merci d'indiquer un type de logement avant de continuer!");
        return;
      }
      if(!nbRooms){
        toast.error("Merci d'indiquer le nombre de pièces avant de continuer !");
        return;
      }
      if(adresseRef == ''){
        toast.error("Merci d'indiquer l'adresse avant de continuer ! (L'adresse n'est pas accessible aux autres utilisateurs)");
        return;
      }
      if(isNaN(loyer)){
        toast.error("Merci d'indiquer un loyer avant de continuer !");
        return;
      }
      if(!images){
        toast.error("Merci d'uploader au moins une photo avant de continuer !");
        return;
      }
      if(images.length > 6){
        toast.error("Au plus 6 photos peuvent être uploadées !");
        return;
      }
    
      try {
        setLoading(true);
        const adresse = adresseRef.current.value;
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${adresse}&key=AIzaSyDPQKJFj0k8yKbKJlwi5K3Olt0blbsVAOs`);
        const data = await response.json();
    
        if(data.status !== 'OK'){
          alert(`Votre adresse n'a pas été trouvée!`);
          console.log(adresse);
          console.log(data.status);
          console.log(data.results);
          console.log(data.error_message);
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
          ...(matterportLink && { matterportLink: matterportLink }),
          ville: ville,
          desc: desc,
          co: co ? co : '',
          regles: regles ? regles : [],
          meuble: meuble ? meuble : null,
          surface: surface ? surface : '',
          nbOccupants: nbOccupants ? nbOccupants : 0,
          dispoDate: dispoDate,
          equipements: equipement ? equipement : []
        };
        const collectionRef = collection(db, 'Listings');
        const docRef = await addDoc(collectionRef, entry);
        setId(docRef.id);
        nextStep();
        setHasCompletedAllSteps(true);
      } catch (error) {
        alert(error.message);
      } finally {
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
        <Container maxWidth="1200px" mt={70} mb={70} h="calc(100vh - 64px)">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href='/Settings'>
                 <Box maxWidth={isLargerThan400 ? 'auto' : '100px'} isTruncated={isLargerThan400 ? false : true}>Paramètres</Box>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/MesAnnonces'>
                <Box maxWidth={isLargerThan400 ? 'auto' : '100px'} isTruncated={isLargerThan400 ? false : true}>Mes annonces</Box>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/Déposer-une-annonce'>
                <Box maxWidth={isLargerThan400 ? 'auto' : '100px'} isTruncated={isLargerThan400 ? false : true}>Ajouter une annonce</Box>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Text fontSize={isLargerThan768 ? "4xl" : "2xl"} as="b">Ajouter une annonce</Text>

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
              <MotionHeading 
                fontSize="xl" 
                textAlign="left" 
                mb={4} 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0 }}
              >
              {label}
              </MotionHeading>
              
              {/* Première page du form */}
              {index === 0 && 
                  <form>
                  <Flex direction={{ base: 'column', md: 'row' }} gap='10'>
                    <Stack spacing={4} width={{ base: '100%', md: '50%' }} height={isLargerThan768 ? "300px" : "400px"}>
                      <Flex direction={{ base: 'column', md: 'row' }} gap='2'>
                        <MotionFormControl 
                          id="logement" 
                          isRequired 
                          onFocus={() => handleFocus("section1")} 
                          onBlur={() => handleFocus(null)} 
                          initial={activeStep === 0 ? { opacity: 0, y: 50 } : {}}
                          animate={activeStep === 0 ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 1, delay: 0.2 }}
                        >
                          <FormLabel>Type de Logement</FormLabel>
                            <Select placeholder="Type de logement" onChange={(e) => setLogement(e.target.value)}>
                              {logements.map((option) => (
                                <option value={option} key={option}>{option}</option>
                              ))}
                            </Select>
                          </MotionFormControl>

                          <MotionFormControl 
                            id="room" 
                            isRequired onFocus={() => handleFocus("section2")} 
                            onBlur={() => handleFocus(null)} 
                            initial={activeStep === 0 ? { opacity: 0, y: 50 } : {}}
                            animate={activeStep === 0 ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 1, delay: 0.4 }}
                          >
                            <FormLabel>Nombre de Pièces</FormLabel>
                            <Select placeholder="Nombre de pièces" onChange={(e) => setNbRooms(e.target.value)}>
                              {rooms.map((option, index) => (
                                <option value={option} key={option}>{index === 9 ? option + '+' : option}</option>
                              ))}
                            </Select>
                          </MotionFormControl>
                        </Flex>

                        <MotionFormControl 
                          id="adresse" 
                          isRequired 
                          onFocus={() => handleFocus("section3")} 
                          onBlur={() => handleFocus(null)}
                          initial={activeStep === 0 ? { opacity: 0, y: 50 } : {}}
                          animate={activeStep === 0 ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 1, delay: 0.6 }}
                          >
                          <FormLabel>Adresse</FormLabel>
                          <Autocomplete>
                            <Input ref={adresseRef} placeholder="Adresse"/>
                          </Autocomplete>
                        </MotionFormControl>

                        <MotionFormControl 
                          isRequired 
                          id="nbOccupants"
                          initial={activeStep === 0 ? { opacity: 0, y: 50 } : {}}
                          animate={activeStep === 0 ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 1, delay: 0.8 }}
                        >
                          <FormLabel>Nombre de colocataire</FormLabel>
                          <Select placeholder="Nombre de colocataire" onChange={(e)=> setNbOccupants(e.target.value)}>
                          {rooms.map((option, index) => (
                                <option value={option} key={option}>{index === 9 ? option + '+' : option}</option>
                              ))}
                          </Select>
                        </MotionFormControl>
                      </Stack>

                      {isLargerThan768 && (
                        <Stack spacing={4} width={{ base: '100%', md: '50%' }} height="300px" mt={8}>
                          {activeStep === 0 ? <HelpForm openSection={openSection} section="section1" emoji="🏘️" title="Type du logement" helpText="Sélectionnez le type de logement correspondant au mieux à la colocation." delay={.2}/> : null }
                          {activeStep === 0 ? <HelpForm openSection={openSection} section="section2" emoji="🛌" title="Nombre de pièce" helpText="Indiquez le nombre de pièce qu'il y a dans le logement." delay={.4}/> : null }
                          {activeStep === 0 ? <HelpForm openSection={openSection} section="section3" emoji="📍" title="Adresse" helpText="Indiquez l'adresse précise ou approximative de la colocation." delay={.6}/> : null }
                        </Stack>
                      )}
                    </Flex>
                  </form>
              }

              {/* Deuxieme page du form */}
              {index === 1 && 
                <form>
                  <Flex direction={{ base: 'column', md: 'row' }} gap='10'>
                    <Stack spacing={4} width={{ base: '100%', md: '50%' }} height={isLargerThan768 ? "300px" : "400px"}>
                      <Flex direction={{ base: 'column', md: 'row' }} gap='2'>
                        <MotionFormControl 
                          id="loyer" 
                          isRequired 
                          onFocus={() => handleFocus("section4")} 
                          onBlur={() => handleFocus(null)}
                          initial={{ opacity: 0, y: 50 }}
                          animate={activeStep === 1 ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 1, delay: 0.2 }}
                        >
                          <FormLabel>Loyer</FormLabel>
                          <Input type="number" placeholder="Loyer" onChange={(e) => setLoyer(e.target.value)}/>
                        </MotionFormControl>

                        <MotionFormControl 
                          id="m2" 
                          isRequired 
                          onFocus={() => handleFocus("section5")} 
                          onBlur={() => handleFocus(null)}
                          initial={{ opacity: 0, y: 50 }}
                          animate={activeStep === 1 ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 1, delay: 0.4 }}
                        >
                          <FormLabel>Surface en m2</FormLabel>
                          <Input type="number" placeholder="Surface" onChange={(e) => setSurface(e.target.value)}/>
                        </MotionFormControl>
                      </Flex>

                      <MotionFormControl 
                        id="description" 
                        isRequired 
                        onFocus={() => handleFocus("section6")} 
                        onBlur={() => handleFocus(null)}
                        initial={{ opacity: 0, y: 50 }}
                        animate={activeStep === 1 ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1, delay: 0.6 }}
                      >
                        <FormLabel>Description</FormLabel>
                        <Textarea placeholder="Description" onChange={(e) => setDesc(e.target.value)}/>
                      </MotionFormControl>

                      <MotionFormControl 
                        id="images" 
                        isRequired 
                        onFocus={() => handleFocus("section7")} 
                        onBlur={() => handleFocus(null)}
                        initial={{ opacity: 0, y: 50 }}
                        animate={activeStep === 1 ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1, delay: 0.8 }}
                      >
                        <FormLabel>Image</FormLabel>
                        <Box position="relative" textAlign="center" width="100%" backgroundColor="gray.100" borderRadius="6px">
                          <Button as="label" htmlFor="file">{images ? images.length == 0 ? "Choisir 6 images max." : images?.length+" photos ont été sélectionnées !": "Choisir 6 images max."}</Button>
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
                      </MotionFormControl>
                    </Stack>

                    {isLargerThan768 && (
                        <Stack spacing={4} width={{ base: '100%', md: '50%' }} height="300px" mt={8}>
                          {activeStep === 1 ? <HelpForm openSection={openSection} section="section4" emoji="💶" title="Loyer" helpText="Indiquez le montant du loyer sans les charges." delay={.2}/> : null }
                          {activeStep === 1 ? <HelpForm openSection={openSection} section="section5" emoji="📐" title="Surface" helpText="Précisez la surface totale du logement." delay={.4}/> : null }
                          {activeStep === 1 ? <HelpForm openSection={openSection} section="section6" emoji="💬" title="Description" helpText="Utilisez des mots clés pertinents, soyez précis, clair et concis. Mettez en avant les atouts uniques de votre bien." delay={.6}/> : null }
                          {activeStep === 1 ? <HelpForm openSection={openSection} section="section7" emoji="🌆" title="Image" helpText="Optez pour des photos claires, nettes, bien éclairées, et représentatives de l'espace. Variez les angles de prise de vue." delay={.8}/> : null }
                        </Stack>
                      )}
                  </Flex>
                </form>
              }

              {/* Troisième page du form */}
              {index === 2 && 
                <form>
                  <Flex direction={{ base: 'column', md: 'row' }} gap='10'>
                    <Stack spacing={4} width={{ base: '100%', md: '50%' }} height={isLargerThan768 ? "300px" : "400px"}>
                      <Flex direction={{ base: 'column', md: 'row' }} gap='2'>
                        <MotionFormControl 
                          id="co" 
                          onFocus={() => handleFocus("section8")} 
                          onBlur={() => handleFocus(null)}
                          initial={{ opacity: 0, y: 50 }}
                          animate={activeStep === 2 ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 1, delay: 0.2 }}
                        >
                          <FormLabel>Colocation ou Coliving ?</FormLabel>
                          <Select placeholder="Type de location" onChange={(e) => setCo(e.target.value)}>
                            <option value={'colocation'}>colocation</option>
                            <option value={'coliving'}>coliving</option>
                          </Select>
                        </MotionFormControl>

                        <MotionFormControl 
                          id="meuble" 
                          onFocus={() => handleFocus("section9")} 
                          onBlur={() => handleFocus(null)}
                          initial={{ opacity: 0, y: 50 }}
                          animate={activeStep === 2 ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 1, delay: 0.4 }}
                          >
                          <FormLabel>Meublé ?</FormLabel>
                          <Select placeholder="Type de location" onChange={(e) => setMeuble(e.target.value)}>
                            <option value={true}>Oui</option>
                            <option value={false}>Non</option>
                          </Select>
                        </MotionFormControl>
                      </Flex>

                      <Flex direction={{ base: 'column', md: 'row' }} gap='2'>
                        <MotionFormControl
                        initial={{ opacity: 0, y: 50 }}
                        animate={activeStep === 2 ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1, delay: 0.6 }}
                        >
                          <FormLabel>Disponible à partir de...</FormLabel>
                          <DatePicker selected={dispoDate} onChange={(date)=>setDispoDate(date)} locale="fr" className="my-datepicker"/>
                        </MotionFormControl>

                      <MotionFormControl 
                        id="regles" 
                        onFocus={() => handleFocus("section10")} 
                        onBlur={() => handleFocus(null)}
                        initial={{ opacity: 0, y: 50 }}
                        animate={activeStep === 2 ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1, delay: 0.8 }}
                      >
                        <FormLabel>Règles particulières</FormLabel>
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
                        </MotionFormControl>
                        </Flex>
                        <Flex direction={{ base: 'column', md: 'row' }} gap='2'>
                        <MotionFormControl 
                          id="regles" 
                          onFocus={() => handleFocus("section11")} 
                          onBlur={() => handleFocus(null)}
                          initial={{ opacity: 0, y: 50 }}
                          animate={activeStep === 2 ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 1, delay: 1 }}
                        >
                        <FormLabel>Equipements</FormLabel>
                          <MultiSelect
                            isMulti
                            isSearchable={true}
                            placeholder='Equipements...'
                            onChange={(e)=>setEquipement(e.map(elt=>elt.value))}
                            options={[
                                {value: 'machine-a-laver', label:'Machine à laver'}, 
                                {value:'lave-vaisselle', label:'Lave vaisselle'}, 
                                {value:'wifi', label:'Wi-Fi'}, 
                                {value:'tv', label:'TV'}
                              ]}
                          />
                        </MotionFormControl>
                        </Flex>

                        <MotionFormControl 
                          id="matterport" 
                          onFocus={() => handleFocus("section4")} 
                          onBlur={() => handleFocus(null)}
                          initial={{ opacity: 0, y: 50 }}
                          animate={activeStep === 2 ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 1, delay: 1.2 }}
                      >
                          <FormLabel>Lien Matterport</FormLabel>
                          <Input 
                              value={matterportLink} 
                              onChange={(e) => setMatterportLink(e.target.value)} 
                              placeholder="Lien du Matteport" 
                          />
                      </MotionFormControl>

                      </Stack> 

                      {isLargerThan768 && (
                        <Stack spacing={4} width={{ base: '100%', md: '50%' }} height="300px" mt={8}>
                          {activeStep === 2 ? <HelpForm openSection={openSection} section="section8" emoji="🏠" title="Colocation ou coliving" helpText="Certaine personne chez un coliving ou une colocation en particulier." delay={.2} /> : null }
                          {activeStep === 2 ? <HelpForm openSection={openSection} section="section9" emoji="🛋️" title="Meublé" helpText="Précise s'il s'agit d'un meublé ou non." delay={.4}/> : null }
                          {activeStep === 2 ? <HelpForm openSection={openSection} section="section10" emoji="📕" title="Régles spéciales" helpText="N'hésitez pas à indiquez si vous avez des règles spéciales, elles facilitent la recherche des locataires." delay={.6}/> : null }
                          {activeStep === 2 ? <HelpForm openSection={openSection} section="section11" emoji="📕" title="Equipement" helpText="Indiquez tout les équipements de la colocation, cela augmente grandement la valeur de votre logement." delay={.8}/> : null }
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
                        <Heading fontSize="small" textAlign={"center"} onClick={(e)=>{e.preventDefault(); navigate(`/listings/${id}`)}}> Voir la page de l'annonce...</Heading>
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
                          <Button 
                            size="sm" 
                            colorScheme="blue" 
                            onClick={(e) => {
                              if (isLastStep) {
                                handleAddListing(e);
                              } else {
                                nextStep();  // Cela doit augmenter la valeur d'activeStep
                              }
                            }}
                            isLoading={loading}
                          >
                            {isLastStep ? "Publier mon Annonce" : "Suivant"}
                          </Button>

                        </>
                      )}
                    </Flex>
                  </Flex>
                </Container>
  );
}
