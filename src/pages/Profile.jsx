import React, {useState} from 'react'
import {auth} from '../firebase'
import { useNavigate } from 'react-router-dom'
export default function Profile() {
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const navigate = useNavigate();
  const {name, email} = formData
  function handleLogout(e){
    e.preventDefault()
    auth.signOut()
    navigate('/')
  }
  return (
    <>
    <section>
      <h1 className='text-center text-2xl'>Profile</h1>
      <div className='text-center'>
        <h2>nom :{name}</h2>
        <h2>mail : {email}</h2>
        <button onClick={(e) =>handleLogout(e)}>SE DECONNECTER</button>
      </div>
    </section>
    </>
  )
}
