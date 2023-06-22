import React, {useState, useEffect} from 'react'
import {auth, db} from '../firebase'
import { Link, useNavigate } from 'react-router-dom'
import { Dots } from 'react-activity'
import "react-activity/dist/library.css";
import {toast} from 'react-toastify'
import { updateProfile } from 'firebase/auth';
import { doc, getDocs, orderBy, updateDoc } from 'firebase/firestore';
import {HiOutlineHomeModern} from 'react-icons/hi2'
import { collection, query, where } from 'firebase/firestore';
import { Text, Box, Container, Grid, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, } from '@chakra-ui/react';

export default function Profile() {
  useEffect(()=>{
    async function getUserListing(){
      try {
        setLoadingList(true)
        const q = query(collection(db, 'Listings'), where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'));
        const querySnap = await getDocs(q);
        let listings = []
        querySnap.forEach((doc)=>{return(listings.push({
          id: doc.id,
          data: doc.data()
        }))})
        setListings(listings)
      } catch (error) {
        alert(error.message)
      }finally{setLoadingList(false)}
    }
    getUserListing();
  }, [])
  const [listings, setListings] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const [newName, setNewName] = useState('')
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const {name, email} = formData
  function handleLogout(e){
    e.preventDefault()
    auth.signOut()
    navigate('/')
  }
  function onChange(e){
    e.preventDefault()
    setNewName(e.target.value)
  }

  async function onSubmit(e){
    e.preventDefault()
    try {
      setLoading(true)
      if(auth.currentUser.displayName !== newName){
        await updateProfile(auth.currentUser, {displayName: newName})
        const docRef = doc(db, 'Users', auth.currentUser.uid)
        await updateDoc(docRef, {name: newName})
        window.location.reload(true)
      }
    } catch (error) {
      toast.error(error.message)
    }finally{
   setLoading(false)
    }
  }
  return (
    <Container maxWidth="1200px" mt={70}>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href='/Settings'>Paramètres</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href='/MesLikes'>Mes informations personnelles</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Text fontSize="4xl" as="b">Mes informations personnelles</Text>

      <div className='text-center flex flex-col items-center'>
        <h2>nom :{name}</h2>
        <form onSubmit={onSubmit}>
          <input type = 'text' id='newName' value={newName} onChange={(e)=>onChange(e)} placeholder='Nouveau nom'/>
          {loading ? <Dots/> :<button type='submit'>Changer le nom</button>}
        </form>
        <h2>mail : {email}</h2>
        <button onClick={(e) =>handleLogout(e)}>SE DECONNECTER</button>
        <button type='submit' className='bg-blue-600 max-w-xs'>
          <Link to='/create-listing'> 
          <HiOutlineHomeModern/> Mettre une annonce de colocation
          </Link>
        </button>
      </div>
      <div>
        <h1 className='text-2xl text-center'>MES ANNONCES</h1>
        {loadingList ? <Dots/> : listings.map((l)=>{
          return(
            <h1  key={l.id} onClick={(e)=>{e.preventDefault();navigate(`/listings/${l.id}`)}}>{l.data.adresse}</h1>
          )
        })}
      </div>
    </Container>
  )
}
