import React, {useState} from 'react'
import { Button, Modal, ModalOverlay, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import { Dots } from 'react-activity';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import colors from '../../constant/color';

export default function SaveAlerteButton({ ville, currentFilters }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { loggedIn, loadingAuth } = useAuthStatus();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function handleAddAlerte() {
      try {
          setLoading(true);
          let uuid = auth.currentUser.uid;
          let entry = currentFilters;
          entry['ville'] = ville;
          await updateDoc(doc(db, 'Users', uuid), { alertes: entry });
          setMessage("Alerte enregistrée ! Retrouvez toutes vos alertes dans l'onglet Paramètres");
      } catch (error) {
          setMessage(error.message);
      } finally {
          setLoading(false);
      }
  }

  if (loadingAuth) {
      return <Dots />;
  }

  return (
      <>
          {loggedIn ?
              <>
                  <Button onClick={onOpen} minInlineSize="100px" bgColor={colors.primary} textColor="white">Alerte</Button>
                  <Modal isOpen={isOpen} onClose={onClose}>
                      <ModalOverlay />
                      <ModalContent>
                          <ModalHeader>Alerte</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody>
                            {message && <div style={{ color: 'green' }}>{message}</div>}
                            <em>En cliquant sur enregistrer, vous recevrez par mail des updates hebdomadaires sur les derniers logements correspondant aux filtres que vous avez sélectionnés.</em>
                            <br /><br />
                            <strong>Filtres sélectionnés :</strong>
                            <ul>
                                {Object.entries(currentFilters).filter(([key, value]) => value != null).map(([key, value]) => (
                                    <li key={key}>{`${key}: ${value}`}</li>
                                ))}
                            </ul>
                            Gérez toutes vos alertes dans l'onglet Paramètres !
                        </ModalBody>
                      <ModalFooter>
                          {loading ? <Dots /> : 
                          <Button colorScheme='blue' mr={3} onClick={handleAddAlerte}>
                              Enregistrer l'alerte pour ne rien rater
                          </Button>}
                      </ModalFooter>
                  </ModalContent>
              </Modal>
          </>
          :
          <>
              <Button onClick={onOpen} minInlineSize="100px" bgColor="blue" textColor="white">Alerte</Button>
              <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                      <ModalHeader>Alerte</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                          Connectez-vous pour enregistrer cette recherche comme une alerte et recevoir chaque semaine les dernières updates !
                      </ModalBody>

                      <ModalFooter>
                          <Button colorScheme='blue' mr={3} onClick={(e) => { e.preventDefault(); navigate('/sign-in'); }}>
                              Se Connecter
                          </Button>
                      </ModalFooter>
                  </ModalContent>
              </Modal>
          </>}
  </>
);
}