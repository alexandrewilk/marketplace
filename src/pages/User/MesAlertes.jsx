import React, { useState, useEffect } from 'react';
import { Text, Box, Container, Flex, Center, Breadcrumb, BreadcrumbItem, BreadcrumbLink, useMediaQuery } from '@chakra-ui/react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import No_Alerte from '../../assets/images/No_Alerte.png';

export default function MesAlertes() {
  const [isLargerThan400] = useMediaQuery("(min-width: 400px)");
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Utiliser pour créer des alertes
  // const [nom, setNom] = useState('');
  // const [logement, setLogement] = useState('');
  // const [nbPieces, setNbPieces] = useState('');
  // const [prixMax, setPrixMax] = useState('');

  useEffect(() => {
    async function getAlerts() {
      try {
        setLoading(true);
        const docRef = doc(db, 'Users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const userData = docSnap.data();
          let alertesArray = [];
  
          if (userData.alertes && typeof userData.alertes === 'object') {
            alertesArray = Object.keys(userData.alertes).map(key => {
              return { id: key, value: userData.alertes[key] };
            });
            console.log(alertesArray)
          }
  
          setAlertes(alertesArray);
        } else {
          console.log("Document n'existe pas");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des alertes:", error);
      } finally {
        setLoading(false);
      }
    }
  
    getAlerts();
  }, []);
  
  

  // async function handleDelete(alert) {
  //   try {
  //     setLoading(true);
  //     let alertesUpdated = alertes.filter(a => a !== alert);
  //     await updateDoc(doc(db, 'Users', auth.currentUser.uid), { alertes: alertesUpdated });
  //     window.location.reload(true);
  //   } catch (error) {
  //     alert(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // Utiliser pour créer des alertes
  // async function handleAddAlertes(){
  //   try {
  //     setLoading(true);
  //     let alertesUpdated = [...alertes, {nom: nom, type: logement, nbPieces: nbPieces, prixMax: prixMax}];
  //     await updateDoc(doc(db, 'Users', auth.currentUser.uid), {alertes: alertesUpdated});
  //     window.location.reload(true)
  //   } catch (error) {
  //     alert(error.message)
  //   }finally{
  //     setLoading(false)
  //   }
  // }

  return (
    <Box height="calc(100vh - 64px)">
    <Container maxWidth="1200px" mt={70}>
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href='/Settings'>
          <Box maxWidth={isLargerThan400 ? 'auto' : '100px'} isTruncated={isLargerThan400 ? false : true}>Paramètres</Box>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href='/MesAlertes'>
          <Box maxWidth={isLargerThan400 ? 'auto' : '100px'} isTruncated={isLargerThan400 ? false : true}>Mes alertes</Box>
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
    {loading ? (
        <Text>Chargement des alertes...</Text>
      ) : alertes.length > 0 ? (
        <Box>
          {alertes.map((alerte, index) => (
            <Box key={index} /* ou une autre clé unique si disponible */>
              <Text fontSize="lg"><b>{alerte.id}:</b> {alerte.value}</Text>
              {/* Vous pouvez ajouter des boutons ou d'autres actions ici */}
            </Box>
          ))}
        </Box>
      ) : (
        <Flex justifyContent="center">
          <Center flexDirection="column" mt="80px">
            <img src={No_Alerte} alt="Pas d'alerte"/>
            <Text fontSize="xl" fontWeight="bold" marginBottom="1rem">Tu n'as aucune alerte paramétrée</Text>
          </Center>
        </Flex>
      )}
    </Container>
  </Box>
  )
}
