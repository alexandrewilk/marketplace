import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import {auth, db} from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { serverTimestamp, setDoc, doc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { Dots } from "react-activity";
import {toast} from 'react-toastify'
import "react-activity/dist/library.css";
import '../style.css/SignUp.css'


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
    <section className="container">
      <div className="signup-form">
        <h1 className="title">S'inscrire</h1>
        <form className="form" onSubmit={onSubmit}>
          <input type='text' id='name' value={name} onChange={onChange} placeholder='Nom' className="input-field" />
          <input type='email' id='email' value={email} onChange={onChange} placeholder='Email' className="input-field" />
          <input type='password' id='password' value={password} onChange={onChange} placeholder='Mot de passe' className="input-field" />
          {loading ? <Dots /> :<button type='submit' className='submit-button'>S'inscrire</button>}
        </form>
        <p className="links">
          Déjà membre ? <Link to="/sign-in" className='link'>Se Connecter</Link>
        </p>
      </div>
      <div className="image">
        <img src={require('../assets/images/SignIn.jpg')} alt="Image description" />
      </div>
    </section>
  );
}
