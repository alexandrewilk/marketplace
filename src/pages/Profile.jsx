import React, {useState} from 'react'
import {auth, db} from '../firebase'
import { useNavigate } from 'react-router-dom'
import { Dots } from 'react-activity'
import "react-activity/dist/library.css";
import {toast} from 'react-toastify'
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
export default function Profile() {
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
    <>
    <section>
      <h1 className='text-center text-2xl'>Profile</h1>
      <div className='text-center'>
        <h2>nom :{name}</h2>
        <form onSubmit={onSubmit}>
          <input type = 'text' id='newName' value={newName} onChange={(e)=>onChange(e)} placeholder='Nouveau nom'/>
          {loading ? <Dots/> :<button type='submit'>Changer le nom</button>}
        </form>
        <h2>mail : {email}</h2>
        <button onClick={(e) =>handleLogout(e)}>SE DECONNECTER</button>
      </div>
    </section>
    </>
  )
}
