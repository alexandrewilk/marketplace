import React, { useEffect, useState } from 'react'
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, FormControl, Input, FormLabel, ModalFooter, useDisclosure, ModalCloseButton, Textarea } from '@chakra-ui/react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { Dots } from 'react-activity'
import { useAuthStatus } from '../hooks/useAuthStatus'
import { useNavigate } from 'react-router-dom'

//todo: modifierstructurebdd pr add listingId 
export default function SendMessagePopup({ listing }) {
    //setup modal
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    //random setup
    const navigate = useNavigate()
    const [message, setMessage] = useState('')

    //setup data
    const [loadingData, setLoadingData] = useState(false)
    const [receveurInfos, setReceveurInfors] = useState(null)
    const{loggedIn, loading} = useAuthStatus(); 
    if(loading){
      return <Dots/>
    }
    if(!loggedIn){
      return (<>
        <Button onClick={onOpen}>Contacter l'annonceur</Button>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Vous n'êtes pas connecté !</ModalHeader>
            <ModalCloseButton />
            {loading ? <Dots/> : 
            <ModalBody pb={6}>
  
              <FormControl mt={4}>
                <FormLabel>Connectez vous pour pouvoir contacter l'annonceur.</FormLabel>
                <Textarea isDisabled placeholder='Se connecter pour envoyer un message...' />
              </FormControl>
            </ModalBody>}
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={(e)=>{e.preventDefault();navigate('/sign-in')}}>
                Se connecter
              </Button>
              <Button onClick={onClose}>Annuler</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
  
      )
    }
    if(!listing){
      return <Dots/>
    }
    if(auth.currentUser.uid == listing.data.userRef){
      return(
        <Button>Cette annonce vous appartient</Button>
      )
    }
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
    async function handleSendNewMessage(){
      if(message==''){alert('Le message est vide!'); return}
      let docId = auth.currentUser.uid < listing.data.userRef ? auth.currentUser.uid+'AND='+listing.data.userRef+'REF='+listing.id : listing.data.userRef+'AND='+auth.currentUser.uid+'REF='+listing.id
      try{
      const chatDoc = await getDoc(doc(db, 'Chats', docId))
      if(chatDoc.exists()){
        alert("Vous avez déjà contacté l'annonceur, retrouvez votre échange avec lui dans l'onglet paramètres ")
        return
      }
      const entry = {
        chatters : [auth.currentUser.uid, listing.data.userRef],
        listingId : listing.id,
        texts : [{
          from : auth.currentUser.uid,
          message : message,
          timestamp : Date.now()
        }],
        lastMessage : Date.now()
      }
      await setDoc(doc(db, 'Chats', docId), entry)
      alert("L'annonceur a bien reçu votre message. Vous serez prévenu par mail de sa réponse. Retrouvez l'historique de vos messages dans l'onglet paramètre")
      window.location.reload()
    }catch(err){
      alert(err.message); return
    }
    }

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
              <div>L'annonceur recevra un email. Vous pouvez retrouver l'historique de vos messages dans l'onglet Paramètres.</div>
              <FormControl mt={4}>
                <FormLabel>Message</FormLabel>
                <Textarea placeholder='Envoyer un message...' onChange={(e)=>setMessage(e.target.value)}/>
              </FormControl>
            </ModalBody>}
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={(e)=>{e.preventDefault();handleSendNewMessage()}}>
                Envoyer
              </Button>
              <Button onClick={onClose}>Annuler</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
  
  )
}
