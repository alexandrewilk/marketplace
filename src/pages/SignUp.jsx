import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import {auth, db} from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { serverTimestamp, setDoc, doc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { Dots } from "react-activity";
import {toast} from 'react-toastify'
import "react-activity/dist/library.css";

export default function SignUp() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email : "",
    password: "",
  })
  const {name, email, password} = formData
  function onChange(e){
    setFormData((prev) =>({
      ...prev,
      [e.target.id] : e.target.value
    }))
  }
  async function onSubmit(e){
    e.preventDefault()
    try {
      //registering in auth
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      updateProfile(auth.currentUser, {displayName: name})
      // creating the user profile in firestore
      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()
      await setDoc(doc(db, 'Users', userCredential.user.uid), formDataCopy).then(()=>(navigate('/')))
    } catch (error) {
      toast.error(error.message)
    }finally{
      setLoading(false)
    }
  }
  return (
    <section>
      <h1 className='text-2xl text-center'>Sign UP</h1>
      <div className='text-center'>
      <form className='m-auto max-w-xs flex flex-col' onSubmit={onSubmit}>
      <input type='text' id='name' value={name} onChange={onChange} placeholder='nom' className='rounded'/>
        <input type='email' id='email' value={email} onChange={onChange} placeholder='email' className='rounded'/>
        <input type='password' id='password' value={password} onChange={onChange} placeholder='password' className='rounded'/>
        {loading ? <Dots /> :<button type='submit' className='bg-blue-600 text-white rounded my-3'>S'inscrire</button>}
      </form>
      
      <p>
          Déjà membre ?<Link to="/sign-in" className='text-red-800'>Se Connecter</Link>
      </p>
      </div>
    </section>
  )
}
