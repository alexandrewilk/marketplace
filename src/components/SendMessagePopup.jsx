import React, { useEffect, useState } from 'react'
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, FormControl, Input, FormLabel, ModalFooter, useDisclosure, ModalCloseButton, Textarea } from '@chakra-ui/react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { Dots } from 'react-activity'

//todo: modifierstructurebdd pr add listingId 
export default function SendMessagePopup({ receveurUid }) {
    //setup modal
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    //setup data
    const [loading, setLoading] = useState(false)
    const [receveurInfos, setReceveurInfors] = useState(null)
    //todo : logic pr check si déjà contacter et sinon creer doc + serverside cloudfunctions pr chatsWith doc user
    // useEffect(()=>{
    //     async function getData(){
    //         try {
    //             setLoading(true)
    //             const infos = await getDoc(doc(db, 'Users', receveurUid))
    //             setReceveurInfors({id: infos.id, data: infos.data()})
                

    //         } catch (error) {
    //             alert(error.message)
    //         }finally{setLoading(false)}
    //     }
    //     getData();
    // }, [])
    
    return (
      <>
        <Button onClick={onOpen}>Contacter l'annonceur</Button>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Nouveau message</ModalHeader>
            <ModalCloseButton />
            {loading ? <Dots/> : 
            <ModalBody pb={6}>
  
              <FormControl mt={4}>
                <FormLabel>Last name</FormLabel>
                <Textarea placeholder='Envoyer un message...' />
              </FormControl>
            </ModalBody>}
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3}>
                Envoyer
              </Button>
              <Button onClick={onClose}>Annuler</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
  
  )
}
